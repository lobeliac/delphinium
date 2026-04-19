/**
 * A simple but powerful Result type to make TypeScript Greater.
 */
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };
