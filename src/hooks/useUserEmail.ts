import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/** 현재 로그인한 계정 이메일 (게이트 뒤에서는 항상 존재) */
export function useUserEmail(): string | null {
  const [email, setEmail] = useState<string | null>(null)
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null))
  }, [])
  return email
}
