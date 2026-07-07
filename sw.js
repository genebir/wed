// 최소 서비스 워커: 같은 오리진 GET은 network-first, 오프라인일 때만 캐시 폴백.
// (배포 직후 이전 버전이 보이는 문제를 피하려고 캐시 우선을 쓰지 않는다)
const CACHE = 'wed-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(req, copy))
        }
        return res
      })
      .catch(() => caches.match(req).then((hit) => hit ?? Response.error())),
  )
})
