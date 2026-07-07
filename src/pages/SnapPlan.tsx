import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import {
  Camera,
  Check,
  Clapperboard,
  CloudRain,
  ExternalLink,
  MapPin,
  Sunset,
  X,
} from 'lucide-react'
import { gallery, snapPlan } from '../data'
import { useSharedState } from '../hooks/useSharedState'
import { Card } from '../components/Card'
import { FadeUp } from '../components/FadeUp'
import { Lightbox } from '../components/Lightbox'
import { GalleryImage } from '../components/GalleryImage'
import type { GalleryItem, SnapShot } from '../types'

export function SnapPlan() {
  const [gearState, setGearState] = useSharedState<Record<string, boolean>>(
    'snap-gear-state',
    {},
  )
  const [dayMemo, setDayMemo] = useSharedState<string>('snap-day-memo', '')
  const [customShots, setCustomShots] = useSharedState<SnapShot[]>('custom-shots', [])
  const [previewRef, setPreviewRef] = useState<GalleryItem | null>(null)

  const gearDone = snapPlan.gear.filter((g) => gearState[g.id]).length
  const shots = [...snapPlan.shots, ...customShots]
  const customIds = new Set(customShots.map((s) => s.id))

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
                    <Sunset size={14} className="shrink-0 text-blush-400" /> {loc.goldenHourNote}
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

      {/* A7C II 공통 세팅 */}
      <FadeUp delay={100}>
        <section>
          <h2 className="mb-5 flex items-center gap-2 text-xl font-bold tracking-tight">
            <Camera size={20} className="text-blush-400" /> A7C II 셀프 스냅 공통 세팅
          </h2>
          <Card className="p-6">
            <ul className="grid gap-3 text-sm md:grid-cols-2">
              <li className="flex gap-2">
                <span className="text-blush-400">•</span>
                <span>
                  <strong>RAW+JPEG</strong>로 촬영 — JPEG은 크리에이티브 룩으로 바로 쓰고,
                  실패 컷은 RAW로 복구
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blush-400">•</span>
                <span>
                  <strong>Eye AF(사람 인식) + AF-C</strong> 상시 ON — 둘 다 프레임에 있으면
                  얼굴 등록해둔 쪽 우선
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blush-400">•</span>
                <span>
                  셀프 촬영은 <strong>삼각대 + Creators&rsquo; App 리모컨</strong>이 기본,
                  움직이는 컷은 <strong>인터벌 촬영(2~3초)</strong>로 연속 확보
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blush-400">•</span>
                <span>
                  <strong>격자선 ON + 수평계</strong> — 셀프는 수평 틀어진 걸 현장에서 못
                  알아채요
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blush-400">•</span>
                <span>
                  ISO 오토 상한 <strong>3200</strong>, 저속한계 <strong>1/125</strong> (야간
                  제외)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blush-400">•</span>
                <span>
                  각 컷별 세부 레시피는 <strong>갤러리에서 사진 클릭</strong> → &ldquo;A7C
                  II로 이렇게&rdquo; 참고
                </span>
              </li>
            </ul>
          </Card>
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
          <h2 className="mb-5 flex items-center gap-2 text-xl font-bold tracking-tight">
            <Clapperboard size={20} className="text-blush-400" /> 샷 리스트
            <span className="text-sm font-normal text-muted">{shots.length}컷</span>
          </h2>
          <div className="space-y-3">
            {shots.map((shot) => {
              const ref = gallery.find((g) => g.id === shot.galleryRef)
              const isCustom = customIds.has(shot.id)
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
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{shot.title}</p>
                    {shot.location && (
                      <p className="text-xs text-muted">📍 {shot.location}</p>
                    )}
                    {shot.note && <p className="mt-1 text-sm text-muted">{shot.note}</p>}
                  </div>
                  {isCustom && (
                    <button
                      type="button"
                      onClick={() =>
                        setCustomShots((prev) => prev.filter((s) => s.id !== shot.id))
                      }
                      aria-label="샷 삭제"
                      className="shrink-0 rounded-full p-2 text-muted hover:text-ink"
                    >
                      <X size={16} />
                    </button>
                  )}
                </Card>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-muted">
            갤러리에서 사진 열고 <strong>샷 리스트에 추가</strong>를 누르면 여기 쌓여요.
          </p>
        </section>
      </FadeUp>

      {/* 촬영일 체크 */}
      <FadeUp delay={200}>
        <section>
          <h2 className="mb-5 text-xl font-bold tracking-tight">☀️ 촬영일 체크</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <SunsetCard />
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
          </Card>
        </section>
      </FadeUp>

      {previewRef && <Lightbox item={previewRef} onClose={() => setPreviewRef(null)} />}
    </div>
  )
}

/** 서울 일몰/골든아워 자동 표시 — sunrise-sunset.org 무료 API */
function SunsetCard() {
  const [date, setDate] = useState(() => format(new Date(), 'yyyy-MM-dd'))
  const [times, setTimes] = useState<{ golden: string; sunset: string; blue: string } | null>(
    null,
  )
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    setTimes(null)
    setFailed(false)
    fetch(
      `https://api.sunrise-sunset.org/json?lat=37.5665&lng=126.9780&date=${date}&formatted=0`,
    )
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return
        if (d.status !== 'OK') throw new Error(d.status)
        const fmt = (dt: Date) =>
          dt.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Seoul',
          })
        const sunset = new Date(d.results.sunset)
        setTimes({
          golden: fmt(new Date(sunset.getTime() - 60 * 60 * 1000)),
          sunset: fmt(sunset),
          blue: fmt(new Date(d.results.civil_twilight_end)),
        })
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [date])

  return (
    <Card className="p-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 font-semibold">
          <Sunset size={16} className="text-blush-400" /> 서울 일몰 시간
        </h3>
        <input
          type="date"
          value={date}
          onChange={(e) => e.target.value && setDate(e.target.value)}
          className="rounded-lg border border-beige-100 bg-beige-50/50 px-2 py-1 text-xs outline-none focus:border-blush-200"
        />
      </div>
      {failed ? (
        <a
          href={snapPlan.sunsetLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted underline underline-offset-2 hover:text-ink"
        >
          시간을 불러오지 못했어요 — 직접 확인하기 <ExternalLink size={13} />
        </a>
      ) : !times ? (
        <p className="text-sm text-muted">불러오는 중…</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-blush-50 py-3">
            <p className="text-xs text-muted">골든아워</p>
            <p className="mt-0.5 font-semibold tabular-nums">{times.golden}</p>
          </div>
          <div className="rounded-xl bg-blush-100 py-3">
            <p className="text-xs text-muted">일몰</p>
            <p className="mt-0.5 font-semibold tabular-nums">{times.sunset}</p>
          </div>
          <div className="rounded-xl bg-beige-100 py-3">
            <p className="text-xs text-muted">블루아워 끝</p>
            <p className="mt-0.5 font-semibold tabular-nums">{times.blue}</p>
          </div>
        </div>
      )}
    </Card>
  )
}
