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

//Get top artists
async function getTopArtists(time_range = 'short_term'){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  const response = await fetchWebApi(
    `v1/me/top/artists?time_range=${time_range}&limit=20`, 'GET'
  );

  return response?.items;
}

export async function renderTopArtists(time_range = 'short_term') {
    await ensureValidToken(); 


  const topArtists = await getTopArtists(time_range);
  const list = document.getElementById('artist-list');
  list.innerHTML = ''; //clear previous artists if any

  topArtists.forEach(({ name, images, external_urls}, index) =>{
    const li = document.createElement('li');
    li.classList.add('display-artists');

    //create image element
    const img = document.createElement('img'); 
    img.src = images[1]?.url || images[0]?.url; 
    img.alt = `${name} profile`; 
    img.classList.add('artist-image')

    
    //create text link element
    const link = document.createElement('a');
    link.href = external_urls.spotify;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = name;
    link.classList.add('artist-link')

    // create rank number
    const rank = document.createElement('span');
    rank.textContent = `${index + 1}. `;
    rank.classList.add('artist-rank');

    //combine image and link into list item
    li.appendChild(img); 
    li.appendChild(link);
    li.appendChild(rank);
    list.appendChild(li); 
  })
}

async function main() {
  renderTopArtists(); 
}
  
main();
  