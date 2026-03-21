---
description: Project-wide context for Decoy — a Matrix.org client app
alwaysApply: true
---

# Decoy — AI Agent Context

Decoy is a **Matrix.org client** built with Nuxt 4. Core priorities: **security, end-to-end encryption, performance, and UX**.

---

## Tech Stack

| Layer | Package |
|---|---|
| Framework | Nuxt 4 (`future.compatibilityVersion: 5`) |
| CSS | UnoCSS (`presetWind4`) — Tailwind v4-compatible |
| UI Primitives | `reka-ui` — headless, Radix-style |
| Variant Styling | `class-variance-authority` (CVA) |
| Class Merging | `cn()` from `~/utils/cn.ts` → `clsx` + `tailwind-merge` |
| Matrix Protocol | `matrix-js-sdk` (client-side only) |
| App state (Matrix client) | Pinia (`@pinia/nuxt`) — `useClientStore` |
| Session persistence | `unstorage` (IndexedDB driver) via `useIdb()` |
| Reactivity Utils | `@vueuse/nuxt` (auto-imported) |
| Form Validation | `@regle/nuxt` |
| Schema Validation | `zod` (server routes only) |
| i18n | `@nuxtjs/i18n` |
| Icons | `@nuxt/icon` with `@iconify-json/mingcute` |
| Logging | `evlog` |
| Security | `nuxt-security` (CSP, rate limiting) |
| DX | `@nuxt/hints` |

---

## Project Structure

```
app/
  components/u/          # Custom UI component library (UButton, UDialog, etc.)
  components/form/       # FormPrimitive, FormInput wrappers
  composables/           # use-auth.ts, use-client.ts (Pinia store), use-idb.ts, use-public-rooms.ts, etc.
  layouts/app.vue        # Main app shell (Reka SplitterGroup aside layout)
  pages/                 # File-based routing (typedPages: true)
  middleware/            # auth.ts — /app vs /login based on logged-in client
  plugins/
    matrix.client.ts     # Anonymous MatrixClient at MATRIX_BASE_URL → $matrix
    client.client.ts     # Restores session into useClientStore (loginPersisted + IDB)
  utils/
    cn.ts                # Class merging utility
    matrix/              # validateHomeserver, resolveBaseUrl, mxcToHttps, parseMatrixError, createDeviceId, getClientConfig
    styles.ts            # Shared CVA token objects (interactiveStyles, staticStyles, etc.)
    variants.ts          # CVA definitions for buttonVariants, badgeVariants, etc.
server/
  api/                   # Nitro API routes
  utils/                 # validate-body-zod, validate-query-zod
shared/utils/            # assert.ts, constants.ts (MATRIX_BASE_URL), object.ts, $error.ts ($Error class)
```

---

## Matrix SDK Rules

**Authenticated UI and data fetching** — use the Pinia client, not a new `createClient()`:

```ts
const clientStore = useClientStore()
await clientStore.client.someMethod()
```

The store holds a `shallowRef<MatrixClient>`. It is set in `useAuth().login()`, reset on logout, and hydrated from IndexedDB in `client.client.ts` via `loginPersisted()`.

**Anonymous / default homeserver** — `matrix.client.ts` still provides `$matrix` (`useNuxtApp().$matrix`): a client pinned to `MATRIX_BASE_URL` from `~/shared/utils/constants.ts`. Prefer `useClientStore().client` whenever the user is logged in.

**Where `createClient()` is allowed** — `use-auth.ts` (temporary client for `loginRequest`, then authenticated client), `use-client.ts` (initial placeholder and `$reset`), and `plugins/matrix.client.ts`. Avoid ad hoc `createClient()` in components or random composables.

**Client-side only** — matrix-js-sdk must never run on the server. Use `.client.ts` plugin naming and `server: false` in `useAsyncData`/`useFetch` for Matrix calls.

**Error handling** — always use `parseMatrixError()` from `~/utils/matrix/parse-matrix-error.ts` (it also unwraps `shared/utils/$error.ts` `$Error`):

```ts
import { MatrixError, TokenRefreshError } from 'matrix-js-sdk'

catch (error) {
  throw new Error(parseMatrixError(error, { fallbackMessage: 'Unexpected error' }))
}
```

**Media URLs** — convert `mxc://` with `mxcToHttps()` from `~/utils/matrix/mxc-to-https.ts`. Pass `baseUrl: client.getHomeserverUrl()` when the MXC is from the user’s homeserver. Never embed raw `mxc://` in templates. Authenticated media (e.g. thumbnails) may need an authed fetch (e.g. `client.http.authedRequest` + blob URL) instead of a plain `<img>` URL.

