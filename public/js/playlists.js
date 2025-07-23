import  { refreshAccessToken } from './callback.js'; 
import { getUserProfile } from './fetchUserProfile.js';

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
    headers['Content-Type'] = 'application/json'; 
  }

  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    method, 
    headers, 
    body: method !== 'GET' && body ? JSON.stringify(body) : null, 
    }); 

  return await res.json();
}

// Create a new playlist
export async function createPlaylist(name = 'My Top 20 Tracks', description = 'Top 20 tracks over the last ') {
    await ensureValidToken();
    const user = await getUserProfile();
    const userId = user.id;
  
    const playlistData = {
      name: name,
      description: description,
      public: false,
    };
  
    const response = await fetchWebApi(`v1/users/${userId}/playlists`, 'POST', playlistData);
    return response;
}

async function main() {

}

main(); 