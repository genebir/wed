import { useState } from 'react'
import {
  Camera,
  Check,
  CloudRain,
  ExternalLink,
  MapPin,
  Sunset,
} from 'lucide-react'
import { gallery, snapPlan } from '../data'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Card } from '../components/Card'
import { FadeUp } from '../components/FadeUp'
import { Lightbox } from '../components/Lightbox'
import { GalleryImage } from '../components/GalleryImage'
import type { GalleryItem } from '../types'

export function SnapPlan() {
  const [gearState, setGearState] = useLocalStorage<Record<string, boolean>>(
    'snap-gear-state',
    {},
  )
  const [dayMemo, setDayMemo] = useLocalStorage<string>('snap-day-memo', '')
  const [previewRef, setPreviewRef] = useState<GalleryItem | null>(null)

  const gearDone = snapPlan.gear.filter((g) => gearState[g.id]).length

  return (
    <div className="space-y-16 py-20">
      <FadeUp>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">셀프 스냅 계획</h1>
        <p className="mt-3 text-muted">
          장소·장비·샷 리스트까지, 우리가 직접 찍는 스냅 준비. 📸
        </p>
      </FadeUp>

      {/* 장소 후보 */}
      <FadeUp delay={80}>
        <section>
          <h2 className="mb-5 flex items-center gap-2 text-xl font-bold tracking-tight">
            <MapPin size={20} className="text-blush-400" /> 장소 후보
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {snapPlan.locations.map((loc) => (
              <Card key={loc.id} className="p-6">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{loc.name}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${
                      loc.permitRequired
                        ? 'bg-blush-100 text-blush-400'
                        : 'bg-beige-100 text-muted'
                    }`}
                  >
                    {loc.permitRequired ? '촬영 허가 필요' : '허가 불필요'}
                  </span>
                </div>
                {loc.address && <p className="text-sm text-muted">{loc.address}</p>}
                {loc.goldenHourNote && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                    <Sunset size={14} className="text-blush-400" /> {loc.goldenHourNote}
                  </p>
                )}
                {loc.memo && <p className="mt-2 text-sm text-muted">{loc.memo}</p>}
              </Card>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            장소 추가는 <code>src/data/snapPlan.json</code>의 <code>locations</code>에 한 줄.
          </p>
        </section>
      </FadeUp>

      {/* 장비 체크리스트 */}
      <FadeUp delay={120}>
        <section>
          <h2 className="mb-5 flex items-center gap-2 text-xl font-bold tracking-tight">
            <Camera size={20} className="text-blush-400" /> 장비 체크리스트
            <span className="text-sm font-normal text-muted">
              {gearDone}/{snapPlan.gear.length}
            </span>
          </h2>
          <Card className="divide-y divide-beige-100">
            {snapPlan.gear.map((gear) => {
              const done = gearState[gear.id] ?? false
              return (
                <button
                  key={gear.id}
                  type="button"
                  onClick={() => setGearState((prev) => ({ ...prev, [gear.id]: !done }))}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      done
                        ? 'animate-pop border-blush-400 bg-blush-400'
                        : 'border-beige-200 bg-white'
                    }`}
                  >
                    {done && <Check size={13} className="text-white" strokeWidth={3.5} />}
                  </span>
                  <span className={done ? 'text-muted line-through' : ''}>{gear.name}</span>
                </button>
              )
            })}
          </Card>
        </section>
      </FadeUp>

      {/* 샷 리스트 */}
      <FadeUp delay={160}>
        <section>
          <h2 className="mb-5 text-xl font-bold tracking-tight">🎬 샷 리스트</h2>
          <div className="space-y-3">
            {snapPlan.shots.map((shot) => {
              const ref = gallery.find((g) => g.id === shot.galleryRef)
              return (
                <Card key={shot.id} className="flex items-center gap-4 p-4">
                  {ref && (
                    <button
                      type="button"
                      onClick={() => setPreviewRef(ref)}
                      className="w-16 shrink-0 overflow-hidden rounded-xl transition-transform hover:scale-105"
                    >
                      <GalleryImage item={ref} />
                    </button>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium">{shot.title}</p>
                    {shot.location && (
                      <p className="text-xs text-muted">📍 {shot.location}</p>
                    )}
                    {shot.note && <p className="mt-1 text-sm text-muted">{shot.note}</p>}
                  </div>
                </Card>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-muted">
            갤러리에서 마음에 든 컷의 <code>id</code>를 <code>galleryRef</code>로 연결하면
            썸네일이 붙어요.
          </p>
        </section>
      </FadeUp>

      {/* 촬영일 체크 */}
      <FadeUp delay={200}>
        <section>
          <h2 className="mb-5 text-xl font-bold tracking-tight">☀️ 촬영일 체크</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="mb-2 flex items-center gap-1.5 font-semibold">
                <Sunset size={16} className="text-blush-400" /> 일몰 시간
              </h3>
              {snapPlan.sunsetLink && (
                <a
                  href={snapPlan.sunsetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted underline underline-offset-2 hover:text-ink"
                >
                  서울 일몰 시간 확인하기 <ExternalLink size={13} />
                </a>
              )}
              <p className="mt-2 text-sm text-muted">골든아워는 일몰 전 약 1시간.</p>
            </Card>
            <Card className="p-6">
              <h3 className="mb-2 flex items-center gap-1.5 font-semibold">
                <CloudRain size={16} className="text-blush-400" /> 우천 대체 플랜
              </h3>
              <p className="text-sm text-muted">{snapPlan.rainPlan}</p>
            </Card>
          </div>
          <Card className="mt-4 p-6">
            <h3 className="mb-3 font-semibold">촬영일 메모</h3>
            <textarea
              value={dayMemo}
              onChange={(e) => setDayMemo(e.target.value)}
              placeholder="예: 10/17(토) 한강 — 일몰 17:50, 17:00 도착. 비 오면 다음 주로."
              rows={3}
              className="w-full resize-none rounded-xl border border-beige-100 bg-beige-50/50 p-3 text-sm outline-none placeholder:text-muted/60 focus:border-blush-200"
            />
            <p className="mt-2 text-xs text-muted">이 메모는 내 브라우저에만 저장돼요.</p>
          </Card>
        </section>
      </FadeUp>

      {previewRef && <Lightbox item={previewRef} onClose={() => setPreviewRef(null)} />}
    </div>
  )
}
