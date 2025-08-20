# Testing Architecture

## Stack

- **Vitest** - Test runner built on Vite
- **Vue Test Utils** - Official Vue testing utilities
- **Happy DOM** - Lightweight DOM environment
- **unplugin-auto-import** - Auto-imports Vue/Nuxt APIs in tests

## File Structure

Tests live in `__tests__` folders next to components:

```
app/
├── components/__tests__/
├── features/__tests__/
├── composables/__tests__/
└── pages/__tests__/
```

## Configuration

### vitest.config.ts

- Auto-imports Vue composition API (`ref`, `watch`, etc.)
- Auto-imports Vue Router (`useRoute`, `useRouter`)
- Aliases (`~` → `app/`, `~~` → root)

### Key Dependencies

```json
{
  "@vue/test-utils": "Component mounting/testing",
  "vitest": "Test runner",
  "happy-dom": "DOM environment",
  "unplugin-auto-import": "Auto-import Vue APIs"
}
```

## Common Patterns

### Mocking Composables

```ts
// Stable mock object approach
const mockRegistry = { hasErrors: ref(false) };
vi.mock("~/composables/useCarouselRegistry", () => ({
  useCarouselRegistry: () => mockRegistry,
}));

// Toggle state per test
mockRegistry.hasErrors.value = true;
```

### Mocking Vue Router

```ts
const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRoute: () => ({ query: {} }),
  useRouter: () => ({ push: mockPush }),
}));
```

### Debounced Functions

```ts
it("handles debounced input", async () => {
  vi.useFakeTimers();

  await input.setValue("search term");
  vi.advanceTimersByTime(300); // Match debounce delay

  expect(mockPush).toHaveBeenCalled();
});
```

## Test Selectors

### data-testid Strategy

This project uses `data-testid` attributes for test selectors instead of CSS classes or element types.

```ts
// Preferred
const input = wrapper.find('[data-testid="search-input"]');

// Avoid
const input = wrapper.find('input[type="text"]');
const input = wrapper.find(".search-input");
```

### Why data-testid?

**Stability** - CSS classes change for styling reasons. `data-testid` attributes are test-only and won't be modified by designers or during refactoring.

**Clarity** - `data-testid="user-profile-button"` is more descriptive than `.btn-primary` or `button:nth-child(2)`.

**Separation of Concerns** - Tests don't break when CSS classes are renamed, components are restructured, or styling frameworks change.

**Team Consistency** - QA and automation teams prefer explicit test hooks over selectors that break during UI updates.

**Refactor-Safe** - Component internals can change without breaking tests. Only behavior changes should break tests.

### Naming Convention

```html
<!-- Component role + specific identifier -->
<input data-testid="search-input" />
<button data-testid="clear-search-button" />
<div data-testid="api-error-banner" />
<div data-testid="carousel-item" />
```

Some additional documentation:

- [Making your UI tests resilient to change](https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change)

## FAQ

### Fake Timers

Search input uses `lodash.debounce(fn, 300)` to avoid excessive URL updates. Tests need `vi.useFakeTimers()` to control the 300ms delay.

### Stable Mock Objects

Vue's `<script setup>` calls composables during import. Creating a stable mock object (vs recreating mocks) lets tests toggle reactive state without re-importing components.

### Auto-Import Plugin

Nuxt auto-imports Vue APIs globally. Tests need the same imports available or components fail to compile.

## Running Tests

```bash
npm test          # Watch mode
npm run test:run  # Single run
```

Test files: `*.test.ts` or `__tests__/*.ts`

```

```