**Homeserver validation** — use `validateHomeserver()` from `~/utils/matrix/validate-homeserver.ts` (AutoDiscovery-based) before trusting user-supplied homeserver input. Login resolves the final base URL with `resolveBaseUrl()` from `~/utils/matrix/resolve-base-url.ts`.

**Routing** — `routeRules` attach the `auth` middleware to `/app/**` and `/login` (client-side). Middleware checks `useClientStore().client.getUserId()`.

**E2EE** — when implementing encrypted room support, initialize crypto **before** calling `client.startClient()`. Never log or expose access tokens, device keys, or key backup secrets.

---

## Composable Patterns

Use `useMutation` (wraps VueUse `useAsyncState`) for async operations that mutate state:

```ts
const clientStore = useClientStore()
const { state, isLoading, error, execute } = useMutation(async () => {
  return await clientStore.client.someOperation()
}, { onMutate: (prev) => { /* optimistic update */ } })
```

Use `useAsyncData` with `server: false` and `getCachedData` for client-side Matrix fetches (see `use-public-rooms.ts`).

---

## UI Component Patterns

Components in `app/components/u/` are the design system. Use them first before creating new primitives.

**Variants** live in `~/utils/variants.ts` using CVA. Shared tokens are in `~/utils/styles.ts` (`interactiveStyles`, `staticStyles`, `popoverStyles`).

```ts
// ✅ Extend existing variant tokens
import { cva } from 'class-variance-authority'
import { interactiveStyles } from '~/utils/styles'

const myVariants = cva(`${interactiveStyles.base} ...`, { variants: { ... } })
```

**Class merging** — always use `cn()`:

```ts
import { cn } from '~/utils/cn'
// <div :class="cn('base-class', props.class, conditionalClass && 'extra')" />
```

**`asChild`** — use Reka's `<Slot>` to delegate rendering when a component supports `asChild` (see `UButton`).

**Heavy UI** — prefer `Lazy*` component prefixes (e.g. `LazyUSpinner`, `LazyNuxtImg`) where appropriate to defer loading.

---

## UnoCSS Rules

- Use `presetWind4` utility classes (Tailwind v4 syntax)
- Prefer CSS variable-backed theme tokens: `bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-muted`, `bg-primary`, `text-primary-foreground`, etc.
- Colors are `oklch()`-based in `app/assets/css/globals.css`. Never hardcode hex/rgb colors inline — reference theme tokens.
- Use `transformerVariantGroup` for grouped variants: `hover:(bg-muted text-foreground)`
- Dark mode is class-based (`.dark {}`) via `@nuxtjs/color-mode` with cookie storage
- Add `// @unocss-include` at the top of non-Vue files that contain UnoCSS class strings

---

## TypeScript Conventions

- `typedPages: true` is enabled — use typed route names/params from `useRouter()`/`navigateTo()`
- Auto-imports are active for: `~/composables/**`, `~/utils/**`, `~/shared/**`, VueUse, `ufo`, `scule`, `evlog.createError`
- Prefer `MaybeRefOrGetter<T>` for props that accept both raw values and refs
- Export interfaces from `<script lang="ts">` blocks in `.vue` files when types need to be shared

---

## Performance

- `nuxt-vitalizer` is active — avoid layout shifts (CLS) by sizing media elements explicitly
- Prefer `shallowRef` / `shallowReactive` for large Matrix data structures (room lists, event timelines); the Matrix client in Pinia is already a `shallowRef`
- Use `createSharedComposable` for composables that should share state across the app (see `use-global-keys.ts`)
- Splitter panel state is persisted in cookies — avoid re-initializing layout on navigation
- Server-side icon rendering is enabled (`icon.provider: 'server'`) — no icon flash on load

---

## Security

- CSP is configured via `nuxt-security` — do not add `img-src: *` or inline scripts
- Rate limiting is enabled in production; disabled in dev
- Persisted session tokens live in **IndexedDB** via `useIdb()` / unstorage — do not duplicate them in `localStorage`, query strings, or logs
- Always validate user-supplied homeserver URLs with `validateHomeserver()` (and resolve with `resolveBaseUrl()` for login) before use
- Sanitize any Matrix event content before rendering (XSS risk in `m.text` body, HTML format)
