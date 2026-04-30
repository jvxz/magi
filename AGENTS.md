---
description: Project-wide context for Magi — a Matrix.org client app
alwaysApply: true
---

# Magi — AI agent context

Magi is a **Matrix.org client** built with **Nuxt 4**. Priorities: **security, E2EE, performance, and UX**.

---

## Commands

Use **pnpm** (see [`package.json`](package.json)).

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Nuxt dev with PWA plugin enabled (`VITE_PLUGIN_PWA=true`) |
| `pnpm dev:no-pwa` | Nuxt dev without PWA |
| `pnpm build` | Production Nuxt build |
| `pnpm build:test` | Build with `NITRO_PRESET=node-server` and `NODE_ENV=test` (used before e2e) |
| `pnpm generate` | Static generation (`nuxt generate`) |
| `pnpm preview` | `pnpm build` then `nuxt preview` |
| `pnpm lint` | ESLint (`AGENTS.md` ignored via `--ignore-pattern`) |
| `pnpm postinstall` | `nuxt prepare` |
| `pnpm tokens:export` | [`design-tokens/w3c/tokens.json`](design-tokens/w3c/tokens.json) (dual theme), [`light.json`](design-tokens/w3c/light.json) / [`dark.json`](design-tokens/w3c/dark.json) — Playwright + [`culori`](https://culorijs.org); `pnpm exec playwright install chromium` if needed |
| `pnpm test` | Vitest (all projects in [`vitest.config.ts`](vitest.config.ts)) |
| `pnpm test:unit` | Vitest — `unit` project (`test/unit/*.{test,spec}.ts`) |
| `pnpm test:nuxt` | Vitest — `nuxt` project (`test/nuxt/**/*.{test,spec}.ts`) |
| `pnpm test:watch` | Vitest watch mode |
| `pnpm test:coverage` | Vitest with coverage |
| `pnpm test:typecheck` | `vue-tsc -b --noEmit` |
| `pnpm test:e2e` | `pnpm build:test` then Playwright (`test/e2e`) |
| `pnpm test:e2e:ui` | Same as e2e with Playwright UI |
| `pnpm test:e2e:prebuilt` | Playwright only (expects app already built for test) |
| `pnpm test:e2e:webserver` | `NODE_ENV=test` Nuxt preview on port **5678** (used by Playwright `webServer` in [`playwright.config.ts`](playwright.config.ts)) |

**Do not** start the dev server (`pnpm dev`, etc.) unless the user explicitly asks.

CI (`.github/workflows/ci.yml`) runs: `pnpm nuxt prepare`, `pnpm test:typecheck`, `pnpm lint`, `pnpm test`, then Playwright install + `pnpm test:e2e` (Node 25, ubicloud-standard-4).

---

## Tech stack (high level)

| Layer | Notes |
|-------|-------|
| Framework | Nuxt `^4.4.x` ([`package.json`](package.json)) |
| CSS | UnoCSS — `presetWind4`, `unocss-preset-animations`, custom anchor-positioning preset ([`uno.config.ts`](uno.config.ts)) |
| UI | `reka-ui` via `reka-ui/nuxt` |
| Variants / classes | `class-variance-authority`; `cn()` in [`app/utils/cn.ts`](app/utils/cn.ts) (`clsx` + `tailwind-merge`) |
| Matrix | `matrix-js-sdk` (client-side only); `@matrix-org/matrix-sdk-crypto-wasm` for E2EE |
| Client state | `useMatrixClient()` — `createGlobalState` + `shallowRef<MatrixClient>` ([`app/composables/use-matrix-client.ts`](app/composables/use-matrix-client.ts)) |
| Session | `unstorage` + IndexedDB via [`app/utils/idb.ts`](app/utils/idb.ts) (`idb-keyval`) |
| Vue utilities | `@vueuse/nuxt` (auto-imported) |
| Forms | `@regle/nuxt` |
| Validation | `zod` — app import preset `z.*` in [`nuxt.config.ts`](nuxt.config.ts); Nitro imports `z` from `zod` |
| Server / Nitro | `h3` helpers auto-imported; Zod helpers in `server/utils/` (e.g. [`server/utils/validate-body-zod.ts`](server/utils/validate-body-zod.ts), [`server/utils/validate-query-zod.ts`](server/utils/validate-query-zod.ts)) |
| Data (client) | `@peterbud/nuxt-query` — auto-imports `useMutation`, `useQueryClient`; TanStack-style queries; `useQuery` wrapper with extra `watch` sources in [`app/composables/use-query.ts`](app/composables/use-query.ts); default `staleTime: 1h`, `refetchOnWindowFocus: true` |
| Images / fonts / icons | `@nuxt/image` + [`app/components/img.vue`](app/components/img.vue); `@nuxt/fonts` (local **Miranda Sans** → [`public/font/Miranda-Sans.woff2`](public/font/Miranda-Sans.woff2)); `@nuxt/icon` + `@iconify-json/tabler` (`icon.provider: 'server'`) |
| SEO / PWA | `@nuxtjs/seo`, `@vite-pwa/nuxt` ([`app/config/pwa.ts`](app/config/pwa.ts), [`app/sw.ts`](app/sw.ts)); PWA in dev only when `VITE_PLUGIN_PWA=true` |
| Security | `nuxt-security` — CSP headers (prod `script-src` set in config); `rateLimiter` and `sri` are **off** in current [`nuxt.config.ts`](nuxt.config.ts) |
| Misc | `@nuxt/hints`, `quick-lru` for small LRU caches |

---

## Directory structure

```
app/
  app.vue                 # Root shell: PWA manifest, tooltip provider, layouts/pages
  sw.ts                   # Service worker (injectManifest)
  assets/css/globals.css  # Theme tokens (oklch), global styles
  components/
    u/                    # Design system (Reka-based primitives)
    layout/app/           # Shell: header, aside, user card, slots
    page/                 # Page blocks (explore, me, room, …)
    settings/             # Settings dialog + sidebar
    form/                 # Form primitives / inputs
    user-card/            # User card UI
    matrix/, debug/       # Matrix-specific / dev-only UI
  composables/            # use-auth, use-matrix-client, use-query, room/space hooks, …
  config/pwa.ts           # @vite-pwa/nuxt options
  constants/
    index.ts              # APP_LAYOUT_SLOT_NAMES
    settings.ts           # Zod settings schemas + SETTINGS_CATEGORIES
    sw-messages.ts        # SW message constants
  layouts/app.vue         # Main app layout (splitter, settings dialog)
  middleware/
    auth.ts               # Client-only: authed ↔ /app vs /login
    explore.ts            # Normalizes explore `baseUrl` param
  pages/                  # File routes (experimental `typedPages: true`)
  plugins/
    matrix.client.ts      # Hydrates session from IDB, sync status
    dev.client.ts         # Dev-only helpers
  utils/
    cn.ts, styles.ts, variants.ts
    dom.ts, download-file.ts, on-paste.ts, toggle-color-mode.ts, types.ts
    matrix/               # client.ts, mxc-to-https.ts, parse-matrix-error.ts,
                          # resolve-base-url.ts, validate-homeserver.ts, room.ts, …
    idb.ts, sw/, regle/, nuxt/, test/
server/
  api/                    # Nitro routes (e.g. server/api/number.get.ts)
  utils/                  # validate-body-zod.ts, validate-query-zod.ts, event-handler.example.ts
shared/utils/
  $error.ts, constants.ts (MATRIX_BASE_URL, appMeta, IMG_PLACEHOLDER_URL)
  kebab-to-sentence.ts, object.ts
public/                   # Static assets (`_robots.txt`, `font/`, …)
test/
  unit/                   # Vitest node env
  nuxt/                   # Vitest + Nuxt test utils (happy-dom, mocked IndexedDB)
  e2e/                    # Playwright
```

Nuxt `imports.dirs` (from [`nuxt.config.ts`](nuxt.config.ts)): `~/utils/**/*.ts`, `~/config/**/*.ts`, `~/composables/**/*.ts`, `~/constants/**/*.ts`, `./shared/**/*.ts`. Nitro auto-import dirs: `./server/schema/*`, `./server/utils/*` (no `server/schema` tree in repo yet — add when needed).

---

## Code reuse — deduping is critical

Before writing any new helper, **search the codebase first**. Duplicate utilities are a recurring source of drift and bugs; keep the surface small and shared.

- `~/utils/**`, `~/composables/**`, `~/constants/**`, `./shared/**` are all auto-imported — there is no reason to re-declare a helper locally.
- If you find a similar util, **extend/rename it** rather than adding a parallel one. Leave the call sites updated in the same change.
- If a util is only used in one place, keep it colocated; the moment a second call site appears, lift it to the matching `utils/` / `composables/` dir.
- Matrix-specific helpers live under [`app/utils/matrix/`](app/utils/matrix/) (`client.ts`, `mxc-to-https.ts`, `parse-matrix-error.ts`, `resolve-base-url.ts`, `validate-homeserver.ts`, `room.ts`, …). Always check there before adding new Matrix glue.
- Shared client+server helpers go in [`shared/utils/`](shared/utils/).

---

## es-toolkit first

**Prefer [`es-toolkit`](https://es-toolkit.dev) over rolling custom utilities.** It is tree-shakeable, faster, and better-tested than ad hoc implementations, and is already a direct dependency + auto-import preset (minus `isEqual`, see [`nuxt.config.ts`](nuxt.config.ts)).

- Reach for `es-toolkit` (`groupBy`, `uniqBy`, `chunk`, `debounce`, `throttle`, `memoize`, `pick`, `omit`, `mapValues`, `sortBy`, `partition`, `difference`, `cloneDeep`, …) before writing a hand-rolled loop or reducer.
- It is **not** a goal to prefer native methods over `es-toolkit`. If a native approach needs extra wrapping, edge-case handling, or perf tuning to match a `es-toolkit` function, just use the library — fewer bespoke utilities means fewer bugs.
- Do **not** import the `isEqual` auto-import (explicitly ignored); if structural equality is actually needed, import it explicitly from `es-toolkit` at the call site and justify the cost.
- When a util doesn't exist in `es-toolkit`, put it in the appropriate `utils/` dir with a tight, typed signature — don't inline it multiple places.

Example:

```ts
import { groupBy, uniqBy } from 'es-toolkit'

const byRoom = groupBy(events, e => e.getRoomId()!)
const uniqueMembers = uniqBy(members, m => m.userId)
```

---

## Matrix SDK rules

**Use `useMatrixClient()` for the live client** — `client` is a `shallowRef<MatrixClient>`:

```ts
const { client } = useMatrixClient()
await client.value.someMethod()
```

**Default / anonymous homeserver** — initial client uses `createClient({ baseUrl: MATRIX_BASE_URL })` with `MATRIX_BASE_URL` from [`shared/utils/constants.ts`](shared/utils/constants.ts).

**Where `createClient()` is appropriate** — [`app/composables/use-auth.ts`](app/composables/use-auth.ts) (temporary client for `loginRequest`), [`app/composables/use-matrix-client.ts`](app/composables/use-matrix-client.ts) (initial placeholder / authed swap), and [`app/utils/matrix/create-temp-client.ts`](app/utils/matrix/create-temp-client.ts) when explicitly intended. Avoid ad hoc `createClient()` in random components.

**Client-only** — matrix-js-sdk must not run on the server. Use `.client.ts` plugins; for data APIs use `server: false` on `useAsyncData` / `useFetch` when calling Matrix from the client.

**Errors** — use `parseMatrixError()` from [`app/utils/matrix/parse-matrix-error.ts`](app/utils/matrix/parse-matrix-error.ts).

**Media** — `mxc://` → `mxcToHttps()` from [`app/utils/matrix/mxc-to-https.ts`](app/utils/matrix/mxc-to-https.ts) with `baseUrl: client.getHomeserverUrl()` when relevant. Prefer [`app/components/img.vue`](app/components/img.vue) / `@nuxt/image` with resolved HTTPS URLs.

**Homeserver input** — validate with `validateHomeserver()` ([`app/utils/matrix/validate-homeserver.ts`](app/utils/matrix/validate-homeserver.ts)); login flow resolves URL via `resolveBaseUrl()` ([`app/utils/matrix/resolve-base-url.ts`](app/utils/matrix/resolve-base-url.ts)).

**Routing** — [`nuxt.config.ts`](nuxt.config.ts) `routeRules`: `/app/**` and `/login` use `appMiddleware: 'auth'`, `ssr: false`; `/playground` uses `appLayout: false`. [`app/middleware/auth.ts`](app/middleware/auth.ts) is **client-only** and uses `useMatrixStatus().isAuthed` (not server-side session).

**E2EE** — initialize crypto before `startClient()` when adding encrypted-room flows. Never log or expose tokens, device keys, or key backup material.

---

## Composable / data patterns

- Prefer **`useMutation`** / **`useQueryClient`** from Nuxt Query (auto-imported per [`nuxt.config.ts`](nuxt.config.ts)).
- Use **`useQuery` from [`app/composables/use-query.ts`](app/composables/use-query.ts)** when you need TanStack `useQuery` plus extra **`watch`** sources.
- For large Matrix-shaped data, prefer **`shallowRef` / `shallowReactive`**; the Matrix client ref is already shallow.
- Singleton-style composables: wrap with **`createSharedComposable`** (see [`app/composables/use-global-keys.ts`](app/composables/use-global-keys.ts)).

---

## UI conventions

- Prefer primitives under **`app/components/u/`** before inventing new ones.
- Variants: [`app/utils/variants.ts`](app/utils/variants.ts) (CVA); shared tokens: [`app/utils/styles.ts`](app/utils/styles.ts).
- Merge classes with **`cn()`** from [`app/utils/cn.ts`](app/utils/cn.ts).
- Reka **`asChild`**: delegate with `<Slot>` where the component supports it (e.g. `UButton`).
- Heavy UI: consider **`Lazy*`** component names to defer loading.

Main layout slot teleports / names: see [`app/constants/index.ts`](app/constants/index.ts) (`APP_LAYOUT_SLOT_NAMES`).

---

## UnoCSS

- Wind4-style utilities via `presetWind4` ([`uno.config.ts`](uno.config.ts)).
- Prefer **CSS variable / theme tokens** from [`app/assets/css/globals.css`](app/assets/css/globals.css) (e.g. `bg-background`, `text-foreground`) — avoid hardcoded hex/rgb in components unless necessary.
- **`transformerVariantGroup`**: e.g. `hover:(bg-muted text-foreground)`.
- **`transformerDirectives`**: `@apply` / `@screen` where used (`throwOnMissing: false`).
- Dark mode: **`@nuxtjs/color-mode`** with **`storage: 'cookie'`** ([`nuxt.config.ts`](nuxt.config.ts)).
- Non-Vue files with class strings: `// @unocss-include` at top so UnoCSS can see them.

---

## TypeScript and auto-imports

- **`experimental.typedPages: true`** and **`typescriptPlugin: true`** — typed routes / names where generated types apply.
- Import presets in [`nuxt.config.ts`](nuxt.config.ts): `es-toolkit` (ignores `isEqual`), `ufo`, `zod` as `z.*`.
- Prefer **`MaybeRefOrGetter<T>`** for props that accept raw values or getters/refs.
- Settings are schema-driven: keep [`app/constants/settings.ts`](app/constants/settings.ts) as the single source of truth (`SettingsSchema`, `SETTINGS_CATEGORIES`).

---

## Performance

- **`nuxt-vitalizer`** is enabled — avoid CLS; size media and skeletons intentionally.
- **`createSharedComposable`** for singleton-style composables.
- Splitter layout sizes persist via **`useCookie`** in [`app/layouts/app.vue`](app/layouts/app.vue) — avoid resetting layout state unnecessarily.
- **`icon.provider: 'server'`** reduces icon flash.
- **`vite.optimizeDeps.exclude`** lists heavy deps (matrix crypto wasm, workbox, zod, devtools, `es-toolkit`) — avoid removing entries without a good reason ([`nuxt.config.ts`](nuxt.config.ts)).
- Prefer `shallowRef` / `shallowReactive` / `markRaw` for large Matrix objects; prefer `computed` + cheap selectors over deep reactivity.

---

## Security

- **CSP** is configured in [`nuxt.config.ts`](nuxt.config.ts) under `security.headers.contentSecurityPolicy` — do not widen casually (e.g. `img-src`, `script-src`).
- **Rate limiting** is not enabled in the current checked-in `nuxt-security` block (`rateLimiter: false`).
- Session payload lives in **IndexedDB** via the idb helpers — do not duplicate secrets in `localStorage`, query strings, or logs.
- **Homeserver URLs**: always validate / resolve before use (see Matrix section).
- **Event bodies**: treat Matrix HTML / text as untrusted; sanitize before rendering to mitigate XSS.

---

## Agent guardrails

- **Do not start dev servers** unless the user asks.
- **Do not add extra markdown docs** (READMEs, summaries, guides) unless the user explicitly wants them.
- **Dedupe first, write second** — search `utils/`, `composables/`, `shared/`, and `app/utils/matrix/` before creating a helper.
- **Reach for `es-toolkit`** before writing a custom util or verbose native equivalent.
- Prefer **small, focused changes**; match existing naming (`kebab-case` files, composables `use-*.ts`).
- After substantive edits, run **`pnpm lint`** and **`pnpm test:typecheck`** (and tests if touching behavior).
