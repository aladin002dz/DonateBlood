# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Donate Blood Platform — a Next.js 16 (App Router) app for donating blood and finding donors, with i18n (en/ar/fr), Better Auth authentication, and a Postgres (Neon) database via Drizzle ORM.

## Commands

Package manager is **pnpm** (pinned via `packageManager` in package.json — don't use npm/yarn to install).

```bash
pnpm dev                # start dev server (Turbopack)
pnpm build              # prebuild runs `eslint` + `tsc --noEmit`, then `next build --turbopack`
pnpm lint               # eslint

pnpm test               # run all vitest unit/integration tests once
pnpm test:watch         # vitest watch mode
pnpm test:ui            # vitest UI dashboard
pnpm test:coverage      # vitest with coverage report
npx vitest run path/to/file.test.ts        # run a single unit/integration test file
npx vitest run -t "test name"              # run tests matching a name

pnpm test:e2e           # playwright e2e tests (tests/e2e)
pnpm test:e2e:ui        # playwright UI mode
npx playwright test tests/e2e/search.spec.ts   # run a single e2e spec

npx drizzle-kit push    # push db/schema.ts changes to the database (DATABASE_URL env required)
npx drizzle-kit generate  # generate a new SQL migration into drizzle/
npx @better-auth/cli generate  # regenerate auth-related schema after changing lib/auth.ts config
```

`.husky/pre-push` runs `npm run test` then `npm run build` — pushing fails if either fails.

## Architecture

### Routing & i18n
- All user-facing routes live under `app/[locale]/...` (App Router), driven by `next-intl`. Locales are `en`, `ar`, `fr` (default `en`), configured in `i18n/routing.ts`.
- `proxy.ts` (Next.js 16's replacement for `middleware.ts`) wraps `next-intl`'s middleware and matches all paths except `api`, `trpc`, `_next`, `_vercel`, and files with extensions.
- Translation strings live in `i18n/dictionnaries/{en,ar,fr}.json`. Algeria's administrative divisions (wilaya → daira → commune) used for donor location fields/search live in `i18n/dictionnaries/wilayas-dairas-commune_{en,ar}.json`, keyed by wilaya `code` so entries line up by index across locales.
- Auth API routes are unlocalized: `app/api/[...all]/route.ts` delegates every method to Better Auth's Next.js handler.

### Data layer
- `db/schema.ts` is the single source of truth for the Postgres schema (Drizzle). Core tables: `user` (includes both Better Auth fields — role, ban state — and blood-donor profile fields: bloodGroup, wilaya/daira/commune, donationType, emergencyAvailable), `donor` (moderation status + reportCount per user), `report` (user-submitted reports against donors), plus Better Auth's `session`, `account`, `verification` tables.
- `db/db.ts` creates the Drizzle client over `@neondatabase/serverless` using `DATABASE_URL`.
- Migrations are generated into `drizzle/` via `drizzle-kit`; `drizzle.config.ts` points it at `db/schema.ts`.

### Auth
- `lib/auth.ts` configures Better Auth: Drizzle Postgres adapter, email/password auth, Google + GitHub OAuth, email verification and password-reset emails sent via Resend (`lib/resend-client.ts`, React Email templates in `lib/email/`), and the `admin` plugin with a custom role hierarchy (`admin`, `moderator` — list/get/ban users, list sessions — and `user`).
- `lib/auth-client.ts` is the React client (`authClient`, plus `signIn`/`signOut`/`signUp`/`useSession`/etc.) with the admin client plugin attached.
- Server actions that need the current user call `auth.api.getSession({ headers: await headers() })` (see `actions/moderation.ts`'s `getAuthenticatedSession` helper) and throw/return an error when unauthenticated.

### Server actions (`actions/`)
All mutations and non-trivial queries are `"use server"` functions, not API routes — `register.ts`, `signin.ts`, `profile.ts`, `password-reset.ts`, `email.ts`, `search.ts`, `moderation.ts`, `delete-account.ts`. Conventions to follow:
- Validate input with `zod` schemas inside the action.
- Wrap logic in try/catch and return `{ success: boolean, data?/error? }` rather than throwing to the caller.
- Import `db`/schema directly and build queries with `drizzle-orm` operators (`eq`, `and`, `or`, `ilike`, `isNotNull`, ...).
- `actions/search.ts` implements bilingual (en/ar) fuzzy location search: it cross-references the two wilaya/daira/commune dictionaries by `code`/index to expand a search term into all its translations before building `ilike` OR-conditions, and also parses free-text queries for blood-type tokens (e.g. `O+`) vs. location tokens.
- `actions/moderation.ts` implements donor reporting: 3 reports auto-hides a donor (`donor.status = 'hidden'`); admin/moderator-only actions call `revalidatePath` after mutating.

### UI
- shadcn/ui ("new-york" style) in `components/ui/`, configured via `components.json` (Tailwind v4, `@/*` path alias, no `tailwind.config` file — CSS-based config in `app/globals.css`).
- Shared, non-primitive components live directly in `components/` (e.g. `theme-provider`, `navigation`).

## Testing

- **Unit/integration**: Vitest + jsdom + React Testing Library. Config: `vitest.config.ts`.
  - Tests are co-located with source (`Component.test.tsx` next to `Component.tsx`, or in a sibling `__tests__/` folder for actions/lib).
  - `tests/setup.ts` auto-mocks `next/navigation`, `sonner`, `ResizeObserver`, `matchMedia` for every test.
  - Import `render`/`screen`/etc. from `@/tests/utils`, not `@testing-library/react` directly — it wraps components in the real `NextIntlClientProvider` (with a hand-maintained mock message catalog) and `ThemeProvider`.
  - `next-intl` and its `server`/`navigation`/`routing` submodules are aliased in `vitest.config.ts` to hand-written mocks under `tests/mocks/` — when a test needs new `next-intl` behavior, extend those mocks rather than fighting the real module in jsdom.
  - `tests/factories/` (faker-based) build fake `user`/`donor` records for tests; `tests/mocks/msw-handlers.ts` + `better-auth.mock.ts` mock external calls.
- **E2E**: Playwright, config `playwright.config.ts`, specs in `tests/e2e/*.spec.ts`. `tests/e2e/auth.setup.ts` is a setup project that authenticates once and saves storage state for other specs to reuse. Requires the app reachable at `PLAYWRIGHT_TEST_BASE_URL` (defaults to `http://localhost:3000`).

## Conventions (from `.agent/rules.md`)

- Commit messages follow **Gitmoji**: `<emoji> <type>: <subject>` (✨ feat, 🐛 fix, ♻️ refactor, 📝 docs, 🎨 style, ✅ test, 📦 build, 🔧 chore).
- No `console.log` left in finished code; no `any` in TypeScript — define proper types/interfaces.
- Components: `PascalCase`; functions/variables: `camelCase`; constants: `UPPER_SNAKE_CASE`.
- Tailwind utility classes over inline styles; design mobile-first, add `md:`/`lg:` for larger breakpoints.
