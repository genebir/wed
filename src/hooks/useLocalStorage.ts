import { useEffect, useState } from 'react'

// Phase 2에서 Supabase로 옮길 수 있도록 상태 접근은 반드시 이 훅을 경유한다.
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw !== null ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // 저장 실패(사파리 프라이빗 모드 등)는 무시 — 메모리 상태로만 동작
    }
  }, [key, value])

  return [value, setValue] as const
}
