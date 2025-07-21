import  { refreshAccessToken } from './callback.js'; 

//Ensure access token is valid
async function ensureValidToken() {
  const token = sessionStorage.getItem('access_token'); 
  const expiresAt = sessionStorage.getItem('expires_at');

  if (!token || !expiresAt || Date.now() > parseInt(expiresAt)) {
    console.log('Access token expired or missing. Refreshing...');
    await refreshAccessToken();
  }
}

//Make Web API call
async function fetchWebApi(endpoint, method, body) {
  const accessToken = sessionStorage.getItem('access_token'); 
  const headers = {
      Authorization: `Bearer ${accessToken}`,
  }; 
  if (method !== 'GET'){
    headers['Content-Type'] = 'applications/json'; 
  }

  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    method, 
    headers, 
    body: method !== 'GET' && body ? JSON.stringify(body) : null, 
    }); 

  return await res.json();
}

//Get top tracks
async function getTopTracks(time_range = 'short_term'){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  const response = await fetchWebApi(
    `v1/me/top/tracks?time_range=${time_range}&limit=20`, 'GET'
  );

  return response?.items;
}

export async function renderTopTracks(time_range = 'short_term'){
  await ensureValidToken(); 


  const topTracks = await getTopTracks(time_range);
  const list = document.getElementById('track-list');
  list.innerHTML = ''; //clear previous tracks if any

  topTracks.forEach(({ name, artists, external_urls, album}) =>{
    const li = document.createElement('li');
    li.classList.add('display-songs')

    //create image element
    const img = document.createElement('img'); 
    img.src = album.images[1]?.url || album.images[0]?.url; 
    img.alt = `${name} album cover`; 
    img.classList.add('album-cover')

    
    //create text link element
    const link = document.createElement('a');
    link.href = external_urls.spotify;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `${name} by ${artists.map((a) => a.name).join(', ')}`;
    link.classList.add('song-link')

    //combine image and link into list item
    li.appendChild(img); 
    li.appendChild(link);
    list.appendChild(li); 
  })
}

async function main() {
  renderTopTracks(); 
}
  
main();
  