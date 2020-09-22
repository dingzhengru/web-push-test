// const API_URL = 'http://localhost:3000';
const API_URL = window.location.origin;

async function getKeys() {
  const result = await axios.get(API_URL + '/keys');

  console.log('[Keys]', result.data);

  document.querySelector('#public-key').innerHTML = result.data.publicKey;
  document.querySelector('#private-key').innerHTML = result.data.privateKey;

  //* 看要使用這段存取，或是手動複製到 main.js
  applicationServerPublicKey = result.data.publicKey;

  return result.data;
}

async function subscribe(data) {
  console.log('[Subscribe]', data);
  const result = await axios.post(API_URL + '/subscribe', data);

  return result.data;
}

async function unsubscribe(data) {
  const result = await axios.post(API_URL + '/unsubscribe', data);

  return result.data;
}

async function pushMessageToAll(event) {
  event.preventDefault();

  const message = document.querySelector('#push-message-text').value;

  const result = await axios.post(API_URL + '/push/all', { message: message });
}
