import { DEFAULT_SPACE_ID, SUPABASE_ANON_KEY, SUPABASE_URL } from './syncConfig'

/**
 * 아주 작은 key-value 동기화 레이어.
 * - Supabase 미설정이면 아무것도 하지 않는다 (localStorage 단독 동작)
 * - 설정 + 공유 코드 입력 시: 변경은 디바운스 push, 원격 변경은 20초 폴링 + 탭 복귀 시 pull
 * - 충돌은 키 단위 last-write-wins (2인 사용 전제)
 */

const SPACE_KEY = 'sync-space-id'

export function isSyncConfigured(): boolean {
  return SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== ''
}

/** 직접 설정한 커스텀 코드 (없으면 null) */
export function getCustomSpaceId(): string | null {
  try {
    return window.localStorage.getItem(SPACE_KEY)
  } catch {
    return null
  }
}

/** 실제 사용할 공간: 커스텀 코드 > 기본 공유 공간 */
export function getSpaceId(): string | null {
  return getCustomSpaceId() ?? (DEFAULT_SPACE_ID || null)
}

export function setSpaceId(id: string | null): void {
  try {
    if (id) window.localStorage.setItem(SPACE_KEY, id)
    else window.localStorage.removeItem(SPACE_KEY)
  } catch {
    // 무시
  }
  restartPolling()
}

export function isSyncActive(): boolean {
  return isSyncConfigured() && getSpaceId() !== null
}

type Listener = (value: unknown) => void
const listeners = new Map<string, Set<Listener>>()
const pendingPush = new Set<string>()
const lastSeen = new Map<string, string>()

async function rpc(fn: string, body: object): Promise<unknown> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`sync rpc ${fn}: ${res.status}`)
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export async function pullAll(): Promise<void> {
  if (!isSyncActive()) return
  const rows = ((await rpc('get_space_state', { p_space: getSpaceId() })) ?? []) as {
    key: string
    value: unknown
  }[]
  for (const row of rows) {
    if (pendingPush.has(row.key)) continue
    const serialized = JSON.stringify(row.value)
    if (lastSeen.get(row.key) === serialized) continue
    lastSeen.set(row.key, serialized)
    listeners.get(row.key)?.forEach((l) => l(row.value))
  }
}

const pushTimers = new Map<string, number>()

export function schedulePush(key: string, value: unknown): void {
  if (!isSyncActive()) return
  pendingPush.add(key)
  window.clearTimeout(pushTimers.get(key))
  pushTimers.set(
    key,
    window.setTimeout(async () => {
      try {
        await rpc('upsert_space_state', { p_space: getSpaceId(), p_key: key, p_value: value })
        lastSeen.set(key, JSON.stringify(value))
      } catch {
        // 오프라인 등 — 다음 변경/폴링 때 자연 회복
      } finally {
        pendingPush.delete(key)
      }
    }, 600),
  )
}

export function subscribeSync(key: string, listener: Listener): () => void {
  let set = listeners.get(key)
  if (!set) {
    set = new Set()
    listeners.set(key, set)
  }
  set.add(listener)
  ensurePolling()
  return () => {
    listeners.get(key)?.delete(listener)
  }
}

let pollTimer: number | null = null

function onVisible(): void {
  if (document.visibilityState === 'visible') void pullAll()
}

function ensurePolling(): void {
  if (!isSyncActive() || pollTimer !== null) return
  void pullAll()
  pollTimer = window.setInterval(() => {
    if (document.visibilityState === 'visible') void pullAll()
  }, 20000)
  document.addEventListener('visibilitychange', onVisible)
}

function restartPolling(): void {
  if (pollTimer !== null) {
    window.clearInterval(pollTimer)
    pollTimer = null
    document.removeEventListener('visibilitychange', onVisible)
  }
  lastSeen.clear()
  if (listeners.size > 0) ensurePolling()
}
