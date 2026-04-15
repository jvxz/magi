---
description: Project-wide context for Magi — a Matrix.org client app
alwaysApply: true
---

# Magi — AI Agent Context

Magi is a **Matrix.org client** built with Nuxt 4. Core priorities: **security, end-to-end encryption, performance, and UX**. Production targets modern serverless, edge, and Node.js environments.

---

## Commands

Use **pnpm** (package manager for this repo).

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Nuxt dev with PWA plugin enabled (`VITE_PLUGIN_PWA=true`) |
| `pnpm dev:no-pwa` | Nuxt dev without PWA |
| `pnpm build` | Production Nuxt build |
| `pnpm generate` | Static generation (`nuxt generate`) |
| `pnpm preview` | Build then serve preview locally |
| `pnpm deploy` | Build then deploy (customize as needed for your target) |
| `pnpm lint` | ESLint (`AGENTS.md` is ignored via `--ignore-pattern`) |
| `pnpm postinstall` | `nuxt prepare` |

There is **no** `test` script in `package.json` today.

**Do not** start the dev server (`pnpm dev`, etc.) unless the user explicitly asks — they often run it locally.

---

## Tech Stack

| Layer | Package / notes |
|-------|------------------|
| Framework | Nuxt `^4.4.x` |
| CSS | UnoCSS (`presetWind4`) — Tailwind v4-compatible utilities |
| UI primitives | `reka-ui` (Nuxt module `reka-ui/nuxt`) |
| Variant styling | `class-variance-authority` (CVA) |
| Class merging | `cn()` from `~/utils/cn.ts` → `clsx` + `tailwind-merge` |
| Matrix | `matrix-js-sdk` (client-side only); `@matrix-org/matrix-sdk-crypto-wasm` for crypto (E2EE path) |
| App state (Matrix client) | VueUse `createGlobalState` — `useMatrixClient()` (`shallowRef<MatrixClient>`) |
| Session persistence | `unstorage` (IndexedDB driver) — `idb` from `~/utils/idb.ts` |
| Vue utilities | `@vueuse/nuxt` (auto-imported) |
| Forms | `@regle/nuxt` (devDependency; Regle validation) |
| Schema validation | `zod` — client presets import `z.*`; server Nitro imports use `z` |
| Server API helpers | Nitro auto-imports `h3` helpers (e.g. `createError`, `readValidatedBody`) — see `server/utils/validate-body-zod.ts` |
| Data fetching (client) | `@peterbud/nuxt-query` (TanStack Query) — `useMutation`, `useQueryClient` auto-imported; `useQuery` wrapper in `~/composables/use-query.ts` |
| Images | `@nuxt/image`; app wrapper `~/components/img.vue` (lazy loading, placeholder styling) |
| Fonts | `@nuxt/fonts` |
| Icons | `@nuxt/icon` with `@iconify-json/tabler` (`icon.provider: 'server'`) |
| SEO | `@nuxtjs/seo` |
| PWA | `@vite-pwa/nuxt` — config `app/config/pwa.ts`, inject manifest `app/sw.ts`; dev PWA only when `VITE_PLUGIN_PWA=true` |
| Security | `nuxt-security` (CSP, rate limiting in prod) |
| DX | `@nuxt/hints`, `nitro-cloudflare-dev` |

---

## Project Structure

```
app/
  assets/css/globals.css    # Theme tokens (oklch), global styles
  components/
    form/                     # FormPrimitive, FormInput
    layout/app/               # Shell: aside, header, room list integration
    matrix/                   # Matrix-specific UI (e.g. avatar)
    page/                     # Page-scoped blocks (explore, me)
    settings/                 # Settings dialog
    u/                        # Design system (UButton, UDialog, …)
    user-card/
  composables/                # use-auth, use-matrix-client, use-query, use-public-rooms, …
  config/pwa.ts               # @vite-pwa/nuxt options
  constants/                  # App constants (e.g. SW messages)
  layouts/app.vue             # Main app layout (Reka SplitterGroup aside)
  middleware/
    auth.ts                   # /app/** and /login — logged-in vs login
    explore.ts                # Normalizes explore `baseUrl` param (used by explore page)
  pages/                      # File-based routes (`typedPages: true`)
  plugins/
    matrix.client.ts          # Hydrates `useMatrixClient()` from IDB via `useAuth().loginPersisted()`
    dev.client.ts             # Dev-only helpers (e.g. color-mode shortcut)
  sw.ts                       # Service worker (injectManifest)
  utils/
    idb.ts                    # unstorage IndexedDB for session payload
    cn.ts, styles.ts, variants.ts
    matrix/                   # validateHomeserver, resolveBaseUrl, mxcToHttps, parseMatrixError, …
    nuxt/, regle/, sw/
server/
  api/                        # Nitro routes
  utils/                      # validate-body-zod, validate-query-zod
shared/utils/                 # assert, constants (MATRIX_BASE_URL, appMeta), $error, …
uno.config.ts                 # UnoCSS (presetWind4, animations)
eslint.config.mjs
```

---

## Matrix SDK Rules

**Authenticated UI and data fetching** — use `useMatrixClient()`, not a new `createClient()`:

```ts
const { client } = useMatrixClient()
await client.value.someMethod()
```

`client` is a `shallowRef<MatrixClient>`. It is set in `useAuth().login()`, reset on logout, and hydrated from IndexedDB in `plugins/matrix.client.ts` via `loginPersisted()`.

**Anonymous / default homeserver** — `use-matrix-client.ts` seeds `client` with `createClient({ baseUrl: MATRIX_BASE_URL })` from `~/shared/utils/constants.ts`. After login, `client.value` is the authenticated client.

