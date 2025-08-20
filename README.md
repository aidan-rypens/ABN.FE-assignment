# Introduction

This project consists of a NuxtJS project that exposes API endpoints to serve as a server sided API for the frontend.

- [Introduction](#introduction)
  - [Architecture](#architecture)
    - [Framework \& SSR](#framework--ssr)
    - [Tech Stack](#tech-stack)
    - [API Architecture](#api-architecture)
      - [Browse Mode (Landing Page)](#browse-mode-landing-page)
      - [Search Mode](#search-mode)
      - [Infinite Scrolling Implementation](#infinite-scrolling-implementation)
    - [State Management](#state-management)
    - [Code Quality \& Linting](#code-quality--linting)
    - [File Structure](#file-structure)
  - [Design](#design)
  - [Testing](#testing)
  - [Lighthouse Scores](#lighthouse-scores)
  - [Prerequisites](#prerequisites)
  - [Getting started](#getting-started)
    - [Restoring dependencies](#restoring-dependencies)
    - [Development](#development)

## Architecture

### Framework & SSR

This project is built with **Nuxt 4** (Vue 3.5.18), leveraging its hybrid rendering capabilities:

- **SSR**: Pages are server-side rendered (SSR) by default for optimal initial page load
- **Client-side Hydration**: Client behavior
- **API Routes**: Built-in server endpoints using Nuxt's `server/api/` directory structure

Nuxt was chosen over a standard Vue SPA primarily because of its built-in support for Server-Side Rendering (SSR).

This allows API connections to be handled securely and efficiently on the server, rather than exposing them directly to the client. While the TV Maze API used in this project did not require secrets, the same approach ensures a scalable architecture.

Apart from that Nuxts SSR layer also provides performance and SEO advantages, making it a more future-proof choice for production-grade applications. But again, not relevant here (SEO).

### Tech Stack

**Frontend:**

- **Vue 3** - Composition API with `<script setup>` syntax
- **Nuxt 4** - Full-stack framework with SSR/SSG capabilities
- **TypeScript** - Type safety throughout the application
- **Tailwind CSS 4** - Utility-first CSS framework with JIT compilation

**Backend:**

- **Nuxt Server Engine** - Built-in API routes using h3 handlers
- **TV Maze API** - External data source for show information
- **In-memory Caching** - Request caching with TTL for performance

**Testing:**

- **Vitest 3** - Test runner
- **Vue Test Utils 2** - Test utils
- **Happy DOM** - Lightweight DOM environment for testing

**Build & Development:**

- **Vite** - Fast build tool and dev server
- **Auto-imports** - Automatic imports for Vue APIs and composables

### API Architecture

The application uses a dual-mode API strategy optimized for different use cases:

#### Browse Mode (Landing Page)

- **Separate API calls per genre**: Each carousel makes an independent request to `/api/shows?mode=browse&genre={genre}`
- **Cursor-based pagination**: Uses offset cursors for infinite scrolling within each genre
- **Individual caching**: Each genre's data is cached separately with 30-minute TTL
- **Optimized loading**: Genres load independently, allowing partial page functionality

```typescript
// Example: Action genre carousel
GET /api/shows?mode=browse&genre=Action&cursor=0&limit=20
// Returns: { items: Show[], nextCursor: "20", hasMore: true, totalCount: 150 }
```

#### Search Mode

- **Unified API call**: Single request combines all genres into buckets
- **Cross-genre search**: One call to `/api/shows?mode=search&q={query}` returns data organized by genre
- **Bucket response**: Results grouped by genre for consistent carousel display
- **No pagination**: Search results are limited per genre bucket

```typescript
// Example: Search for "Breaking"
GET /api/shows?mode=search&q=Breaking
// Returns: { buckets: { Drama: {...}, Crime: {...}, Thriller: {...} } }
```

#### Infinite Scrolling Implementation

- **Scroll detection**: Debounced scroll listener triggers at 75% container width
- **Automatic loading**: Both manual scrolling and carousel arrow clicks trigger data fetching
- **Loading states**: Visual feedback with skeleton loaders during data fetching
- **Error handling**: Error banner when there is a carousel not succeeding in its API call

### State Management

**Composables Pattern:**

- **useInfiniteCarousel**: Manages show data, loading states, and pagination per genre
- **useCarouselRegistry**: Global state for tracking all carousel states
- **Reactive State**: Vue 3 reactivity system for automatic UI updates
- **Local State**: Component-level state for UI interactions (modals, scroll positions)

### Code Quality & Linting

**Future Recommendations:**

- **Improve test coverage**: Only the most basic things have been tested. Not the most important functionality like for example the carousel.
- **ESLint + Vue Plugin + a11y**: Should be added for consistent code style and Vue-specific best practices & a11y

### File Structure

```
├── app/
│   ├── components/          # Reusable UI components
│   ├── composables/         # Vue composables for shared logic
│   ├── features/           # Feature-specific components
│   ├── pages/              # Nuxt pages (auto-routing)
│   └── assets/css/         # Global styles
├── server/
│   ├── api/                # API endpoints
│   ├── types/              # TypeScript definitions
│   └── utils/              # Server utilities
├── public/                 # Static assets
└── docs/                   # Documentation
```

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

## Lighthouse Scores

![Performance: 96%](https://img.shields.io/badge/Performance-98%25-success)
![Accessibility: 100%](https://img.shields.io/badge/Accessibility-100%25-success)
![Best Practices: 100%](https://img.shields.io/badge/Best_Practices-100%25-success)
![SEO: 100%](https://img.shields.io/badge/SEO-100%25-success)

- **Performance**: SSR, image optimization (vercel), efficient bundling
- **Accessibility**: ARIA labels, semantic HTML, proper color contrast
- **Best Practices**: Modern image formats
- **SEO**: Meta tags, semantic structure, responsive design

[View Latest Desktop Report](https://pagespeed.web.dev/analysis?url=https://abn-fe-assignment.vercel.app&form_factor=desktop)

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
