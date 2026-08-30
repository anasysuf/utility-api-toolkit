# Utility API Toolkit

[![CI Status](https://github.com/anasysuf/utility-api-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/anasysuf/utility-api-toolkit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org)

Modular, open source REST API toolkit consolidating everyday developer utilities into a single high-performance service. Built with TypeScript and Fastify.

> **Self-Hosted Open Source Project**: This repository is designed to be self-hosted. There is no official public cloud API provided by the maintainer. You can clone and run it locally, or deploy it on your own server or cloud infrastructure.

---

## Features

1. **Interactive Web Playground (`/`)**: Built-in browser interface to test image compression, QR code generation, and slug conversion directly with live previews.
2. **Interactive OpenAPI Docs (`/docs`)**: Interactive Swagger UI documentation with live request execution for every endpoint.
3. **Image Compressor**: In-memory image optimization for JPEG, PNG, and WebP formats using Sharp with customizable quality settings.
4. **QR Code Generator**: Generates QR codes on demand as PNG binary, SVG markup, or Base64 data URLs.
5. **Text to Slug Converter**: Transforms arbitrary strings into URL-safe slugs with customizable separators and case options.
6. **Modular Architecture**:
   - Strict request validation with Zod schemas.
   - Built-in rate limiting per IP or API key.
   - Simple API key protection via `x-api-key`.
   - Structured error handling with consistent JSON envelopes.
   - Complete OpenAPI 3.0 specification (`openapi.yaml`).

---

## Project Structure

```
utility-api-toolkit/
├── src/
│   ├── routes/          # HTTP route handlers (Image, QR, Slug)
│   ├── middleware/      # Auth, rate limiting, validation, error handler
│   ├── lib/             # Pure, framework-agnostic business logic services
│   ├── types/           # Shared TypeScript interfaces and types
│   └── index.ts         # Fastify initialization and plugin registration
├── tests/               # Vitest unit and integration test suites
├── openapi.yaml         # OpenAPI 3.0 specification
├── .env.example         # Template environment configuration
├── .github/workflows/   # Automated CI/CD pipeline
├── CONTRIBUTING.md      # Development setup and contribution guidelines
├── LICENSE              # MIT License
└── README.md
```

Route handlers are decoupled from service logic in `src/lib/`, allowing all business logic to be tested directly without booting the HTTP server.

---

## Getting Started

### 1. Prerequisites

- Node.js 20.x or 22.x LTS
- npm 10.x or higher

### 2. Installation

```bash
git clone https://github.com/anasysuf/utility-api-toolkit.git
cd utility-api-toolkit
npm install
```

### 3. Environment Configuration

Copy the sample environment file:

```bash
cp .env.example .env
```

Default variables in `.env`:

```env
PORT=3000
NODE_ENV=development
API_KEY=test-secret-key-12345
RATE_LIMIT_MAX=60
RATE_LIMIT_WINDOW_MS=60000
MAX_FILE_SIZE_BYTES=10485760
```

### 4. Running the Server

Start in development mode with live reload:

```bash
npm run dev
```

Build and run in production mode:

```bash
npm run build
npm start
```

Verify service status:

```bash
curl http://localhost:3000/health
```

### 5. Accessing the Interactive UI

Once the service is started, open your web browser:
- **Interactive Web Playground**: [http://localhost:3000](http://localhost:3000) (test all 3 utilities directly via browser)
- **Interactive Swagger UI**: [http://localhost:3000/docs](http://localhost:3000/docs) (explore schemas and execute API calls)

---

## API Reference & Examples

All utility endpoints reside under the `/api/v1` prefix and require the `x-api-key` header when `API_KEY` is configured.

### Response Conventions

All JSON responses follow a consistent envelope:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "STRING_CODE",
    "message": "Human readable description",
    "details": [ ... ]
  }
}
```

---

### 1. Text to Slug

Converts input text into a clean URL-friendly slug.

- **Endpoint**: `POST /api/v1/slug`
- **Headers**:
  - `Content-Type: application/json`
  - `x-api-key: test-secret-key-12345`

#### Example Request

```bash
curl -X POST http://localhost:3000/api/v1/slug \
  -H "Content-Type: application/json" \
  -H "x-api-key: test-secret-key-12345" \
  -d '{
    "text": "Clean Code and Modular Architecture in TypeScript",
    "lowercase": true,
    "separator": "-"
  }'
```

#### Example Response (200 OK)

```json
{
  "success": true,
  "data": {
    "slug": "clean-code-and-modular-architecture-in-typescript"
  }
}
```

---

### 2. QR Code Generator

Generates a QR code in PNG binary, SVG markup, or Base64 format.

- **Endpoint**: `POST /api/v1/qr/generate`
- **Headers**:
  - `Content-Type: application/json`
  - `x-api-key: test-secret-key-12345`

#### Example Request: Base64 JSON Output

```bash
curl -X POST http://localhost:3000/api/v1/qr/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: test-secret-key-12345" \
  -d '{
    "text": "https://github.com/anasysuf/utility-api-toolkit",
    "format": "base64",
    "size": 300
  }'
