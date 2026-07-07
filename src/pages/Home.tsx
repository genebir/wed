import { Link } from 'react-router-dom'
import { ArrowRight, Camera, CircleCheck, Sparkles } from 'lucide-react'
import { checklist, gallery, timeline, wedding } from '../data'
import { useDday } from '../hooks/useDday'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { currentMonthKey, formatDateKo, formatMonthKo } from '../lib/date'
import { isItemDone, progressOf, type DoneState } from '../lib/progress'
import { Card } from '../components/Card'
import { ProgressBar } from '../components/ProgressBar'
import { FadeUp } from '../components/FadeUp'
import { GalleryImage } from '../components/GalleryImage'

export function Home() {
  const dday = useDday(wedding.weddingDate)
  const [doneState] = useLocalStorage<DoneState>('checklist-state', {})
  const month = currentMonthKey()

  const overallProgress = progressOf(checklist, doneState)
  const monthTimeline = timeline.filter(
    (t) => t.month === month || (t.monthEnd && t.month <= month && month <= t.monthEnd),
  )
  const monthTodos = checklist.filter((c) => c.month === month && !isItemDone(c, doneState))
  const recentRefs = gallery.slice(0, 4)

  return (
    <div className="space-y-20 py-20">
      {/* D-day 히어로 */}
      <FadeUp>
        <section className="text-center">
          <p className="mb-4 text-sm font-medium text-muted">
            {formatDateKo(wedding.weddingDate)}
          </p>
          <h1 className="text-6xl font-bold tracking-tight md:text-8xl">
            D-{dday}
          </h1>
          <p className="mt-6 font-serif text-lg text-muted">
            우리 둘의 결혼 준비, 즐겁게 하나씩 💍
          </p>
        </section>
      </FadeUp>

      {/* 전체 진행률 */}
      <FadeUp delay={100}>
        <Card className="p-8">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Sparkles size={18} className="text-blush-400" />
              전체 준비 진행률
            </h2>
            <span className="text-2xl font-bold tracking-tight">{overallProgress}%</span>
          </div>
          <ProgressBar percent={overallProgress} />
          <p className="mt-3 text-sm text-muted">
            체크리스트 {checklist.length}개 중{' '}
            {checklist.filter((c) => isItemDone(c, doneState)).length}개 완료
          </p>
        </Card>
      </FadeUp>

      {/* 이번 달 할 일 */}
      <FadeUp delay={150}>
        <section>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              {formatMonthKo(month)}의 할 일
            </h2>
            <Link
              to="/checklist"
              className="flex items-center gap-1 text-sm text-muted hover:text-ink"
            >
              체크리스트 <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="mb-4 text-sm font-semibold text-muted">이번 달 일정</h3>
              {monthTimeline.length === 0 ? (
                <p className="text-sm text-muted">이번 달 확정 일정이 없어요.</p>
              ) : (
                <ul className="space-y-3">
                  {monthTimeline.map((t) => (
                    <li key={t.id} className="flex items-center gap-2.5">
                      <CircleCheck
                        size={18}
                        className={t.done ? 'text-blush-400' : 'text-beige-200'}
                      />
                      <span className={t.done ? 'text-muted line-through' : ''}>
                        {t.title}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-sm font-semibold text-muted">남은 체크리스트</h3>
              {monthTodos.length === 0 ? (
                <p className="text-sm text-muted">이번 달 할 일을 모두 끝냈어요! 🎉</p>
              ) : (
                <ul className="space-y-3">
                  {monthTodos.map((c) => (
                    <li key={c.id} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blush-400" />
                      <div>
                        <p className="leading-snug">{c.title}</p>
                        {c.detail && <p className="text-xs text-muted">{c.detail}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </section>
      </FadeUp>

      {/* 스냅 레퍼런스 미리보기 */}
      <FadeUp delay={200}>
        <section>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Camera size={22} className="text-blush-400" />
              스냅 레퍼런스
            </h2>
            <Link
              to="/gallery"
              className="flex items-center gap-1 text-sm text-muted hover:text-ink"
            >
              갤러리 <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {recentRefs.map((g) => (
              <Card key={g.id} className="overflow-hidden">
                <GalleryImage item={g} className="aspect-[3/4] object-cover" />
                <div className="p-3">
                  <p className="truncate text-xs text-muted">{g.moods.join(' · ')}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </FadeUp>
    </div>
  )
}
