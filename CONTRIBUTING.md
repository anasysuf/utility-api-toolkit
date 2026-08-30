# Contributing to Utility API Toolkit

Thank you for your interest in contributing. We welcome bug fixes, performance improvements, and feature additions that fit the modular scope of this toolkit.

## Development Workflow

### Prerequisites

- Node.js 20.x LTS or higher
- npm 10.x or higher
- Git

### Initial Setup

1. Fork the repository and clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/utility-api-toolkit.git
   cd utility-api-toolkit
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Prepare your local environment configuration:
   ```bash
   cp .env.example .env
   ```

4. Start the development server with live reload:
   ```bash
   npm run dev
   ```

## Code Quality Standards

Every submission must meet these quality checks before review:

1. **Unit and Integration Tests**:
   ```bash
   npm run test
   ```
   Add test coverage in `tests/` for any new service logic or route handlers.

2. **Linting and Formatting**:
   ```bash
   npm run lint
   npm run format
   ```

3. **TypeScript Compilation**:
   ```bash
   npm run build
   ```

## Commit Conventions

We follow Conventional Commits:

- `feat: add webp support to image service`
- `fix: handle edge case in slug generator`
- `docs: update curl examples in README`
- `test: add integration test for rate limit headers`
- `refactor: simplify multipart file stream handling`

## Pull Request Process

1. Create a descriptive branch from `main` (example: `feat/avif-support` or `fix/slug-trimming`).
2. Make targeted changes. Keep route handling separated from pure service functions.
3. Ensure all tests pass locally.
4. Submit the pull request with a clear description of the problem solved and test results.
