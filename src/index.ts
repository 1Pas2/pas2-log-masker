export function maskSecrets(
  value: unknown,
  keys: readonly string[] = [
    "password",
    "token",
    "secret",
    "authorization",
    "cookie",
  ],
  replacement = "[REDACTED]",
): unknown {
  const sensitive = new Set(keys.map((k) => k.toLowerCase()));
  const active = new WeakSet<object>();
  function visit(item: unknown): unknown {
    if (item === null || typeof item !== "object") return item;
    if (active.has(item)) return "[Circular]";
    active.add(item);
    try {
      if (Array.isArray(item)) return item.map(visit);
      const out: Record<string, unknown> = Object.create(null) as Record<
        string,
        unknown
      >;
      for (const [key, val] of Object.entries(item))
        out[key] = sensitive.has(key.toLowerCase()) ? replacement : visit(val);
      return out;
    } finally {
      active.delete(item);
    }
  }
  return visit(value);
}
