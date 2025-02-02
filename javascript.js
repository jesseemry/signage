const version = '2.0.12';
console.log('script version:', version);
console.log('Initial online status:', navigator.onLine);


function sendPostRequest(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "text/plain"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Process the received data here
      console.log('Received data:', data);
      return data;
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      return Promise.reject(error);
    });
};

function loadContent() {
  // swapContent(['trying'])
  const url = 'https://script.google.com/macros/s/AKfycbwxuMOv9IWBgkhD5TXL2UY5-1ibqJb5DBAi7KG1ZxYmjLozRxXNDRU-RR498HoxHgXIOw/exec';

  let params = getUrlParams();

  var signGroup = params['signGroup'];

  var testing = params['testing'];
  var sheetURL = params['sheetURL'];
  var hours = params['hours'];
  var minutes = params['minutes']
  var newDelay = 5000;
  console.log('in the load content function')
  console.log('signGroup:', signGroup);
  console.log('testing:', testing);
  console.log('sheetURL:', sheetURL);
  console.log('hours: ',hours);

  if (hours != null){
    schedulePageReload(hours, minutes);
  } else {
    schedulePageReload(6,30);
  }

  const dataToSend = {
    signGroup: signGroup,
    testing: testing,
    sheetURL: sheetURL
  };

  sendPostRequest(url, dataToSend)
    .then(responseData => {
      // Do something with the received data
      console.log('Successfully sent POST request and received data:', responseData);
      newDelay = responseData.nextRefresh;
      swapContent(responseData);
      setTimeout(() => {
        // google.script.run.withSuccessHandler(loadDelay).fetchRefresh()
        loadContent();
      }, newDelay);
    })
    .catch(error => {
      console.error('Error sending POST request:', error);
      console.log(responseData);
    });

};


function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};

  for (const [key, value] of urlParams) {
    params[key] = value;
  }

  return params;

}
noSleep()


self.addEventListener('offline', () => {
  console.log('offline')
});

self.addEventListener('online', () => {
  console.log('online')
  loadContent()
  // clients.matchAll().then(clients => {
  //     clients.forEach(client => {
  //         client.postMessage('refresh');
  //     });
  // });
});

navigator.serviceWorker.addEventListener('message', event => {
  console.log('Received a message from the service worker:', event.data);
  if (event.data === 'refresh') {
    location.reload();
  }
});

loadContent()

function swapContent(content) {
  console.log('Received content:', content);
  var message = content.overlayMessage
  var newFrame = content.content
  var newRefresh = content.nextRefresh
  console.warn(newRefresh)
  try {
    document.getElementById('over').innerHTML = message;
    document.getElementById('content-frame').innerHTML = newFrame
    console.log('Content updated successfully.');
  } catch (error) {
    console.log('Error updating content: ' + error);
    // Handle the error, e.g., display an error message to the user
  }
}
async function noSleep() {
  try {
    const wakeLock = await navigator.wakeLock.request('screen');
    // 'screen' is the currently supported type
    console.log('Wake Lock is active');
    // Handle the wake lock release (e.g., when the user leaves the page)
    wakeLock.onrelease = () => {
      console.log('Wake lock released');
    };

    // Optionally, release the wake lock manually
    // await wakeLock.release(); 

  } catch (err) {
    console.error(`Wake Lock request failed: ${err.name}, ${err.message}`);
  }
}

function schedulePageReload(hours, minutes){
  const reloadScheduledKey = 'reloadScheduled';

  //check to see if it's already scheduled
  if (localStorage.getItem(reloadScheduledKey)) {
    console.log('Reload already scheduled.');
    return;
  }

  const now = new Date();
  let targetTime = new Date();
  targetTime.setHours(hours);
  targetTime.setMinutes(minutes);
  targetTime.setSeconds(0);
  console.log('setting reload for: ',targetTime);
  // set time forward if it's already passed
  if (now > targetTime){
    targetTime.setDate(targetTime.getDate() + 1);
    console.log('moving reload forward a day');
  }
  const delay = targetTime - now;
  //schedule the reload

  setTimeout(() => {
    window.location.reload(true);
    localStorage.removeItem(reloadScheduledKey);
  }, delay);

  localStorage.setItem(reloadScheduledKey, 'true');

}
