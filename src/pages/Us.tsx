import { useState } from 'react'
import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import { CalendarHeart, Check, Lock, LockOpen, Mail, Plus, Sprout, Trash2 } from 'lucide-react'
import { wedding } from '../data'
import { useSharedState } from '../hooks/useSharedState'
import { useUserEmail } from '../hooks/useUserEmail'
import { useDday } from '../hooks/useDday'
import { Card } from '../components/Card'
import { FadeUp } from '../components/FadeUp'
import type { Anniversary, BucketItem, TimeCapsule } from '../types'

export function Us() {
  return (
    <div className="space-y-16 py-20">
      <FadeUp>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">우리</h1>
        <p className="mt-3 text-muted">준비 말고, 우리 둘 이야기. 💕</p>
      </FadeUp>

      <TimeCapsuleSection />
      <AnniversarySection />
      <BucketListSection />
    </div>
  )
}

/** 본식 날까지 잠기는 서로에게 쓰는 편지 */
function TimeCapsuleSection() {
  const email = useUserEmail()
  const [capsule, setCapsule] = useSharedState<TimeCapsule>('timecapsule', {})
  const dday = useDday(wedding.weddingDate)
  const opened = dday <= 0

  const myLetter = email ? (capsule[email]?.text ?? '') : ''
  const partnerEntry = Object.entries(capsule).find(([who]) => who !== email)

  const saveMine = (text: string) => {
    if (!email) return
    setCapsule((prev) => ({
      ...prev,
      [email]: { text, updatedAt: format(new Date(), 'yyyy-MM-dd') },
    }))
  }

  return (
    <FadeUp delay={60}>
      <section>
        <h2 className="mb-2 flex items-center gap-2 text-xl font-bold tracking-tight">
          <Mail size={20} className="text-blush-400" /> 타임캡슐 편지
        </h2>
        <p className="mb-5 text-sm text-muted">
          {opened
            ? '드디어 열렸어요! 서로에게 남긴 편지를 확인하세요. 💌'
            : `서로에게 쓰는 편지 — 본식 날 아침(D-${dday})에 열려요. 그 전엔 서로 볼 수 없어요.`}
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {/* 내 편지 */}
          <Card className="p-6">
            <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-muted">
              <LockOpen size={14} /> 나의 편지
            </h3>
            {opened ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {myLetter || '편지를 남기지 않았어요.'}
              </p>
            ) : (
              <>
                <textarea
                  value={myLetter}
                  onChange={(e) => saveMine(e.target.value)}
                  placeholder={'결혼식 날 아침의 상대에게…\n지금 이 시기의 마음을 남겨보세요.'}
                  rows={7}
                  disabled={!email}
                  className="w-full resize-none rounded-xl border border-beige-100 bg-beige-50/50 p-3 text-sm leading-relaxed outline-none placeholder:text-muted/60 focus:border-blush-200"
                />
                <p className="mt-2 text-xs text-muted">
                  쓰는 대로 저장돼요. 본식 전까지 언제든 고칠 수 있어요.
                </p>
              </>
            )}
          </Card>

          {/* 상대의 편지 */}
          <Card className="flex flex-col p-6">
            <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-muted">
              <Lock size={14} /> 상대의 편지
            </h3>
            {opened ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {partnerEntry?.[1].text || '상대가 편지를 남기지 않았어요.'}
              </p>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                <p className="text-4xl">💌</p>
                <p className="mt-4 text-sm font-medium">
                  {partnerEntry?.[1].text
                    ? '편지가 도착해 있어요.'
                    : '아직 편지가 없어요.'}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {partnerEntry?.[1].text
                    ? `봉인됨 — ${format(parseISO(wedding.weddingDate), 'yyyy년 M월 d일')}에 열려요`
                    : '상대가 쓰면 여기에 봉인 표시가 떠요'}
                </p>
              </div>
            )}
          </Card>
        </div>
      </section>
    </FadeUp>
  )
}

