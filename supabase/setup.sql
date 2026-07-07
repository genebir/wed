-- 쩜오의 결혼이야기 — 둘이 동기화용 테이블 + RPC
-- Supabase 대시보드 → SQL Editor에 붙여넣고 Run 한 번이면 끝.
--
-- 보안 모델: 테이블 직접 접근은 전부 차단(RLS, 정책 없음)하고
-- 공유 코드(space UUID)를 아는 쪽만 RPC로 읽고 쓸 수 있다.
-- UUID는 추측 불가능하므로 사실상 비밀번호 역할.

create table if not exists public.kv_state (
  space uuid not null,
  key text not null,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (space, key)
);

alter table public.kv_state enable row level security;
-- 정책을 만들지 않음 = anon의 직접 select/insert/update 전부 거부

create or replace function public.get_space_state(p_space uuid)
returns table(key text, value jsonb, updated_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select key, value, updated_at from kv_state where space = p_space;
$$;

create or replace function public.upsert_space_state(p_space uuid, p_key text, p_value jsonb)
returns void
language sql
security definer
set search_path = public
as $$
  insert into kv_state (space, key, value, updated_at)
  values (p_space, p_key, p_value, now())
  on conflict (space, key)
  do update set value = excluded.value, updated_at = now();
$$;

grant execute on function public.get_space_state(uuid) to anon;
grant execute on function public.upsert_space_state(uuid, text, jsonb) to anon;
