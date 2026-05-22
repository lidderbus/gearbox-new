// HEAD-probe helper for static assets that may 404.
// Caches results in-memory so we don't re-probe each click.

const cache = new Map();

export async function assetExists(url) {
  if (!url) return false;
  if (cache.has(url)) return cache.get(url);
  try {
    const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    const ok = res.ok;
    cache.set(url, ok);
    return ok;
  } catch {
    cache.set(url, false);
    return false;
  }
}

export function clearAssetCache(url) {
  if (url) cache.delete(url); else cache.clear();
}
