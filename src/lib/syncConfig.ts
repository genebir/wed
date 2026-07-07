/**
 * 둘이 동기화 설정 — Supabase 프로젝트를 만들고 아래 두 값을 채우면 활성화된다.
 * (supabase/setup.sql을 SQL Editor에서 실행해야 함 — README '둘이 동기화' 섹션 참고)
 *
 * anon key는 공개되어도 되는 키라 리포에 커밋해도 된다.
 * 실제 데이터 접근은 '공유 코드'(UUID)를 아는 사람만 가능.
 */
export const SUPABASE_URL: string = 'https://dbccgazqwwopevddhvhp.supabase.co'
export const SUPABASE_ANON_KEY: string = 'sb_publishable_YTFahn2pxxzQTuVD6rywuw_GvAI4zZb'

/**
 * 기본 공유 공간 — 코드 입력 없이 사이트를 여는 모두가 자동으로 여기 연결된다.
 * (공개 사이트 전제. 사적인 공간이 필요하면 설정에서 커스텀 코드로 전환)
 */
export const DEFAULT_SPACE_ID: string = '0c792276-1e13-42b0-86e7-3c8e549277b2'
