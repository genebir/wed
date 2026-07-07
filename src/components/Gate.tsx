import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'

/**
 * 이름 입력 게이트 — 허용된 두 사람만 입장.
 * 실명은 리포에 커밋하지 않는다는 규칙에 따라 SHA-256 해시로만 비교한다.
 * (클라이언트 사이드 잠금이므로 강한 보안이 아니라 가벼운 출입문 용도)
 */
const ALLOWED_HASHES = [
  'f511363bb5139298deeef797190e98b60406537166f12ad5524be33c37620800',
  '20548f2280420a155d429bcaff468babbaecbe752ba15adbfff0c53033a37d79',
]

const SESSION_KEY = 'visitor-name'

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text.normalize('NFC'))
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function savedName(): string | null {
  try {
    return window.sessionStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

export function Gate({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(() => savedName() !== null)
  const [name, setName] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  if (entered) return <>{children}</>

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.replace(/\s/g, '')
    if (!trimmed || checking) return
    setChecking(true)
    try {
      const hash = await sha256Hex(trimmed)
      if (ALLOWED_HASHES.includes(hash)) {
        try {
          window.sessionStorage.setItem(SESSION_KEY, trimmed)
        } catch {
          // 저장 실패해도 이번 세션은 입장
        }
        setEntered(true)
      } else {
        setError(true)
        setName('')
      }
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-beige-50 px-5">
      <div className="w-full max-w-sm text-center">
        <p className="text-5xl">💍</p>
        <h1 className="mt-6 font-serif text-2xl font-semibold tracking-tight">
          쩜오의 결혼이야기
        </h1>
        <p className="mt-3 text-sm text-muted">우리 둘만의 공간이에요. 이름을 알려주세요.</p>
        <form onSubmit={submit} className="mt-8 space-y-3">
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError(false)
            }}
            placeholder="이름"
            autoFocus
            className={`w-full rounded-2xl border bg-white px-4 py-3 text-center text-lg outline-none transition-colors ${
              error ? 'border-blush-400' : 'border-beige-200 focus:border-blush-200'
            }`}
          />
          {error && <p className="text-sm text-blush-400">앗, 등록되지 않은 이름이에요.</p>}
          <button
            type="submit"
            disabled={!name.trim() || checking}
            className="w-full rounded-2xl bg-ink py-3 text-lg font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-40"
          >
            입장하기
          </button>
        </form>
      </div>
    </div>
  )
}
