import { useState } from 'react'
import { Check } from 'lucide-react'
import { checklist } from '../data'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { currentMonthKey, formatMonthKo, isCurrentMonth } from '../lib/date'
import { isItemDone, progressOf, type DoneState } from '../lib/progress'
import { Card } from '../components/Card'
import { ProgressBar } from '../components/ProgressBar'
import { FadeUp } from '../components/FadeUp'
import type { ChecklistItem } from '../types'

const MONTHS = [...new Set(checklist.map((c) => c.month))].sort()

export function Checklist() {
  const [doneState, setDoneState] = useLocalStorage<DoneState>('checklist-state', {})
  const [month, setMonth] = useState(() =>
    MONTHS.includes(currentMonthKey()) ? currentMonthKey() : MONTHS[0],
  )

  const items = checklist.filter((c) => c.month === month)
  const progress = progressOf(items, doneState)

  const toggle = (item: ChecklistItem) => {
    setDoneState((prev) => ({ ...prev, [item.id]: !isItemDone(item, prev) }))
  }

  return (
    <div className="py-20">
      <FadeUp>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">체크리스트</h1>
        <p className="mt-3 text-muted">이번 달 할 일부터 하나씩 체크.</p>
      </FadeUp>

      {/* 월별 탭 */}
      <FadeUp delay={80}>
        <div className="-mx-5 mt-10 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
          <div className="flex w-max gap-2">
            {MONTHS.map((m) => {
              const active = m === month
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonth(m)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                    active
                      ? 'bg-ink font-semibold text-white'
                      : 'bg-white text-muted shadow-sm hover:text-ink'
                  }`}
                >
                  {formatMonthKo(m).replace('년 ', '.').replace('월', '')}
                  {isCurrentMonth(m) && (
                    <span className={`ml-1.5 ${active ? 'text-blush-200' : 'text-blush-400'}`}>
                      ●
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </FadeUp>

      {/* 월 진행률 */}
      <FadeUp delay={120}>
        <Card className="mt-6 p-6">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-semibold">{formatMonthKo(month)} 진행률</h2>
            <span className="text-xl font-bold tracking-tight">{progress}%</span>
          </div>
          <ProgressBar percent={progress} />
        </Card>
      </FadeUp>

      {/* 항목 목록 */}
      <div className="mt-6 space-y-3">
        {items.map((item, i) => {
          const done = isItemDone(item, doneState)
          return (
            <FadeUp key={item.id} delay={140 + i * 40}>
              <Card className="transition-transform hover:scale-[1.02]">
                <button
                  type="button"
                  onClick={() => toggle(item)}
                  className="flex w-full items-center gap-4 p-5 text-left"
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      done ? 'animate-pop border-blush-400 bg-blush-400' : 'border-beige-200 bg-white'
                    }`}
                  >
                    {done && <Check size={13} className="text-white" strokeWidth={3.5} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block font-medium leading-snug ${
                        done ? 'text-muted line-through' : ''
                      }`}
                    >
                      {item.title}
                    </span>
                    {item.detail && (
                      <span className="mt-0.5 block text-xs text-muted">{item.detail}</span>
                    )}
                  </span>
                  <span className="shrink-0 rounded-full bg-beige-100 px-2.5 py-1 text-xs text-muted">
                    {item.category}
                  </span>
                </button>
              </Card>
            </FadeUp>
          )
        })}
      </div>
    </div>
  )
}
