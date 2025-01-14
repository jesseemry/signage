
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
  }
     
 
 function loadContent(){
    // swapContent(['trying'])
    const url = 'https://script.google.com/macros/s/AKfycbxzViSw7NmByiSM2qfXwtn75-ucYqxTKzkMZloDAccae5TtjmiTzi3EwOdUFYNd4Am8Qw/exec';

    let params = getUrlParams();
    
    var signGroup = params['signGroup'];
    var testing = params['testing'];
   

    
    var newDelay = 5000;
    console.log('in the load content function')
    console.log('signGroup:', signGroup);
    console.log('testing:', testing);
    const dataToSend = { 
        signGroup: signGroup,
        testing: testing
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
  loadContent()

  function swapContent(content){
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
  async function noSleep(){
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

