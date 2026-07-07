import { createClient } from '@supabase/supabase-js'
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './syncConfig'

/**
 * 세션은 sessionStorage에 저장 — 브라우저/앱을 닫으면 로그아웃되어
 * "접속할 때마다 로그인" 동작이 유지된다.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: window.sessionStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
})