**Where `createClient()` is allowed** — `use-auth.ts` (temporary client for `loginRequest`, then authenticated client), `use-matrix-client.ts` (initial placeholder and `reset()`), and `~/utils/matrix/create-temp-client.ts` where explicitly intended. `plugins/matrix.client.ts` assigns the hydrated client from `loginPersisted()`; it does not construct ad hoc clients. Avoid `createClient()` in components or random composables.

**Client-side only** — matrix-js-sdk must never run on the server. Use `.client.ts` plugin naming and `server: false` in `useAsyncData`/`useFetch` for Matrix calls.

**Error handling** — always use `parseMatrixError()` from `~/utils/matrix/parse-matrix-error.ts` (it also unwraps `shared/utils/$error.ts` `$Error`):

```ts
import { MatrixError, TokenRefreshError } from 'matrix-js-sdk'

catch (error) {
  throw new Error(parseMatrixError(error, { fallbackMessage: 'Unexpected error' }))
}
```

**Media URLs** — convert `mxc://` with `mxcToHttps()` from `~/utils/matrix/mxc-to-https.ts`. Pass `baseUrl: client.getHomeserverUrl()` when the MXC is from the user’s homeserver. Never embed raw `mxc://` in templates. Authenticated media: `~/utils/matrix/fetch-authed.ts` / `client.http.authedRequest` + blob URL (or equivalent). For ordinary images, prefer `~/components/img.vue` or `@nuxt/image` with resolved HTTPS URLs.

**Homeserver validation** — use `validateHomeserver()` from `~/utils/matrix/validate-homeserver.ts` (AutoDiscovery-based) before trusting user-supplied homeserver input. Login resolves the final base URL with `resolveBaseUrl()` from `~/utils/matrix/resolve-base-url.ts`.

**Routing** — `routeRules` attach the `auth` middleware to `/app/**` and `/login` (client-side, `ssr: false`). Middleware checks `getUserId()` on `useMatrixClient().client.value`. `/playground` uses `appLayout: false`.

**E2EE** — when implementing encrypted room support, initialize crypto **before** calling `client.startClient()`. Never log or expose access tokens, device keys, or key backup secrets.

---

## Composable Patterns

Use `useMutation` (from `@peterbud/nuxt-query` / TanStack Query) for async operations that mutate state.

Use `useQuery` from `~/composables/use-query.ts` when you need TanStack `useQuery` with extra `watch` sources.

Use `useAsyncData` with `server: false` and `getCachedData` for client-side Matrix fetches (see `use-public-rooms.ts`).

---

## UI Component Patterns

Components in `app/components/u/` are the design system. Use them first before creating new primitives.

**Variants** live in `~/utils/variants.ts` using CVA. Shared tokens are in `~/utils/styles.ts` (`interactiveStyles`, `staticStyles`, `popoverStyles`).

```ts
import { cva } from 'class-variance-authority'
import { interactiveStyles } from '~/utils/styles'

const myVariants = cva(`${interactiveStyles.base} ...`, { variants: { ... } })
```

**Class merging** — always use `cn()` from `~/utils/cn`.

**`asChild`** — use Reka's `<Slot>` to delegate rendering when a component supports `asChild` (see `UButton`).

**Heavy UI** — prefer `Lazy*` component prefixes (e.g. `LazyUSpinner`) where appropriate to defer loading.

---

## UnoCSS Rules

- Use `presetWind4` utility classes (Tailwind v4 syntax)
- Prefer CSS variable-backed theme tokens: `bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-muted`, `bg-primary`, `text-primary-foreground`, etc.
- Colors are `oklch()`-based in `app/assets/css/globals.css`. Do not hardcode hex/rgb colors inline — use theme tokens.
- Use `transformerVariantGroup` for grouped variants: `hover:(bg-muted text-foreground)`
- Dark mode is class-based (`.dark {}`) via `@nuxtjs/color-mode` with cookie storage
- Add `// @unocss-include` at the top of non-Vue files that contain UnoCSS class strings

---

## TypeScript & Auto-Imports

- `typedPages: true` — use typed route names/params from `useRouter()` / `navigateTo()`
- Nuxt `imports.dirs`: `~/utils/**`, `~/config/**`, `~/composables/**`, `~/constants/**`, plus `./shared/**/*.ts`
- Import presets in `nuxt.config.ts`: `es-toolkit` (excluding `isEqual`), `ufo`, `zod` as `z.*`
- Prefer `MaybeRefOrGetter<T>` for props that accept both raw values and refs
- Export interfaces from `<script lang="ts">` in `.vue` files when types need to be shared

---

## Performance

- `nuxt-vitalizer` is active — avoid layout shifts (CLS) by sizing media elements explicitly
- Prefer `shallowRef` / `shallowReactive` for large Matrix data structures; the Matrix client in `useMatrixClient()` is already a `shallowRef`
- Use `createSharedComposable` for composables that should share state across the app (see `use-global-keys.ts`)
- Splitter panel state is persisted in cookies — avoid re-initializing layout on navigation
- Server-side icon rendering (`icon.provider: 'server'`) reduces icon flash on load
- Vite `optimizeDeps.exclude` includes heavy or prebundling-unfriendly deps (e.g. crypto WASM, Workbox, zod) — avoid fighting that list without reason

---

## Security

- CSP is configured via `nuxt-security` — do not widen `img-src` to `*` or allow unsafe inline scripts casually
- Rate limiting is enabled in production; disabled in dev
- Persisted session tokens live in **IndexedDB** via `idb` (`~/utils/idb.ts`) / unstorage — do not duplicate them in `localStorage`, query strings, or logs
- Always validate user-supplied homeserver URLs with `validateHomeserver()` (and resolve with `resolveBaseUrl()` for login) before use
- Sanitize any Matrix event content before rendering (XSS risk in `m.text` body, HTML format)
