/** '/gallery/x.webp' → GitHub Pages base(/wed/)를 붙인 실제 URL. 외부(CDN) URL은 그대로 통과 */
export function assetUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
