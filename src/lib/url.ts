const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path: string): string {
  if (!path.startsWith('/')) path = '/' + path;
  if (path === '/') return BASE === '' ? '/' : BASE;
  return BASE + path;
}
