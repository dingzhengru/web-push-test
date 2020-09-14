import express from 'express';
import cors from 'cors';
import webpush from 'web-push';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // for parsing application/json
app.use(cors());

//* VAPID keys should only be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

//* 放置 GCM KEY
webpush.setGCMAPIKey('184131655084');
webpush.setVapidDetails('mailto:qws7869vdx@gmail.com', vapidKeys.publicKey, vapidKeys.privateKey);

app.get('/keys', (req, res) => {
  const responseData = {
    publicKey: vapidKeys.publicKey,
    privateKey: vapidKeys.privateKey,
  };

  res.json(responseData);
});

app.post('/push-message', (req, res) => {
  const subscriptionData = req.body.data;

  console.log('[push-message]');
  
  //* This is the same output of calling JSON.stringify on a PushSubscription
  const pushSubscription = {
    endpoint: subscriptionData.endpoint,
    keys: {
      p256dh: subscriptionData.keys.p256dh,
      auth: subscriptionData.keys.auth,
    },
  };

  webpush.sendNotification(pushSubscription, 'Your Push Payload Text');

  res.json(true);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
