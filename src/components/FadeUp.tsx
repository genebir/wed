import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

interface FadeUpProps {
  children: ReactNode
  className?: string
  /** 지연(ms) — 카드 목록에 순차 등장 효과 줄 때 */
  delay?: number
}

/** 스크롤 진입 시 부드럽게 떠오르는 래퍼 */
export function FadeUp({ children, className = '', delay = 0 }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${visible ? 'animate-fade-up' : 'opacity-0'} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
