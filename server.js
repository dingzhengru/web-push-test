import express from 'express';
import cors from 'cors';
import fs from 'fs';
import webpush from 'web-push';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

//* Database
const adapter = new FileSync('db.json');
const db = low(adapter);
// Set some defaults (required if your JSON file is empty)
db.defaults({ subscribe: [] }).write();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // for parsing application/json
app.use(cors());
app.use(express.static('./'));

//* VAPID keys should only be generated only once.
//* 產生一組後，存起來，就將此方法註解掉，或是執行 gen-vapid-keys 來產生並建立檔案
// const vapidKeys = webpush.generateVAPIDKeys();

const GCM_SENDER_ID = '184131655084';
const publicKey = fs.readFileSync('./publicKey', 'utf-8');
const privateKey = fs.readFileSync('./privateKey', 'utf-8');

const mailto = 'mailto:qws7869vdx@gmail.com';

console.log('[PublicKey]', publicKey);
console.log('[PrivateKey]', privateKey);

//* 放置 GCM KEY
webpush.setGCMAPIKey(GCM_SENDER_ID);
webpush.setVapidDetails(mailto, publicKey, privateKey);

app.get('/keys', (req, res) => {
  const responseData = { publicKey, privateKey };

  res.json(responseData);
});

app.post('/subscribe', (req, res) => {
  const subscriptionData = req.body;
  db.get('subscribe').push(subscriptionData).write();
});

app.post('/unsubscribe', (req, res) => {
  const subscriptionData = req.body;
  console.log('[Unsubscribe]', subscriptionData);
  db.get('subscribe').remove(subscriptionData).write();
});

app.post('/push/all', (req, res) => {
  //* 可以改由直接從資料庫拿訂閱資料了
  //* 可以建置兩種 API，一種是推播全部，一種根據條件推播指定訂閱資料
  //* 此 API 是從資料庫拿所有訂閱資料，傳送推播給所有訂閱者
  const message = req.body.message;
  console.log('[PushAll]', 'message:', message);

  const subscribeList = db.get('subscribe').value();

  let pushSubscription;
  subscribeList.forEach(subscribe => {
    pushSubscription = {
      endpoint: subscribe.endpoint,
      keys: {
        p256dh: subscribe.keys.p256dh,
        auth: subscribe.keys.auth,
      },
    };

    // const options = {
    //   gcmAPIKey: '< GCM API Key >',
    // vapidDetails: {
    //   subject: '< \'mailto\' Address or URL >',
    //   publicKey: '< URL Safe Base64 Encoded Public Key >',
    //   privateKey: '< URL Safe Base64 Encoded Private Key >'
    // },
    //   timeout: <Number> //* milliseconds that specifies the request's socket timeout
    //   TTL: <Number>, //* how long a push message is retained by the push service (預設是四星期).
    //   headers: { //* is an object with all the extra headers you want to add to the request.
    //     '< header name >': '< header value >'
    //   },
    //   contentEncoding: '< Encoding type, e.g.: aesgcm or aes128gcm >',
    //   proxy: '< proxy server options >',
    //   agent: '< https.Agent instance >'
    // }

    const options = {
      gcmAPIKey: GCM_SENDER_ID,
      vapidDetails: {
        subject: mailto,
        publicKey: publicKey,
        privateKey: privateKey,
      },
      headers: {
        test: 'test-value',
      },
    };

    webpush.sendNotification(pushSubscription, message, options);
  });

  res.json(true);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
