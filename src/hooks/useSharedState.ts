import { useCallback, useEffect, useState } from 'react'
import { schedulePush, subscribeSync } from '../lib/sync'

/**
 * useLocalStorage와 같은 API에 동기화가 얹힌 훅.
 * Supabase 미설정 시엔 localStorage 단독으로 동작한다.
 * 둘이 공유해야 하는 상태(체크/찜/예산 등)는 반드시 이 훅을 쓴다.
 */
export function useSharedState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw !== null ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(
    () =>
      subscribeSync(key, (remote) => {
        setValue(remote as T)
        try {
          window.localStorage.setItem(key, JSON.stringify(remote))
        } catch {
          // 무시
        }
      }),
    [key],
  )

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved))
        } catch {
          // 무시
        }
        schedulePush(key, resolved)
        return resolved
      })
    },
    [key],
  )

  return [value, set] as const
}
