import { CalendarCheck, CircleCheck, ExternalLink, Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { vendors } from '../data'
import { Card } from '../components/Card'
import { FadeUp } from '../components/FadeUp'
import type { VendorStatus } from '../types'

const COLUMNS: { status: VendorStatus; icon: LucideIcon; badgeClass: string }[] = [
  { status: '알아보는중', icon: Search, badgeClass: 'bg-beige-100 text-muted' },
  { status: '상담예약', icon: CalendarCheck, badgeClass: 'bg-blush-100 text-blush-400' },
  { status: '계약완료', icon: CircleCheck, badgeClass: 'bg-[#0ca30c]/10 text-[#006300]' },
]

export function Vendors() {
  return (
    <div className="py-20">
      <FadeUp>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">업체 · 예약</h1>
        <p className="mt-3 text-muted">알아보는 곳부터 계약까지 상태별로 정리.</p>
      </FadeUp>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {COLUMNS.map(({ status, icon: Icon, badgeClass }, colIdx) => {
          const items = vendors.filter((v) => v.status === status)
          return (
            <FadeUp key={status} delay={colIdx * 80}>
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted">
                  <Icon size={15} /> {status}
                  <span className="rounded-full bg-beige-100 px-2 py-0.5 text-xs">
                    {items.length}
                  </span>
                </h2>
                <div className="space-y-3">
                  {items.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-beige-200 p-6 text-center text-sm text-muted">
                      아직 없어요
                    </p>
                  ) : (
                    items.map((v) => (
                      <Card key={v.name} className="p-5">
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <h3 className="font-medium leading-snug">{v.name}</h3>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs ${badgeClass}`}
                          >
                            {v.category}
                          </span>
                        </div>
                        {v.visitDate && (
                          <p className="text-xs text-muted">방문: {v.visitDate}</p>
                        )}
                        {v.memo && <p className="mt-2 text-sm text-muted">{v.memo}</p>}
                        {v.link && (
                          <a
                            href={v.link}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-xs text-muted underline underline-offset-2 hover:text-ink"
                          >
                            링크 <ExternalLink size={11} />
                          </a>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              </section>
            </FadeUp>
          )
        })}
      </div>
      <p className="mt-8 text-xs text-muted">
        업체 추가/상태 변경은 <code>src/data/vendors.json</code> 수정.
      </p>
    </div>
  )
}