```

#### Example Response (200 OK)

```json
{
  "success": true,
  "data": {
    "qr": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",
    "format": "base64",
    "size": 300
  }
}
```

#### Example Request: PNG File Output

```bash
curl -X POST http://localhost:3000/api/v1/qr/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: test-secret-key-12345" \
  -d '{
    "text": "https://example.com",
    "format": "png",
    "size": 300
  }' \
  --output qrcode.png
```

---

### 3. Image Compressor

Processes and optimizes uploaded images in memory using Sharp.

- **Endpoint**: `POST /api/v1/image/compress`
- **Headers**:
  - `Content-Type: multipart/form-data`
  - `x-api-key: test-secret-key-12345`
- **Parameters**:
  - `file` (required): Image binary (JPEG, PNG, or WebP up to 10MB)
  - `quality` (optional): Integer 1 to 100 (default 80)
  - `format` (optional): `jpeg`, `png`, or `webp`
  - `response` (optional): `binary` (default) or `json`

#### Example Request: Binary Image Output

```bash
curl -X POST http://localhost:3000/api/v1/image/compress \
  -H "x-api-key: test-secret-key-12345" \
  -F "file=@sample.jpg" \
  -F "quality=75" \
  -F "format=webp" \
  --output compressed.webp
```

#### Example Request: JSON Metadata and Base64 Output

```bash
curl -X POST http://localhost:3000/api/v1/image/compress \
  -H "x-api-key: test-secret-key-12345" \
  -F "file=@sample.jpg" \
  -F "quality=75" \
  -F "format=webp" \
  -F "response=json"
```

#### Example Response (200 OK)

```json
{
  "success": true,
  "data": {
    "format": "webp",
    "contentType": "image/webp",
    "originalSize": 184520,
    "compressedSize": 62310,
    "savingsPercentage": 66.23,
    "base64": "data:image/webp;base64,UklGRt..."
  }
}
```

---

## Testing & Quality Assurance

Run the automated test suite with Vitest:

```bash
npm run test
```

Watch mode for active development:

```bash
npm run test:watch
```

Run code linter:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

Verify production build:

```bash
npm run build
```

---

## Self-Hosting Guide

This project includes a multi-stage `Dockerfile` and can be self-hosted on your own infrastructure (VPS, Docker, Render, Railway, Fly.io):

1. Set your environment variables:
   - `PORT=3000`
   - `NODE_ENV=production`
   - `API_KEY=<your-secure-random-token>`
   - `RATE_LIMIT_MAX=60`
   - `RATE_LIMIT_WINDOW_MS=60000`
2. Build and start using Docker:
   ```bash
   docker build -t utility-api-toolkit .
   docker run -p 3000:3000 --env-file .env utility-api-toolkit
   ```
3. Or build and run directly with Node.js:
   ```bash
   npm ci && npm run build
   npm start
   ```

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on code standards, local setup, and pull request procedures.

## License

This project is open source and licensed under the [MIT License](LICENSE).
