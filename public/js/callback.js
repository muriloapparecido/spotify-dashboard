function showErrorPopup() {
  const message = document.createElement('div');
  message.innerHTML = `
    <div class="error-popup">
      <p>Something went wrong while authorizing with Spotify.<br>Please go back and try again.</p>
      <button id="retry">Return to Login</button>
    </div>
  `;
  document.body.appendChild(message);

  document.getElementById('retry').onclick = () => {
    window.location.href = '/auth.html';
  };
}


//Handles spotify redirect
(async () => {

  //Parse URL to retrieve code parameter
  const code = new URLSearchParams(window.location.search).get('code');
  if (!code) {
    console.error('No code found in URL.');
    return;
  }

  const codeVerifier = sessionStorage.getItem('code_verifier');
  if (!codeVerifier) {
    console.error('No code verifier found in sessionStorage');
    return;
  }

  const body = new URLSearchParams({
    code,
    code_verifier: codeVerifier,
  }).toString();

  // Send to backend to exchange for tokens securely
  const response = await fetch('https://spotify-dashboard-xrkr.onrender.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', 
    },
    body: body,
  });
    
  const data = await response.json();
      
    
  setTimeout(()=> {  
    if (data.access_token) {  
      const expiresAt = Date.now() + data.expires_in * 1000; 
      sessionStorage.setItem('access_token', data.access_token);
      sessionStorage.setItem('refresh_token', data.refresh_token);
      sessionStorage.setItem('expires_at', expiresAt.toString()); 
      window.location.href = '/index.html';
    } else {
      console.error('Failed to get access token: ', data); 
      showErrorPopup(); 
    }
  }, 1500); 

})();

//Use refresh token
export async function refreshAccessToken() {
  const refreshToken = sessionStorage.getItem('refresh_token');
  if (!refreshToken) {
    console.error('No refresh token available.');
    return;
  }
  
  const body = new URLSearchParams({
    grant_type: 'refresh_token', 
    refresh_token: refreshToken, 
  }).toString();

  const response = await fetch('https://spotify-dashboard-xrkr.onrender.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body, 
  });
  
  const data = await response.json();
  
  if (data.access_token) {
    const expiresAt = Date.now() + data.expires_in * 1000; 
    sessionStorage.setItem('access_token', data.access_token);
    sessionStorage.setItem('expires_at', expiresAt.toString()); 
    if (data.refresh_token) {
      sessionStorage.setItem('refresh_token', data.refresh_token);
    }
  } else {
    console.error('Failed to refresh token:', data);
  }
}
  