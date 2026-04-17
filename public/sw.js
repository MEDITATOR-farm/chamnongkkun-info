const CACHE_NAME = 'chamnongkkun-cache-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting(); // 즉시 새 워커 활성화
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // 이전 캐시(v1) 완벽 삭제
          }
        })
      );
    }).then(() => self.clients.claim()) // 즉시 페이지 제어권 획득
  );
});

self.addEventListener('fetch', (event) => {
  // Network-First 전략: 무조건 서버에서 최신 코드 먼저 가져오고, 인터넷 끊겼을 때만 캐시 사용
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          if (event.request.url.startsWith('http')) {
             cache.put(event.request, responseClone);
          }
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
