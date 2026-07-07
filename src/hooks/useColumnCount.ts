import { useEffect, useState } from 'react'

/** 반응형 masonry 컬럼 수 (모바일 2 / 태블릿 3 / 데스크톱 4) */
export function useColumnCount(): number {
  const get = () =>
    typeof window === 'undefined'
      ? 2
      : window.innerWidth >= 1024
        ? 4
        : window.innerWidth >= 768
          ? 3
          : 2
  const [count, setCount] = useState(get)
  useEffect(() => {
    const onResize = () => setCount(get())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return count
}
