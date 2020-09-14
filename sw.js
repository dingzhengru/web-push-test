self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push Message: "${event.data.text()}"`);

  const title = 'Push Codelab';
  const options = {
    body: `測試訊息: ${event.data.text()}`,
    icon: 'icon.png',
    badge: 'images/badge.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 通知點擊
self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(clients.openWindow('http://localhost:5500/'));
});
