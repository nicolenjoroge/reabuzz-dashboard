// ---------------------------------------------------------------------------
// REA Dashboard — Shared utilities
// ---------------------------------------------------------------------------

/**
 * Format an ISO date string as "3 Jan 2026"
 */
export function reaFmtDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}


