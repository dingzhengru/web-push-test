self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.', event.data);
  console.log('[Service Worker] Push Received.', '[event.data.blob()]', event.data.blob());
  // console.log('[Service Worker] Push Received.', '[event.data.json()]', event.data.json());
  console.log('[Service Worker] Push Received.', '[event.data.text()]', event.data.text());

  //* 在 sw.js 中，使用 self 取代 window
  // const hostname = self.location.hostname;

  const title = 'Push Test';
  const options = {
    body: `測試訊息: ${event.data.text()}`,
    icon: 'icon.png',
    badge: 'images/badge.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 通知點擊
self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click Received.', event);

  event.notification.close();

  const origin = self.location.origin;

  event.waitUntil(clients.openWindow(origin));
});
