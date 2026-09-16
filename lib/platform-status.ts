/**
 * Single kill switch for the temporary pause described in CLAUDE.md / the
 * data-protection migration: set PLATFORM_ON_HOLD=true on the host to block
 * new registrations (email/password + OAuth) and donor search server-side,
 * and to surface the pause banner/pages. Set back to false to reopen.
 *
 * Server-only: process.env.PLATFORM_ON_HOLD is not exposed to client
 * bundles, so only call this from server components, server actions, or
 * route handlers, and pass the result down as a prop where a client
 * component needs it.
 */
export function isPlatformOnHold(): boolean {
    return process.env.PLATFORM_ON_HOLD === "true";
}
