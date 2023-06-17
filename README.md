# web-push-test <!-- omit in toc -->

- [推播流程](#推播流程)
  - [條件](#條件)
  - [VAPID Keys](#vapid-keys)
  - [訂閱](#訂閱)
  - [推播](#推播)
    - [GCM為非必要才對](#gcm為非必要才對)
- [注意事項](#注意事項)
  - [urlBase64ToUint8Array](#urlbase64touint8array)
- [Library](#library)
  - [web-push-libs](#web-push-libs)
  - [lowdb](#lowdb)

測試 web push，demo: https://web-push-te.herokuapp.com

```bash
npm start(#web-push)
```

## 推播流程

### 條件

- 需註冊 Service Worker
- 瀏覽器必須支援此功能

### VAPID Keys

- 訂閱需要一組 vapid keys ，此專案是用 web-push-libs 套件來產出，只需產出一次即可，要是換了，等同於捨棄至今所有訂閱
- 此密鑰組包含一組公鑰、私鑰，將此公私鑰存起來，公鑰要給前端使用

創建方法用此套件的話，可以於後端 `webpush.generateVAPIDKeys()` 來產生
或是直接 `npm install -g web-push` 再 `web-push generate-vapid-keys` 即可

### 訂閱

- 檢查訂閱狀態 => 點下訂閱按鈕 => 訂閱 || 取消訂閱 => 傳給後端紀錄 || 刪除訂閱資料(包含 endpoint、p256dh、auth，推播需要用到)

### 推播

#### GCM為非必要才對

- ~~想使用推播功能，必須要有 Google Cloud Messaging (GCM) Sender ID，最快的取得方法是於 Firebase 創一個新專案~~
- 前端，於 Service Worker 檔案中設置推播的事件處理，包含 push(接收推播)、notificationclick(點下推播視窗)
- 後端，此專案是用 web-push 套件來完成推播，設置 GCM Sender ID (非必要) => 取得訂閱資訊(資料庫) => 推播訊息給指定訂閱者(訂閱資訊)

## 注意事項

### urlBase64ToUint8Array

- 方法來源(web-push-libs): https://github.com/web-push-libs/web-push#using-vapid-key-for-applicationserverkey

前端使用訂閱方法的時候，需要轉換公鑰(URL safe base64 string to a Uint8Array)

```js
function subscribeUser(swRegistration) {
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(applicationServerPublicKey),
  });
  // ...
}
```

## Library

### web-push-libs

### lowdb

資料庫，json database 存在 db.json 檔案中
