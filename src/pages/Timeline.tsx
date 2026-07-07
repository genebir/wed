import { useState } from 'react'
import { Check, ChevronDown, Lightbulb } from 'lucide-react'
import { timeline } from '../data'
import { formatMonthKo, isCurrentMonth, isPastMonth } from '../lib/date'
import { Card } from '../components/Card'
import { FadeUp } from '../components/FadeUp'
import type { TimelineItem } from '../types'

const MONTHS = [...new Set(timeline.map((t) => t.month))].sort()

export function Timeline() {
  return (
    <div className="py-20">
      <FadeUp>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">준비 일정</h1>
        <p className="mt-3 text-muted">본식까지 확정된 일정을 한눈에.</p>
      </FadeUp>

      <div className="relative mt-14 space-y-12">
        {/* 세로 라인 */}
        <div className="absolute inset-y-2 left-[7px] w-px bg-beige-200 md:left-[9px]" />

        {MONTHS.map((month, i) => {
          const items = timeline.filter((t) => t.month === month)
          const past = isPastMonth(month)
          const current = isCurrentMonth(month)
          return (
            <FadeUp key={month} delay={i * 60}>
              <section className={`relative pl-8 md:pl-10 ${past ? 'opacity-50' : ''}`}>
                {/* 마커 */}
                <span
                  className={`absolute left-0 top-1 flex h-4 w-4 items-center justify-center rounded-full md:h-5 md:w-5 ${
                    past
                      ? 'bg-beige-200'
                      : current
                        ? 'bg-blush-400 ring-4 ring-blush-100'
                        : 'border-2 border-beige-200 bg-white'
                  }`}
                >
                  {past && <Check size={11} className="text-white" strokeWidth={3} />}
                </span>

                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold tracking-tight">
                  {formatMonthKo(month)}
                  {current && (
                    <span className="rounded-full bg-blush-100 px-2.5 py-0.5 text-xs font-semibold text-blush-400">
                      이번 달
                    </span>
                  )}
                </h2>

                <div className="space-y-3">
                  {items.map((item) => (
                    <TimelineCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            </FadeUp>
          )
        })}
      </div>
    </div>
  )
}

function TimelineCard({ item }: { item: TimelineItem }) {
  const [open, setOpen] = useState(false)
  const hasTips = (item.tips?.length ?? 0) > 0

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => hasTips && setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-3 p-5 text-left ${
          hasTips ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        <div className="flex items-center gap-3">
          {item.done && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blush-400">
              <Check size={12} className="text-white" strokeWidth={3} />
            </span>
          )}
          <span className={`font-medium ${item.done ? 'text-muted line-through' : ''}`}>
            {item.title}
            {item.monthEnd && (
              <span className="ml-2 text-xs font-normal text-muted">
                ~ {formatMonthKo(item.monthEnd)}
              </span>
            )}
          </span>
        </div>
        {hasTips && (
          <ChevronDown
            size={18}
            className={`shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {hasTips && open && (
        <div className="border-t border-beige-100 bg-beige-50/60 px-5 py-4">
          <ul className="space-y-2">
            {item.tips!.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-muted">
                <Lightbulb size={14} className="mt-0.5 shrink-0 text-blush-400" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
