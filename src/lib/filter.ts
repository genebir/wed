import type { GalleryItem } from '../types'

/** 선택 없음 = 전체 통과, 선택 있음 = 하나라도 겹치면 통과 (무드 × 장소는 AND) */
export function filterGallery(
  items: GalleryItem[],
  moods: string[],
  locations: string[],
): GalleryItem[] {
  return items.filter((item) => {
    const moodOk = moods.length === 0 || item.moods.some((m) => moods.includes(m))
    const locationOk =
      locations.length === 0 || item.locations.some((l) => locations.includes(l))
    return moodOk && locationOk
  })
}

export function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}
