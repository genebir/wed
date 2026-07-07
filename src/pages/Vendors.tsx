import { useState } from 'react'
import {
  CalendarCheck,
  CircleCheck,
  ExternalLink,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { vendors as seedVendors } from '../data'
import { useSharedState } from '../hooks/useSharedState'
import { Card } from '../components/Card'
import { FadeUp } from '../components/FadeUp'
import type { Vendor, VendorStatus } from '../types'

const STATUSES: VendorStatus[] = ['알아보는중', '상담예약', '계약완료']

const COLUMNS: { status: VendorStatus; icon: LucideIcon; badgeClass: string }[] = [
  { status: '알아보는중', icon: Search, badgeClass: 'bg-beige-100 text-muted' },
  { status: '상담예약', icon: CalendarCheck, badgeClass: 'bg-blush-100 text-blush-400' },
  { status: '계약완료', icon: CircleCheck, badgeClass: 'bg-[#0ca30c]/10 text-[#006300]' },
]

const CATEGORIES = ['반지', '헤어메이크업', '드레스', '정장·혼주의상', '청첩장', '부케·꽃', '기타']

const EMPTY_FORM = { name: '', category: CATEGORIES[0], link: '', memo: '', visitDate: '' }

export function Vendors() {
  const [vendors, setVendors] = useSharedState<Vendor[]>('vendors-list', seedVendors)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)

  const addVendor = () => {
    if (!form.name.trim()) return
    setVendors((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        category: form.category,
        status: '알아보는중',
        link: form.link.trim(),
        memo: form.memo.trim(),
        visitDate: form.visitDate,
      },
    ])
    setForm(EMPTY_FORM)
    setFormOpen(false)
  }

  const update = (id: string, patch: Partial<Vendor>) => {
    setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)))
  }

  const remove = (id: string, name: string) => {
    if (window.confirm(`'${name}' 업체를 삭제할까요?`)) {
      setVendors((prev) => prev.filter((v) => v.id !== id))
    }
  }

  return (
    <div className="py-20">
      <FadeUp>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">업체 · 예약</h1>
            <p className="mt-3 text-muted">알아보는 곳부터 계약까지 상태별로 정리.</p>
          </div>
          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            {formOpen ? <X size={15} /> : <Plus size={15} />}
            {formOpen ? '닫기' : '업체 추가'}
          </button>
        </div>
      </FadeUp>

      {/* 추가 폼 */}
      {formOpen && (
        <Card className="mt-8 p-6">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="업체 이름 *"
              className="rounded-xl border border-beige-200 bg-beige-50/50 px-3 py-2 text-sm outline-none focus:border-blush-200"
            />
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="rounded-xl border border-beige-200 bg-beige-50/50 px-3 py-2 text-sm outline-none focus:border-blush-200"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              value={form.link}
              onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
              placeholder="링크 (선택)"
              className="rounded-xl border border-beige-200 bg-beige-50/50 px-3 py-2 text-sm outline-none focus:border-blush-200"
            />
            <input
              type="date"
              value={form.visitDate}
              onChange={(e) => setForm((f) => ({ ...f, visitDate: e.target.value }))}
              className="rounded-xl border border-beige-200 bg-beige-50/50 px-3 py-2 text-sm outline-none focus:border-blush-200"
            />
            <input
              value={form.memo}
              onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))}
              placeholder="메모 (선택)"
              className="rounded-xl border border-beige-200 bg-beige-50/50 px-3 py-2 text-sm outline-none focus:border-blush-200 md:col-span-2"
            />
          </div>
          <button
            type="button"
            onClick={addVendor}
            disabled={!form.name.trim()}
            className="mt-4 rounded-full bg-blush-400 px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            추가하기
          </button>
        </Card>
      )}

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
                      <VendorCard
                        key={v.id}
                        vendor={v}
                        badgeClass={badgeClass}
                        editing={editingId === v.id}
                        onToggleEdit={() => setEditingId(editingId === v.id ? null : v.id)}
                        onUpdate={(patch) => update(v.id, patch)}
                        onRemove={() => remove(v.id, v.name)}
                      />
                    ))
                  )}
                </div>
              </section>
            </FadeUp>
          )
        })}
      </div>
    </div>
  )
}

interface VendorCardProps {
  vendor: Vendor
  badgeClass: string
  editing: boolean
  onToggleEdit: () => void
  onUpdate: (patch: Partial<Vendor>) => void
  onRemove: () => void
}

function VendorCard({ vendor, badgeClass, editing, onToggleEdit, onUpdate, onRemove }: VendorCardProps) {
  return (
    <Card className="p-5">
      <div className="mb-1 flex items-start justify-between gap-2">
        <h3 className="font-medium leading-snug">{vendor.name}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs ${badgeClass}`}>
          {vendor.category}
        </span>
      </div>

      {editing ? (
        <div className="mt-3 space-y-2">
          <input
            type="date"
            value={vendor.visitDate ?? ''}
            onChange={(e) => onUpdate({ visitDate: e.target.value })}
            className="w-full rounded-lg border border-beige-200 bg-beige-50/50 px-2 py-1.5 text-xs outline-none focus:border-blush-200"
          />
          <input
            value={vendor.memo ?? ''}
            onChange={(e) => onUpdate({ memo: e.target.value })}
            placeholder="메모"
            className="w-full rounded-lg border border-beige-200 bg-beige-50/50 px-2 py-1.5 text-sm outline-none focus:border-blush-200"
          />
          <input
            value={vendor.link ?? ''}
            onChange={(e) => onUpdate({ link: e.target.value })}
            placeholder="링크"
            className="w-full rounded-lg border border-beige-200 bg-beige-50/50 px-2 py-1.5 text-xs outline-none focus:border-blush-200"
          />
        </div>
      ) : (
        <>
          {vendor.visitDate && <p className="text-xs text-muted">방문: {vendor.visitDate}</p>}
          {vendor.memo && <p className="mt-2 text-sm text-muted">{vendor.memo}</p>}
          {vendor.link && (
            <a
              href={vendor.link}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-muted underline underline-offset-2 hover:text-ink"
            >
              링크 <ExternalLink size={11} />
            </a>
          )}
        </>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-beige-100 pt-3">
        <select
          value={vendor.status}
          onChange={(e) => onUpdate({ status: e.target.value as VendorStatus })}
          aria-label="상태 변경"
          className="rounded-lg border border-beige-100 bg-beige-50/50 px-2 py-1 text-xs text-muted outline-none focus:border-blush-200"
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onToggleEdit}
            aria-label={editing ? '편집 완료' : '편집'}
            className={`rounded-full p-1.5 transition-colors ${
              editing ? 'bg-blush-100 text-blush-400' : 'text-muted hover:text-ink'
            }`}
          >
            {editing ? <CircleCheck size={15} /> : <Pencil size={14} />}
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label="삭제"
            className="rounded-full p-1.5 text-muted transition-colors hover:text-ink"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </Card>
  )
}
