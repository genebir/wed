import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Camera, Heart, Images } from 'lucide-react'
import { gallery } from '../data'
import { filterGallery, toggleValue } from '../lib/filter'
import { useSharedState } from '../hooks/useSharedState'
import { useColumnCount } from '../hooks/useColumnCount'
import { Chip } from '../components/Chip'
import { GalleryImage } from '../components/GalleryImage'
import { Lightbox } from '../components/Lightbox'
import { FadeUp } from '../components/FadeUp'
import { OurShots } from '../components/OurShots'
import type { GalleryItem, SnapShot } from '../types'

const MOOD_PRESETS = ['따뜻한', '청량한', '필름감성', '시네마틱', '미니멀', '러블리']
const LOCATION_PRESETS = ['한강', '공원·수목원', '카페', '바다', '골목·도심', '스튜디오·실내']

// 프리셋에 없는 값이 데이터에 있으면 필터에 함께 노출
const MOODS = [...new Set([...MOOD_PRESETS, ...gallery.flatMap((g) => g.moods)])]
const LOCATIONS = [...new Set([...LOCATION_PRESETS, ...gallery.flatMap((g) => g.locations)])]

export function Gallery() {
  const [params] = useSearchParams()
  const [tab, setTab] = useState<'refs' | 'ours'>(
    params.get('tab') === 'ours' ? 'ours' : 'refs',
  )

  return (
    <div className="py-20">
      <FadeUp>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">갤러리</h1>
        <p className="mt-3 text-muted">
          레퍼런스로 감 잡고, 우리가 찍은 컷을 모아요.
        </p>
        {/* 탭 */}
        <div className="mt-8 inline-flex rounded-full bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setTab('refs')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors ${
              tab === 'refs' ? 'bg-ink font-semibold text-white' : 'text-muted hover:text-ink'
            }`}
          >
            <Images size={15} /> 레퍼런스
          </button>
          <button
            type="button"
            onClick={() => setTab('ours')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors ${
              tab === 'ours' ? 'bg-ink font-semibold text-white' : 'text-muted hover:text-ink'
            }`}
          >
            <Camera size={15} /> 우리 컷
          </button>
        </div>
      </FadeUp>

      <div className="mt-10">
        {tab === 'refs' ? <ReferenceGallery /> : <OurShots />}
      </div>
    </div>
  )
}

/** CSS multi-column 대신 JS 컬럼 분배 masonry — lazy loading이 정상 동작한다 */
function ReferenceGallery() {
  const [moods, setMoods] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [favOnly, setFavOnly] = useState(false)
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const [favs, setFavs] = useSharedState<string[]>('gallery-favs', [])
  const [customShots, setCustomShots] = useSharedState<SnapShot[]>('custom-shots', [])
  const columnCount = useColumnCount()

  const items = useMemo(() => {
    const filtered = filterGallery(gallery, moods, locations)
    return favOnly ? filtered.filter((g) => favs.includes(g.id)) : filtered
  }, [moods, locations, favOnly, favs])

  // 세로 높이가 가장 짧은 컬럼에 다음 사진을 넣어 균형 잡힌 masonry 구성
  const columns = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => ({
      items: [] as { item: GalleryItem; order: number }[],
      height: 0,
    }))
    items.forEach((item, order) => {
      const shortest = cols.reduce((a, b) => (a.height <= b.height ? a : b))
      shortest.items.push({ item, order })
      shortest.height += item.w && item.h ? item.h / item.w : 1.33
    })
    return cols.map((c) => c.items)
  }, [items, columnCount])

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
    <div>
      {/* 필터 */}
      <FadeUp>
        <div className="space-y-4">
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
          <div className="mt-10 flex gap-4">
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="flex min-w-0 flex-1 flex-col gap-4">
                {col.map(({ item, order }) => {
                  const fav = favs.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      className="relative overflow-hidden rounded-2xl bg-white shadow-sm transition-transform hover:scale-[1.02]"
                    >
                      <button
                        type="button"
                        onClick={() => setSelected(item)}
                        className="block w-full text-left"
                      >
                        <GalleryImage item={item} eager={order < columnCount * 3} />
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
            ))}
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
