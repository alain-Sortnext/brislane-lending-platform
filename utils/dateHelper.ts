// DUPLICATE of utils/date.ts — one of these should go.
export function getToday(): string { return new Date().toISOString().split('T')[0]; }
