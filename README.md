# narf! 🌎🐁

[![Test coverage](https://coveralls.io/repos/github/haliphax/narf/badge.svg?branch=main)](https://coveralls.io/github/haliphax/narf?branch=main)

Simple [story points][] estimation

- [Live web application][]
- [Test results][]
- [Test coverage][]

## Stack

### Server

- [Express][] - HTTP application server
- [SQLite][] - Database engine

### Client

- [Vite][] - Build system
- [Vue3][] - Application framework
- [Vuex][] - State management
- [Vue Router][] - Request routing
- [CSS Grid][] - Layout paradigm (with a sprinkle of flexbox)
- [Less][] - CSS preprocessor (for media queries as variables)

### Shared

- [Remult][] - Data access layer
- [Vitest][] - Unit/integration test framework
- [Cypress][] - End-to-end test framework

## Run locally

Install dependencies:

```bash
npm ci
```

Build the client web app:

```bash
npm run build
```

Start the app server:

```bash
npm start
```

## Development

Run unit tests:

```bash
npm test
```

Generate coverage reports:

```bash
npm run coverage
```

Run end-to-end tests:

```bash
npm run e2e
```

[css grid]: https://developer.mozilla.org/en-us/docs/web/css/css_grid_layout
[cypress]: https://cypress.io
[demonstration app]: https://sphenoid-secret-antimony.glitch.me
[express]: https://expressjs.com
[less]: https://lesscss.org
[live web application]: https://narf.poker
[remult]: https://remult.dev
[sqlite]: https://sqlite.org
[story points]: https://www.scrum.org/resources/blog/why-do-we-use-story-points-estimating
[test coverage]: https://coveralls.io/github/haliphax/narf?branch=main
[test results]: https://haliphax.testspace.com/spaces/295558
[vite]: https://vitejs.dev
[vitest]: https://vitest.dev
[vue router]: https://router.vuejs.org
[vue3]: https://vuejs.org
[vuex]: https://vuex.vuejs.org
