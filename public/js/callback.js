//Handles spotify redirect
(async () => {

  //Parse URL to retrieve code parameter
  const code = new URLSearchParams(window.location.search).get('code');
  if (!code) {
    console.error('No code found in URL.');
    return;
  }

  const codeVerifier = localStorage.getItem('code_verifier');
  if (!codeVerifier) {
    console.error('No code verifier found in localStorage');
    return;
  }

  const body = new URLSearchParams({
    code,
    code_verifier: codeVerifier,
  }).toString();

  // Send to backend to exchange for tokens securely
  const response = await fetch('http://localhost:8000/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', 
    },
    body: body,
  });
    
  const data = await response.json();
      
    
  if (data.access_token) {  
    const expiresAt = Date.now() + data.expires_in * 1000; 
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('expires_at', expiresAt.toString()); 
    window.location.href = '/index.html';
  } else {
    console.error('Failed to get access token: ', data); 
  }

})();

//Use refresh token
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    console.error('No refresh token available.');
    return;
  }
  
  const body = new URLSearchParams({
    grant_type: 'refresh_token', 
    refresh_token: refreshToken, 
  }).toString();

  const response = await fetch('http://localhost:8000/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body, 
  });
  
  const data = await response.json();
  
  if (data.access_token) {
    const expiresAt = Date.now() + data.expires_in * 1000; 
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('expires_at', expiresAt.toString()); 
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }
  } else {
    console.error('Failed to refresh token:', data);
  }
}
  