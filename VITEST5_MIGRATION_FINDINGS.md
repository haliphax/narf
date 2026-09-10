# Narf Vitest 5 Migration Investigation - Findings

## Branch

`dependabot/npm_and_yarn/multi-d440b5915d` (commit `b8a7128`)

## Change

`vitest` and `@vitest/coverage-v8` bumped from `^3.1.1` → `^5.0.0`

## Test Results

6 test files failing (17 tests), 21 passing (96 tests)

## Root Cause: vitest 5 Mock Scope Change

In vitest 5, `vi.mock()` no longer applies to **transitive imports** of packages that resolve to ESM bundler entries. This is a fundamental behavioral change from vitest 3.

### Evidence from Diagnostics

| Test                               | vi.mock target | Import pattern | Result |
| ---------------------------------- | -------------- | -------------- | ------ |
| Direct `await import("vue")`       | `vue`          | Direct         | Works  |
| Direct `await import("express")`   | `express`      | Direct         | Works  |
| Local ESM → Local ESM transitive   | `_target`      | `await import` | Works  |
| Local ESM → CJS transitive         | `express`      | `await import` | FAILS  |
| Local ESM → CJS transitive         | `express`      | Static import  | Works  |
| Local ESM → ESM-bundled transitive | `vue`          | Static import  | FAILS  |
| Local ESM → ESM-bundled transitive | `vue`          | `await import` | FAILS  |

### Key Pattern

- **Pure CJS packages** (express): Mock works transitively with static `import`, but NOT with `await import()`
- **ESM-bundled packages** (vue, vue-router, remult): Mock does NOT work transitively with either `await import()` or static `import`
- **Local ESM modules**: Mock works transitively with both import styles

### Why `service.test.ts` passes but `server.test.ts` fails

`service.test.ts` mocks express AND exercises the mock directly in the test body. It doesn't depend on the mocked express being applied transitively to `./service.ts` — the test creates its own `app` via `express()` (which returns the mock).

`server.test.ts` depends on `vi.mock("remult/remult-express", ...)` being applied when `./server.ts` is imported. Since `remult-express` is an ESM-bundled package, the mock isn't applied transitively.

## Config Approaches Tried (All Failed)

The following vitest config options were tested and did NOT resolve the mock propagation issue:

1. `server.deps.inline: [/^@?remult/]` — Still 9/9 failures on server.test.ts
2. `test.deps.optimizer.ssr.include: ["vue", "vue-router", "remult"]` — Still 9/9 failures on server.test.ts

## Failing Files

### 1. `src/client/app/index.test.ts` (3/3 fail)

- Mocks `vue` (ESM-bundled) → `./index` loads real vue
- `mockCreate`, `mockUse`, `mockMount` never called

### 2. `src/client/app/router.test.ts` (3/3 fail)

- Mocks `vue-router` (ESM-bundled) → `./router` loads real vue-router
- `mockCreateRouter`, `mockCreateHistory` never called

### 3. `src/client/app/remult.test.ts` (suite fail)

- Mocks `remult` (ESM-bundled) → `./remult` loads real remult
- `TypeError: () => rem is not a constructor` — the real `Remult` class fails

### 4. `src/server/server.test.ts` (9/9 fail)

- Mocks `remult/remult-express`, `remult/remult-knex` (ESM-bundled) → `./server` loads real versions
- All mock functions report 0 calls

### 5. `src/server/index.test.ts` (1/1 fail)

- Mocks `express` and `./service` → `./index` loads `./service` which imports express
- `mockService` never called

### 6. `src/models/story.test.ts` (1/11 fail)

- `mockEntity.mock.lastCall` is undefined — `@Entity` decorator mock never invoked
- Other tests pass (decoratorCalls map IS populated for `Fields` decorators)

## Remaining Fix Approaches

### 1. Rewrite each test to mock at the correct level

Instead of mocking dependencies, mock the exports of the module under test. This is the most reliable approach but requires significant rework of each failing test.

### 2. Use `vi.importActual` + manual wiring

For each test, import the actual module and manually inject mocked dependencies.

### 3. Further config investigation

There may be other vitest 5 config options (e.g., `deps.moduleDirectories`, custom Vite plugins) that could restore mock propagation. The vitest 5 migration guide should be consulted for the definitive list of mock-related config changes.

## Recommendation

Each failing test file needs individual attention to restructure the mocking strategy for vitest 5. The config-based approaches did not work.
