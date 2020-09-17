import fs from 'fs';
import webpush from 'web-push';

//* VAPID keys should only be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

console.log('[PublicKey]', vapidKeys.publicKey);
console.log('[PrivateKey]', vapidKeys.privateKey);

fs.writeFile('publicKey', vapidKeys.publicKey, err => {
  if (err) throw err;
  console.log('[PublicKey] 創建檔案成功');
});

fs.writeFile('privateKey', vapidKeys.privateKey, err => {
  if (err) throw err;
  console.log('[PrivateKey] 創建檔案成功');
});