/** 우리 기념일 D+ 카운터 */
function AnniversarySection() {
  const [items, setItems] = useSharedState<Anniversary[]>('anniversaries', [])
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')

  const add = () => {
    if (!title.trim() || !date) return
    setItems((prev) =>
      [...prev, { id: crypto.randomUUID(), title: title.trim(), date }].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    )
    setTitle('')
    setDate('')
  }

  return (
    <FadeUp delay={100}>
      <section>
        <h2 className="mb-5 flex items-center gap-2 text-xl font-bold tracking-tight">
          <CalendarHeart size={20} className="text-blush-400" /> 우리 기념일
        </h2>

        {items.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3">
            {items.map((a) => {
              // 한국식: 그날이 1일
              const days = differenceInCalendarDays(new Date(), parseISO(a.date)) + 1
              return (
                <Card key={a.id} className="group relative p-5 text-center">
                  <p className="text-sm text-muted">{a.title}</p>
                  <p className="mt-1 text-2xl font-bold tracking-tight">
                    {days > 0 ? `${days}일` : `D${days - 1}`}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {format(parseISO(a.date), 'yyyy.MM.dd')}
                  </p>
                  <button
                    type="button"
                    onClick={() => setItems((prev) => prev.filter((x) => x.id !== a.id))}
                    aria-label="기념일 삭제"
                    className="absolute right-2 top-2 rounded-full p-1.5 text-muted opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </Card>
              )
            })}
          </div>
        )}

        <Card className="flex flex-wrap items-center gap-2 p-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="처음 만난 날, 프러포즈…"
            className="min-w-0 flex-1 rounded-xl border border-beige-200 bg-beige-50/50 px-3 py-2 text-sm outline-none focus:border-blush-200"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-beige-200 bg-beige-50/50 px-3 py-2 text-sm outline-none focus:border-blush-200"
          />
          <button
            type="button"
            onClick={add}
            disabled={!title.trim() || !date}
            aria-label="기념일 추가"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white disabled:opacity-40"
          >
            <Plus size={16} />
          </button>
        </Card>
      </section>
    </FadeUp>
  )
}

/** 결혼 전 버킷리스트 */
function BucketListSection() {
  const [items, setItems] = useSharedState<BucketItem[]>('bucket-list', [])
  const [text, setText] = useState('')
  const done = items.filter((i) => i.done).length

  const add = () => {
    if (!text.trim()) return
    setItems((prev) => [...prev, { id: crypto.randomUUID(), text: text.trim(), done: false }])
    setText('')
  }

  return (
    <FadeUp delay={140}>
      <section>
        <h2 className="mb-5 flex items-center gap-2 text-xl font-bold tracking-tight">
          <Sprout size={20} className="text-blush-400" /> 결혼 전 버킷리스트
          {items.length > 0 && (
            <span className="text-sm font-normal text-muted">
              {done}/{items.length} 했어요
            </span>
          )}
        </h2>

        <Card className="mb-3 flex items-center gap-2 p-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="결혼 전에 둘이 꼭 하자 — 벚꽃 구경, 캠핑, 요리 배우기…"
            className="min-w-0 flex-1 rounded-xl border border-beige-200 bg-beige-50/50 px-3 py-2 text-sm outline-none focus:border-blush-200"
          />
          <button
            type="button"
            onClick={add}
            disabled={!text.trim()}
            aria-label="버킷리스트 추가"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white disabled:opacity-40"
          >
            <Plus size={16} />
          </button>
        </Card>

        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">
            첫 번째 버킷을 적어보세요 🌸
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <Card key={item.id} className="group flex items-center gap-3 p-4">
                <button
                  type="button"
                  onClick={() =>
                    setItems((prev) =>
                      prev.map((x) => (x.id === item.id ? { ...x, done: !x.done } : x)),
                    )
                  }
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      item.done
                        ? 'animate-pop border-blush-400 bg-blush-400'
                        : 'border-beige-200 bg-white'
                    }`}
                  >
                    {item.done && <Check size={13} className="text-white" strokeWidth={3.5} />}
                  </span>
                  <span className={item.done ? 'text-muted line-through' : ''}>{item.text}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setItems((prev) => prev.filter((x) => x.id !== item.id))}
                  aria-label="삭제"
                  className="rounded-full p-1.5 text-muted opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </Card>
            ))}
          </div>
        )}
      </section>
    </FadeUp>
  )
}
