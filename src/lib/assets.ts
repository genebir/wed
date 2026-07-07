/** '/gallery/x.webp' → GitHub Pages base(/wed/)를 붙인 실제 URL */
export function assetUrl(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
