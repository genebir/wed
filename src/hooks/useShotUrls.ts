import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const BUCKET = 'shots'
const SIGNED_URL_TTL = 60 * 60 * 24 * 7 // 7일

/** 비공개 버킷 경로들 → 서명 URL 맵 (로그인 세션 필요) */
export function useShotUrls(paths: string[]): Record<string, string> {
  const [urls, setUrls] = useState<Record<string, string>>({})
  const key = paths.join('|')

  useEffect(() => {
    const missing = paths.filter((p) => !(p in urls))
    if (missing.length === 0) return
    supabase.storage
      .from(BUCKET)
      .createSignedUrls(missing, SIGNED_URL_TTL)
      .then(({ data }) => {
        if (!data) return
        setUrls((prev) => {
          const next = { ...prev }
          data.forEach((d) => {
            if (d.path && d.signedUrl) next[d.path] = d.signedUrl
          })
          return next
        })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return urls
}
