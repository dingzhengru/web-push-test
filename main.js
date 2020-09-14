const GCM_SENDER_ID = '184131655084'; //* firebase 的 web-push-test 專案
let applicationServerPublicKey = '<Your Public Key>';
let isSubscribed = null;

getKeys(); //* 取得 & 設置公鑰

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker
    .register('sw.js')
    .then(swRegistration => {
      console.log('Service Worker is registered', swRegistration);

      initialiseUI(swRegistration);
    })
    .catch(error => {
      console.error('Service Worker Error', error);
    });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function setSubscriptionButtonIsEnabled(isEnabled = false) {
  document.querySelector('#subscription').disabled = !isEnabled;
}

function updateSubscriptionButton() {
  if (isSubscribed) {
    document.querySelector('#subscription').innerHTML = '取消訂閱';
  } else {
    document.querySelector('#subscription').innerHTML = '訂閱';
  }
}

//* 初始化
function initialiseUI(swRegistration) {
  console.log('[InitialiseUI]', swRegistration);
  const subscriptionButton = document.querySelector('#subscription');

  //* 設置訂閱按鈕事件
  subscriptionButton.addEventListener('click', () => {
    setSubscriptionButtonIsEnabled(false);
    if (isSubscribed) {
      console.log('[取消訂閱]');
      unsubscribeUser(swRegistration);
    } else {
      subscribeUser(swRegistration);
    }
  });

  //* 取得訂閱狀態
  swRegistration.pushManager.getSubscription().then(subscription => {
    isSubscribed = !!subscription;

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateSubscriptionButton();
    setSubscriptionButtonIsEnabled(true);
  });
}

//* 訂閱
function subscribeUser(swRegistration) {
  console.log('[SubscribeUser]', swRegistration);
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    })
    .then(subscription => {
      console.log('[成功訂閱]', subscription);
      isSubscribed = true;

      //* 告訴後端訂閱成功
      // updateSubscriptionOnServer(subscription);

      updateSubscriptionButton();
      setSubscriptionButtonIsEnabled(true);
    })
    .catch(err => {
      console.log('[拒絕訂閱]', err);
      updateSubscriptionButton();
      setSubscriptionButtonIsEnabled(true);
    });
}

//* 取消訂閱
function unsubscribeUser(swRegistration) {
  swRegistration.pushManager
    .getSubscription()
    .then(subscription => {
      if (subscription) {
        subscription.unsubscribe();

        //* 告訴後端訂閱已取消
        // updateSubscriptionOnServer(null);

        console.log('User is unsubscribed.');
        isSubscribed = false;

        updateSubscriptionButton();
        setSubscriptionButtonIsEnabled(true);

        return subscription;
      }
    })
    .catch(error => {
      console.log('Error unsubscribing', error);
      setSubscriptionButtonIsEnabled(true);
    });
}
