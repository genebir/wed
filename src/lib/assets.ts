/** '/gallery/x.webp' → GitHub Pages base(/wed/)를 붙인 실제 URL. 외부(CDN) URL은 그대로 통과 */
export function assetUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}

/** Unsplash CDN 이미지는 용도별 크기로 요청 (그리드 썸네일 vs 라이트박스 원본) */
export function galleryImageUrl(image: string, variant: 'thumb' | 'full'): string {
  if (image.startsWith('https://images.unsplash.com/')) {
    const url = new URL(image)
    url.searchParams.set('auto', 'format')
    url.searchParams.set('fit', 'max')
    url.searchParams.set('w', variant === 'thumb' ? '400' : '1200')
    url.searchParams.set('q', variant === 'thumb' ? '70' : '80')
    return url.toString()
  }
  return assetUrl(image)
}
