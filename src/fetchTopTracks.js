
// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = localStorage.getItem('access_token')


async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

async function getTopTracks(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  const response = await fetchWebApi(
    'v1/me/top/tracks?time_range=short_term&limit=5', 'GET'
  );

  return response?.item;
}

async function main() {
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
  