//Handles spotify redirect
import { clientId, redirectUri } from './config.js'; 

(async () => {

    //Parse URL to retrieve code parameter
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
        console.error('No code found in URL.');
        return;
    }

    const codeVerifier = localStorage.getItem('code_verifier');
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
      });
    
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
      });
    
      const data = await response.json();
      console.log('Access token:', data.access_token);
      console.log('Refresh token:', data.refresh_token);
    
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);

      window.location.href = '/index.html';
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
      client_id: clientId
    });
  
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });
  
    const data = await response.json();
  
    if (data.access_token) {
      console.log('🔄 Refreshed access token:', data.access_token);
      localStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
    } else {
      console.error('Failed to refresh token:', data);
    }
  }
  