-- 우리 컷 업로드용 비공개 스토리지 버킷 + 정책 (로그인 사용자 전용)
-- Supabase 대시보드 → SQL Editor에서 한 번 실행.

insert into storage.buckets (id, name, public)
values ('shots', 'shots', false)
on conflict (id) do nothing;

create policy "shots auth select" on storage.objects
  for select to authenticated using (bucket_id = 'shots');

create policy "shots auth insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'shots');

create policy "shots auth delete" on storage.objects
  for delete to authenticated using (bucket_id = 'shots');
