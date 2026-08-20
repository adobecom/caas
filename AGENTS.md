# Agent Entry Point

This repo is the home of the Adobe CaaS service (also known as Chimera). If you are an AI agent reading this repo to assist with a task, use this file as your entry point.

## Where things live

- **CaaS service source** — this repo. The React-based Configurator, the dist bundles, e2e tests, and Phase-A canary-beacon work.
- **CaaS consumer-side code** — lives in the Milo monorepo (`adobecom/milo`), specifically `libs/blocks/caas`, `libs/blocks/caas-config`, `libs/blocks/caas-marquee`, `tools/send-to-caas`, and `tools/caas-import`. The CaaS team owns those modules; the Milo team owns Milo itself.
- **Write service (server-side validation + persistence)** — `wcms/chimera-xdm-postservice` (Java/Spring). Deployment config lives in `wcms/chimera-xdm-postservice-deploy` (Helm values for Dev/Stage/Production).
- **Auth/CORS proxy** — `wcms/milo-caas-develop` (Adobe I/O Runtime action).
- **Read service** — `wcms/chimera-io` (AIO Runtime action at `adobeioruntime.net`).

## Runbooks

- [`docs/onboarding/CONSUMER_ONBOARDING.md`](docs/onboarding/CONSUMER_ONBOARDING.md) — standard CaaS onboarding for a new adobe.com property. **Scope: US / single-locale only.** Covers mandatory and optional steps spanning this repo, Milo, and the post service deploy repo.
- [`docs/onboarding/TROUBLESHOOTING.md`](docs/onboarding/TROUBLESHOOTING.md) — common failure modes during onboarding and verification, indexed by symptom.

Lingo / language-first routing (multi-locale URL handling) is **out of scope** for this team and not documented here. Consumers needing locale support should coordinate with the team that owns Lingo via the appropriate channel.

## Conventions

- Branches off `main`, no fork. The repo's CI relies on branch-based PRs (see `README.MD`).
- Commit messages flow through husky prompts — ticket number, change type, short description.
- Ticket prefix is `MWPW-<number>` (e.g. `MWPW-193054: Add consumer onboarding runbook`).
- Slack: `#javelin-friends` for access requests and team coordination.
