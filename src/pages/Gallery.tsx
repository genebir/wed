import { useMemo, useState } from 'react'
import { Heart } from 'lucide-react'
import { gallery } from '../data'
import { filterGallery, toggleValue } from '../lib/filter'
import { useSharedState } from '../hooks/useSharedState'
import { Chip } from '../components/Chip'
import { GalleryImage } from '../components/GalleryImage'
import { Lightbox } from '../components/Lightbox'
import { FadeUp } from '../components/FadeUp'
import type { GalleryItem, SnapShot } from '../types'

const MOOD_PRESETS = ['따뜻한', '청량한', '필름감성', '시네마틱', '미니멀', '러블리']
const LOCATION_PRESETS = ['한강', '공원·수목원', '카페', '바다', '골목·도심', '스튜디오·실내']

// 프리셋에 없는 값이 데이터에 있으면 필터에 함께 노출
const MOODS = [...new Set([...MOOD_PRESETS, ...gallery.flatMap((g) => g.moods)])]
const LOCATIONS = [...new Set([...LOCATION_PRESETS, ...gallery.flatMap((g) => g.locations)])]

export function Gallery() {
  const [moods, setMoods] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [favOnly, setFavOnly] = useState(false)
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const [favs, setFavs] = useSharedState<string[]>('gallery-favs', [])
  const [customShots, setCustomShots] = useSharedState<SnapShot[]>('custom-shots', [])

  const items = useMemo(() => {
    const filtered = filterGallery(gallery, moods, locations)
    return favOnly ? filtered.filter((g) => favs.includes(g.id)) : filtered
  }, [moods, locations, favOnly, favs])

  const toggleFav = (id: string) => {
    setFavs((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const toggleShot = (item: GalleryItem) => {
    setCustomShots((prev) =>
      prev.some((s) => s.galleryRef === item.id)
        ? prev.filter((s) => s.galleryRef !== item.id)
        : [
            ...prev,
            {
              id: `shot-${item.id}`,
              title: item.memo ?? '레퍼런스 컷',
              galleryRef: item.id,
              note: '',
            },
          ],
    )
  }

  return (
    <div className="py-20">
      <FadeUp>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">스냅 레퍼런스</h1>
        <p className="mt-3 text-muted">
          이런 느낌으로 찍자 — 마음에 들면 ♥ 찜, 확정이면 샷 리스트로.
        </p>
      </FadeUp>

      {/* 필터 */}
      <FadeUp delay={80}>
        <div className="mt-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFavOnly((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition-colors ${
                favOnly
                  ? 'bg-blush-400 font-semibold text-white'
                  : 'bg-white text-muted shadow-sm hover:text-ink'
              }`}
            >
              <Heart size={14} fill={favOnly ? 'currentColor' : 'none'} />
              찜만 보기 {favs.length > 0 && `(${favs.length})`}
            </button>
          </div>
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
            {favOnly ? '아직 찜한 레퍼런스가 없어요. 사진의 ♥를 눌러보세요.' : '조건에 맞는 레퍼런스가 없어요. 필터를 풀어보세요.'}
          </p>
        ) : (
          <div className="mt-10 columns-2 gap-4 md:columns-3 lg:columns-4">
            {items.map((item) => {
              const fav = favs.includes(item.id)
              return (
                <div
                  key={item.id}
                  className="relative mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm transition-transform hover:scale-[1.02]"
                >
                  <button
                    type="button"
                    onClick={() => setSelected(item)}
                    className="block w-full text-left"
                  >
                    <GalleryImage item={item} />
                    <div className="p-3">
                      <p className="truncate text-xs text-muted">
                        {[...item.moods, ...item.locations].join(' · ')}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFav(item.id)}
                    aria-label={fav ? '찜 해제' : '찜'}
                    className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition-all ${
                      fav ? 'animate-pop bg-white/90 text-blush-400' : 'bg-white/60 text-muted hover:text-blush-400'
                    }`}
                  >
                    <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </FadeUp>

      {selected && (
        <Lightbox
          item={selected}
          onClose={() => setSelected(null)}
          isFav={favs.includes(selected.id)}
          onToggleFav={() => toggleFav(selected.id)}
          inShots={customShots.some((s) => s.galleryRef === selected.id)}
          onToggleShot={() => toggleShot(selected)}
        />
      )}
    </div>
  )
}
