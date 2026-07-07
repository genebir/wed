import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { supabase } from '../lib/supabase'

/**
 * 로그인 게이트 — Supabase Auth 계정(2인)만 입장.
 * 세션이 sessionStorage에 있어 브라우저/앱을 닫으면 다시 로그인해야 한다.
 * 데이터 접근(RPC)도 서버에서 authenticated 전용으로 강제된다.
 */
const EMAIL_KEY = 'gate-email'

function savedEmail(): string {
  try {
    return window.localStorage.getItem(EMAIL_KEY) ?? ''
  } catch {
    return ''
  }
}

export function Gate({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState<boolean | null>(null) // null = 세션 확인 중
  const [email, setEmail] = useState(savedEmail)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEntered(data.session !== null))
  }, [])

  if (entered) return <>{children}</>

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (checking || !email.trim() || !password) return
    setChecking(true)
    setError(false)
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setChecking(false)
    if (err) {
      setError(true)
      setPassword('')
      return
    }
    try {
      window.localStorage.setItem(EMAIL_KEY, email.trim())
    } catch {
      // 무시
    }
    setEntered(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-beige-50 px-5">
      {entered === null ? (
        <p className="text-muted">···</p>
      ) : (
        <div className="w-full max-w-sm text-center">
          <p className="text-5xl">💍</p>
          <h1 className="mt-6 font-serif text-2xl font-semibold tracking-tight">
            쩜오의 결혼이야기
          </h1>
          <p className="mt-3 text-sm text-muted">우리 둘만의 공간이에요. 로그인해 주세요.</p>
          <form onSubmit={submit} className="mt-8 space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(false)
              }}
              placeholder="이메일"
              autoComplete="username"
              className="w-full rounded-2xl border border-beige-200 bg-white px-4 py-3 text-center text-lg outline-none transition-colors focus:border-blush-200"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              placeholder="비밀번호"
              autoComplete="current-password"
              autoFocus={email !== ''}
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-center text-lg outline-none transition-colors ${
                error ? 'border-blush-400' : 'border-beige-200 focus:border-blush-200'
              }`}
            />
            {error && (
              <p className="text-sm text-blush-400">이메일 또는 비밀번호가 맞지 않아요.</p>
            )}
            <button
              type="submit"
              disabled={!email.trim() || !password || checking}
              className="w-full rounded-2xl bg-ink py-3 text-lg font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-40"
            >
              {checking ? '확인 중…' : '입장하기'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
