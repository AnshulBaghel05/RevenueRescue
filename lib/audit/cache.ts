import type { AuditResult } from './types';

// Simple in-memory cache for anonymous audit results
// Results expire after 1 hour
const auditCache = new Map<string, { result: AuditResult; expiresAt: number }>();

// Clean up expired audits every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of auditCache.entries()) {
    if (entry.expiresAt < now) {
      auditCache.delete(id);
    }
  }
}, 5 * 60 * 1000);

export function cacheAudit(result: AuditResult): void {
  const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour
  auditCache.set(result.id, { result, expiresAt });
}

export function getCachedAudit(id: string): AuditResult | null {
  const entry = auditCache.get(id);
  if (!entry) return null;

  if (entry.expiresAt < Date.now()) {
    auditCache.delete(id);
    return null;
  }

  return entry.result;
}

export function clearCache(): void {
  auditCache.clear();
}
