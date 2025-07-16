import  { refreshAccessToken } from './callback.js'; 

//Ensure access token is valid
async function ensureValidToken() {
  const token = localStorage.getItem('access_token'); 
  const expiresAt = localStorage.getItem('expires_at');

  if (!token || !expiresAt || Date.now() > parseInt(expiresAt)) {
    console.log('Access token expired or missing. Refreshing...');
    await refreshAccessToken();
  }
}

//Make Web API call
async function fetchWebApi(endpoint, method, body) {
  const accessToken = localStorage.getItem('access_token'); 
  const headers = {
      Authorization: `Bearer ${accessToken}`,
  }; 
  if (method !== 'GET'){
    headers['Content-Type'] - 'applications/json'; 
  }

  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    method, 
    headers, 
    body: method !== 'GET' && body ? JSON.stringify(body) : null, 
    }); 

  return await res.json();
}

//Get top tracks
async function getTopTracks(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  const response = await fetchWebApi(
    'v1/me/top/tracks?time_range=short_term&limit=5', 'GET'
  );

  return response?.item;
}

async function main() {
  await ensureValidToken(); 


  const topTracks = await getTopTracks();
  const list = document.getElementById('track-list');

  topTracks.forEach(({ name, artists, eternal_urls }) =>{
    const li = document.createElement('li');

    const link = document.createElement('a');
    link.href = eternal_urls.spotify;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `${name} by ${artists.map((a) => a.name).join(', ')}`;

    li.appendChild(link);
    list.appendChild(li); 
  })
}
  
main();
  