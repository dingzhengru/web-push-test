import fs from 'fs';
import webpush from 'web-push';

//* 也可以直接利用，以下指令來產生，在手動創檔案存取即可
// npm install -g web-push
// web-push generate-vapid-keys

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
