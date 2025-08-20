# Introduction

This project consists of a NuxtJS project that exposes API endpoints to serve as a server sided API for the frontend.

- [Introduction](#introduction)
  - [Architecture](#architecture)
  - [Design](#design)
  - [Testing](#testing)
  - [Prerequisites](#prerequisites)
  - [Getting started](#getting-started)
    - [Restoring dependencies](#restoring-dependencies)
    - [Development](#development)

## Architecture

// TODO

## Design

UI designs and specifications are available in Figma and locally in the repo.
**[ABN Amro FE Assessment - Figma Design](https://www.figma.com/design/9dXS5EyhEiaUBQzBcDuzcc/ABN-Amro-FE-Assessment?node-id=0-1&t=bwAuYkjpKPIY1mj6-1)**

The design is just a fast mockup without the correct configuration of colors / typography, without layout breakpoints, component specifications / ...

## Testing

Unit tests are built with Vitest and Vue Test Utils. See [Testing Guide](./docs/testing.md) for setup details and patterns.

Run tests:

```bash
npm test          # Watch mode
npm run test:run  # Single run
```

## Prerequisites

Before you begin, ensure you have the following installed:

1. **[Node.js](https://nodejs.org/en/download)** - Version 20 or higher
2. **[npm](https://www.npmjs.com/)** - For managing frontend dependencies
3. **[Git](https://git-scm.com/downloads)** - For version control

For development, we also recommend:

- Visual Studio code
- A modern web browser (Chrome, Firefox, Edge)

## Getting started

### Restoring dependencies

Run `npm i` to restore dependencies.

### Development

Install all the dependencies by running `npm i`.
Start development by running `npm run dev`
