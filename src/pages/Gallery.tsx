import { useMemo, useState } from 'react'
import { gallery } from '../data'
import { filterGallery, toggleValue } from '../lib/filter'
import { Chip } from '../components/Chip'
import { GalleryImage } from '../components/GalleryImage'
import { Lightbox } from '../components/Lightbox'
import { FadeUp } from '../components/FadeUp'
import type { GalleryItem } from '../types'

const MOOD_PRESETS = ['따뜻한', '청량한', '필름감성', '시네마틱', '미니멀', '러블리']
const LOCATION_PRESETS = ['한강', '공원·수목원', '카페', '바다', '골목·도심', '스튜디오·실내']

// 프리셋에 없는 값이 데이터에 있으면 필터에 함께 노출
const MOODS = [...new Set([...MOOD_PRESETS, ...gallery.flatMap((g) => g.moods)])]
const LOCATIONS = [...new Set([...LOCATION_PRESETS, ...gallery.flatMap((g) => g.locations)])]

export function Gallery() {
  const [moods, setMoods] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [selected, setSelected] = useState<GalleryItem | null>(null)

  const items = useMemo(() => filterGallery(gallery, moods, locations), [moods, locations])

  return (
    <div className="py-20">
      <FadeUp>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">스냅 레퍼런스</h1>
        <p className="mt-3 text-muted">이런 느낌으로 찍자 — 모아둔 레퍼런스 갤러리.</p>
      </FadeUp>

      {/* 필터 */}
      <FadeUp delay={80}>
        <div className="mt-10 space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold text-muted">무드</p>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <Chip
                  key={m}
                  label={m}
                  selected={moods.includes(m)}
                  onClick={() => setMoods((prev) => toggleValue(prev, m))}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-muted">장소</p>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((l) => (
                <Chip
                  key={l}
                  label={l}
                  selected={locations.includes(l)}
                  onClick={() => setLocations((prev) => toggleValue(prev, l))}
                />
              ))}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Masonry 그리드 */}
      <FadeUp delay={140}>
        {items.length === 0 ? (
          <p className="py-24 text-center text-muted">
            조건에 맞는 레퍼런스가 없어요. 필터를 풀어보세요.
          </p>
        ) : (
          <div className="mt-10 columns-2 gap-4 md:columns-3 lg:columns-4">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-white text-left shadow-sm transition-transform hover:scale-[1.02]"
              >
                <GalleryImage item={item} />
                <div className="p-3">
                  <p className="truncate text-xs text-muted">
                    {[...item.moods, ...item.locations].join(' · ')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </FadeUp>

      {selected && <Lightbox item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
