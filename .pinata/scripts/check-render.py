#!/usr/bin/env python3
"""Renderability smoke: the built bundle must actually mount a card collection.

Port of .github/qa/caas-render.mjs (the deterministic half of the Feature QA
Review agent) into a worktree gate. Unit tests exercise components in jsdom;
webpack can still produce a bundle that throws on a real page, and nothing
else on the merge path loads one. This serves the repo's own local harness --
index.html + dist/main.min.js + mock-json/ -- in headless chromium and fails
unless the Consonant grid mounts, cards render, and the console stays clean.

Requirements come from the harness image (playwright + chromium are baked in);
run locally with any python that has playwright installed. Builds the bundle
first if dist/main.min.js is missing, using the repo's own documented flag
(NODE_OPTIONS=--openssl-legacy-provider -- webpack 3 vs OpenSSL 3, see
.github/workflows/qa-agent-review.yml).
"""

from __future__ import annotations

import http.server
import os
import socket
import subprocess
import sys
import threading
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MIN_CARDS = 1
# consonant-Card is the per-card class; the grid/container proves the
# collection shell mounted even when a config yields zero cards.
GRID_SELECTOR = ".consonant-CardsGrid, [class*='consonant-Container']"
CARD_SELECTOR = ".consonant-Card"


def ensure_bundle() -> None:
    if (ROOT / "dist" / "main.min.js").is_file():
        return
    print("dist/main.min.js missing; building (openssl-legacy-provider)...")
    env = {**os.environ, "NODE_OPTIONS": "--openssl-legacy-provider"}
    subprocess.run(["npm", "run", "build"], cwd=ROOT, env=env, check=True, timeout=600)


def serve() -> tuple[http.server.ThreadingHTTPServer, int]:
    handler = lambda *a, **kw: http.server.SimpleHTTPRequestHandler(  # noqa: E731
        *a, directory=str(ROOT), **kw
    )
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        port = probe.getsockname()[1]
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, port


def main() -> int:
    ensure_bundle()
    httpd, port = serve()
    # MUST be the literal hostname "localhost": index.html's endpoint switch
    # (line ~93) only serves mock-json when location.hostname == "localhost";
    # any other host sends the page to the live chimera API, which a sandboxed
    # worktree cannot (and must not) depend on.
    url = f"http://localhost:{port}/index.html"
    from playwright.sync_api import sync_playwright

    console_errors: list[str] = []
    page_errors: list[str] = []
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True)
            page = browser.new_page()
            page.on(
                "console",
                lambda m: console_errors.append(m.text[:200]) if m.type == "error" else None,
            )
            page.on("pageerror", lambda e: page_errors.append(str(e)[:200]))
            page.goto(url, wait_until="load", timeout=30_000)
            try:
                page.wait_for_selector(GRID_SELECTOR, timeout=20_000)
            except Exception:
                pass  # judged below with evidence, not by the raw timeout
            grid = page.query_selector(GRID_SELECTOR) is not None
            cards = len(page.query_selector_all(CARD_SELECTOR))
            browser.close()
    finally:
        httpd.shutdown()

    print(f"grid={grid} cards={cards} console_errors={len(console_errors)} page_errors={len(page_errors)}")
    for e in (console_errors + page_errors)[:6]:
        print(f"  ! {e}")
    failures = []
    if not grid:
        failures.append("the Consonant collection container never mounted")
    if cards < MIN_CARDS:
        failures.append(f"expected >= {MIN_CARDS} rendered .consonant-Card, saw {cards}")
    if page_errors:
        failures.append("uncaught page errors during render")
    # Resource-load 404s are baseline noise on the local harness (index.html
    # references www.caas.com/libs/utils/lana.js, absent when served locally)
    # and never indicate a bundle regression; a thrown error in the bundle
    # surfaces as a pageerror or a non-resource console error instead.
    real_console = [e for e in console_errors if not e.startswith("Failed to load resource")]
    if real_console:
        failures.append("console errors during render")
    if failures:
        print("RENDERABILITY FAIL: " + "; ".join(failures))
        return 1
    print("RENDERABILITY PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
