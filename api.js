const API_URL = 'http://localhost:3000';

async function getKeys() {
  const result = await axios.get(API_URL + '/keys');

  console.log('[Keys]', result.data);

  document.querySelector('#public-key').innerHTML = result.data.publicKey;
  document.querySelector('#private-key').innerHTML = result.data.privateKey;

  //* 看要使用這段存取，或是手動複製到 main.js
  applicationServerPublicKey = result.data.publicKey;

  return result.data;
}

async function pushMessage() {
  console.log('[Push]', subscriptionData);
  const result = await axios.post(API_URL + '/push-message', { data: subscriptionData });

  console.log('[Push]', result.data);

  return result.data;
}
