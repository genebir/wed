-- 동기화 RPC를 로그인 사용자 전용으로 잠근다.
-- (사전 조건: Authentication에 계정 2개 생성 + "Allow new users to sign up" 끄기)
-- Supabase 대시보드 → SQL Editor에 붙여넣고 Run.

revoke execute on function public.get_space_state(uuid) from public, anon;
revoke execute on function public.upsert_space_state(uuid, text, jsonb) from public, anon;

grant execute on function public.get_space_state(uuid) to authenticated, service_role;
grant execute on function public.upsert_space_state(uuid, text, jsonb) to authenticated, service_role;
