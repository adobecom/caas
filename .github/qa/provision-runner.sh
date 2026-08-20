#!/bin/bash
# Provision a macOS machine as a CaaS self-hosted QA runner.
# Captures everything the agent-review job needs at the machine level, so a new
# Mac is reproducible from source control (the agent code itself lives in
# .github/qa and is pulled on checkout — this only sets up the host).
#
# Prereqs: Homebrew, Google Chrome installed, the machine signed in (auto-login).
set -euo pipefail
H="$HOME"

echo "1/3  Node 18 (webpack 3 build needs Node <19) + gh + git"
/opt/homebrew/bin/brew install node@18 gh git || true

echo "2/3  Persistent real Chrome with remote debugging (CDP) for the agent to attach to"
PLIST="$H/Library/LaunchAgents/com.adobecom.caas-qa-chrome.plist"
cat > "$PLIST" <<PL
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>com.adobecom.caas-qa-chrome</string>
  <key>ProgramArguments</key><array>
    <string>/Applications/Google Chrome.app/Contents/MacOS/Google Chrome</string>
    <string>--remote-debugging-port=9222</string>
    <string>--remote-debugging-address=127.0.0.1</string>
    <string>--user-data-dir=$H/caas-qa-chrome-profile</string>
    <string>--no-first-run</string>
    <string>--no-default-browser-check</string>
    <string>--disable-session-crashed-bubble</string>
    <string>--hide-crash-restore-bubble</string>
  </array>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardOutPath</key><string>$H/caas-qa-chrome.out.log</string>
  <key>StandardErrorPath</key><string>$H/caas-qa-chrome.err.log</string>
</dict></plist>
PL
launchctl bootstrap "gui/$(id -u)" "$PLIST" 2>/dev/null || launchctl load -w "$PLIST" || true

echo "3/3  Point the Actions runner at the persistent Chrome (CDP) for every job"
RUNNER_ENV="$H/actions-runner/.env"
if [ -f "$RUNNER_ENV" ]; then
  grep -q '^CDP_URL=' "$RUNNER_ENV" || echo 'CDP_URL=http://127.0.0.1:9222' >> "$RUNNER_ENV"
else
  echo "  (runner not registered yet — see below)"
fi

echo
echo "Done. Verify Chrome/CDP:  curl -s http://127.0.0.1:9222/json/version"
echo
echo "Register the runner (manual, one-time — get a token from"
echo "GitHub > adobecom/caas > Settings > Actions > Runners > New self-hosted runner):"
echo "  cd ~/actions-runner && ./config.sh --url https://github.com/adobecom/caas \\"
echo "    --token <REG_TOKEN> --labels self-hosted,ARM64,qa-audit --unattended"
echo "  echo 'CDP_URL=http://127.0.0.1:9222' >> ~/actions-runner/.env"
echo "  # then run it via launchd (run.sh) so it survives reboots"
