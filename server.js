import express from 'express';
import cors from 'cors';
import webpush from 'web-push';

const app = express();
const port = 3000;

app.use(cors());

//* VAPID keys should only be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

app.get('/keys', (req, res) => {
  const responseData = {
    publicKey: vapidKeys.publicKey,
    privateKey: vapidKeys.privateKey,
  };

  res.json(responseData);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
