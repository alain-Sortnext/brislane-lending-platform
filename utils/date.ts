/** Return the current UTC date in ISO-8601 YYYY-MM-DD form. */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Backward-compatible alias for the legacy dateHelper export. */
export const getToday = today;
