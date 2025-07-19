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

//Get user profile
async function getUserProfile(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  const response = await fetchWebApi( 'v1/me', 'GET' );

  return response;
}

async function main() {
    await ensureValidToken(); 

    const userProfile = await getUserProfile(); 
    const list = document.getElementById('user-profile')


    const img = document.createElement('img'); 
    img.src = userProfile.images?.[0]?.url || '../imgs/default-avatar.png'; 
    img.alt = `${userProfile.display_name}'s Profile Picture`;
    img.classList.add('profile-image')

    const name = document.createElement('section'); 
    name.classList.add('names')
    const profileName = document.createElement('h2'); 
    profileName.textContent = `${userProfile.display_name}`; 
    const profileEmail = document.createElement('p'); 
    profileEmail.textContent = `${userProfile.email}`; 
  

    list.appendChild(img);
    name.appendChild(profileName);
    name.appendChild(profileEmail); 
    list.appendChild(name); 
}
  
main();
  