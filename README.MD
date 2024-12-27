# CaaS

CaaS stands for **Content as a Service** (or **Cards as a Service**, depending on your team’s internal language). This repository houses the Adobe.com code and assets related to building and rendering dynamic collections of content cards (articles, resources, videos, etc.) across Adobe’s web properties.

---

## Table of Contents
1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Scripts](#scripts)
6. [Configuration](#configuration)
7. [Building & Deployment](#building--deployment)
8. [Testing](#testing)
9. [Troubleshooting & Common Issues](#troubleshooting--common-issues)
10. [Collaboration Protocol](#collaboration-protocol)
11. [License](#license)

---

## Overview

CaaS provides a modular, scalable way to publish and display content cards on various Adobe.com pages. It leverages a configuration-driven approach, allowing content teams to quickly spin up card collections, filter panels, pagination, and more — all from a single, centralized platform.

### Why CaaS?
- **Scalable**: Designed to handle a wide range of card volumes and page traffic.
- **Configurable**: Easily update layout, filters, and card designs via JSON configs.
- **Extensible**: Integrate with multiple data endpoints and content sources.
- **Performance-Oriented**: Implements lazy loading, caching, and on-demand fetching for optimal page speed.

---

## Key Features

- **Dynamic Card Rendering**: Renders cards based on JSON configs (e.g., `config.collection`, `config.layout`).
- **Filter & Search Panels**: Offers robust filtering by tags, categories, or custom metadata, plus integrated search.
- **Theming & Styling**: Supports multiple modes (light, dark, etc.) and custom card designs.
- **Pagination & Load More**: Choose between paginated navigation or a “Load More” approach.
- **Analytics Tracking**: Built-in analytics hooks to capture impressions and user interactions.

---

## Project Structure

A typical structure might look like this:
```
caas/
├── dist/
│   ├── app.css
│   ├── main.source.js
│   └── ...
├── src/
│   ├── components/
│   │   ├── Card/
│   │   ├── FilterPanel/
│   │   └── ...
│   ├── utils/
│   ├── index.js
│   └── ...
├── mock-json/
│   ├── all-art-board-15-cards-show.json
│   └── ...
├── tests/
│   ├── unit/
│   ├── integration/
│   └── ...
├── dependencies/
│   ├── typekit.css
│   ├── dexter/
│   └── ...
├── package.json
├── README.md
└── ...
```

### Directory Descriptions:
- **`dist/`**: Compiled and bundled files (e.g., production-ready assets).
- **`src/`**: Core source code for components, utilities, and rendering logic.
- **`mock-json/`**: Example or testing JSON endpoints for development or QA.
- **`tests/`**: Unit, integration, and end-to-end tests.
- **`dependencies/`**: Third-party CSS or scripts that aren’t included via NPM or require manual updates.

---

## Getting Started

### Clone the Repository
```bash
git clone https://github.com/adobecom/caas.git
cd caas
```

### Install Dependencies
```bash
npm install
# or
yarn
```

### Run Development Server
```bash
npm run dev
# or
yarn dev
```
This typically starts a local dev server (e.g., `http://localhost:8080`).

### Open Your Browser
Visit `http://localhost:8080` (or the relevant port) to view and interact with the CaaS UI.

---

## Scripts

Commonly used scripts (as defined in `package.json`):
- `npm run dev`: Starts the development server (with hot reloading).
- `npm run build`: Builds optimized and minified production bundles.
- `npm run test`: Runs the test suite (unit/integration).
- `npm run lint`: Runs ESLint or other linting tools to enforce coding standards.
- `npm run format`: Formats the code base (e.g., Prettier) for consistency.

---

## Configuration

Many aspects of CaaS are driven by JSON-based configs:
- **`config.collection`**: Defines how cards are displayed (layout type, gutters, container width, etc.).
- **`config.filterPanel`**: Enables filter panels, sets filter logic (AND/OR), and supports i18n copy.
- **`config.sort`**: Allows for custom or predefined sorting (e.g., alphabetical, date-based).
- **`config.pagination`**: Chooses between “paged” or “Load More” pagination.
- **`config.customCard`**: Injects custom card templates.

---

## Building & Deployment

### Build for Production
```bash
npm run build
```
Generates production-ready assets (CSS, JS) in `dist/`.

### Deploy
Copy the contents of `dist/` (and any relevant `.html` files) to your server. For Adobe I/O or internal pipelines, refer to your team’s documentation.

---

## Testing

- **Unit Tests**: Located in `tests/unit/`. Ensure each component or utility has adequate coverage.
- **Integration Tests**: Located in `tests/integration/`. Test end-to-end flows like filtering logic and pagination.

### Run Tests:
```bash
npm run test
```

---

## Troubleshooting & Common Issues

- **CORS Errors**: Ensure your server or endpoint has proper CORS headers.
- **Missing Images**: Check background-image URLs or JSON endpoints for correct references.
- **Layout Issues**: Confirm layout configs are valid.
- **404 Errors**: Verify endpoint or JSON paths exist and are spelled correctly.

---

## Collaboration Protocol

1. **Create an Issue**: Open a GitHub Issue before starting work on a new feature or bug fix.
2. **Branching**: Use the feature-branch model (`feature/`, `fix/`, `hotfix/`).
3. **Pull Requests**:
   - Reference the Issue number in the PR description.
   - Include details, screenshots, or demos.
4. **Reviews**:
   - Require at least one reviewer approval.
   - Ensure all CI checks pass.
5. **Releases**: Periodically create release tags from the `main` branch.

---

## License

This project is licensed under the **Apache License 2.0** (or whichever license is applicable to Adobecom projects). See the `LICENSE` file for details.

Thank you for contributing to CaaS! Feel free to open an Issue or submit a Pull Request with any questions or suggestions.
