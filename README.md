# web-push-test <!-- omit in toc -->

- [推播流程](#推播流程)
  - [條件](#條件)
  - [訂閱](#訂閱)
  - [推播](#推播)
- [Library](#library)
  - [web-push](#web-push)

測試 web push

運行前端 index.html，我是直接用 vscode 的 Live Server

```bash
# 運行後端
npm start- [web-push](#web-push)
```

## 推播流程

### 條件

- 需註冊 Service Worker
- 瀏覽器必須支援此功能

### 訂閱

- 先產出一組 VAPID keys，此專案是用 web-push 套件來產出，只需產出一次即可，要是換了，等同於捨棄至今所有訂閱
- 此密鑰組包含一組公鑰、私鑰，將此公私鑰存起來，公鑰要給前端使用
- 檢查訂閱狀態 => 點下訂閱按鈕 => 訂閱 || 取消訂閱 => 傳給後端紀錄 || 刪除訂閱資料(包含 endpoint、p256dh、auth，推播需要用到)

### 推播

- 想使用推播功能，必須要有 Google Cloud Messaging (GCM) Sender ID，最快的取得方法是於 Firebase 創一個新專案
- 前端，於 Service Worker 檔案中設置推播的事件處理，包含 push(接收推播)、notificationclick(點下推播視窗)
- 後端，此專案是用 web-push 套件來完成推播，設置 GCM Sender ID => 取得訂閱資訊(資料庫) => 推播訊息給指定訂閱者(訂閱資訊)

## Library

### web-push
