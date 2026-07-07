import { useEffect, useState } from 'react'
import { Check, Cloud, CloudOff, Copy, X } from 'lucide-react'
import { getCustomSpaceId, isSyncConfigured, setSpaceId } from '../lib/sync'
import { Card } from './Card'

interface SyncSettingsProps {
  onClose: () => void
}

export function SyncSettings({ onClose }: SyncSettingsProps) {
  const [code, setCode] = useState(getCustomSpaceId() ?? '')
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const usingCustom = getCustomSpaceId() !== null

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const save = () => {
    const trimmed = code.trim()
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed)) return
    setSpaceId(trimmed)
    setSaved(true)
    setTimeout(onClose, 800)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card className="w-full max-w-md p-6">
        <div onClick={(e) => e.stopPropagation()}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              {isSyncConfigured() ? (
                <Cloud size={18} className="text-blush-400" />
              ) : (
                <CloudOff size={18} className="text-muted" />
              )}
              둘이 동기화
            </h2>
            <button type="button" onClick={onClose} aria-label="닫기" className="text-muted hover:text-ink">
              <X size={18} />
            </button>
          </div>

          {!isSyncConfigured() ? (
            <p className="text-sm leading-relaxed text-muted">
              아직 Supabase가 연결되지 않았어요. README의 <strong>둘이 동기화 켜기</strong>{' '}
              섹션을 참고하세요.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="rounded-xl bg-beige-50 p-3 text-sm leading-relaxed text-muted">
                {usingCustom ? (
                  <>
                    <strong>커스텀 코드</strong>로 연결 중 — 같은 코드를 입력한 기기끼리만
                    공유돼요.
                  </>
                ) : (
                  <>
                    <strong>기본 공유</strong>로 연결 중 — 별도 설정 없이 이 사이트를 여는
                    모든 기기와 체크·찜·예산이 공유돼요. ✓
                  </>
                )}
              </p>
              <p className="text-xs leading-relaxed text-muted">
                우리만의 비공개 공간이 필요하면 새 코드를 만들어 두 사람 기기에 같은 코드를
                입력하세요.
              </p>
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="min-w-0 flex-1 rounded-xl border border-beige-200 bg-beige-50/50 px-3 py-2 font-mono text-xs outline-none focus:border-blush-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(code).then(() => {
                      setCopied(true)
                      setTimeout(() => setCopied(false), 1500)
                    })
                  }}
                  aria-label="복사"
                  className="rounded-xl bg-beige-100 px-3 text-muted hover:text-ink"
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCode(crypto.randomUUID())}
                  className="rounded-full bg-beige-100 px-4 py-2 text-sm hover:bg-beige-200"
                >
                  새 코드 만들기
                </button>
                <button
                  type="button"
                  onClick={save}
                  className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
                >
                  {saved ? '저장됨 ✓' : '이 코드로 연결'}
                </button>
                {usingCustom && (
                  <button
                    type="button"
                    onClick={() => {
                      setSpaceId(null)
                      setCode('')
                      onClose()
                    }}
                    className="rounded-full px-4 py-2 text-sm text-muted hover:text-ink"
                  >
                    기본 공유로 돌아가기
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
