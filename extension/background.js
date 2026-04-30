chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyze_url') {
    const backendUrl = 'https://phishcure-backend.onrender.com/analyze';

    fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'url',
        value: request.url
      })
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return res.json();
    })
    .then(data => {
      sendResponse({ success: true, data: data });
    })
    .catch(error => {
      console.error('PhishCure Background Error:', error);
      sendResponse({ success: false, error: error.message });
    });

    return true; // Indicates that we will send a response asynchronously
  }
});
