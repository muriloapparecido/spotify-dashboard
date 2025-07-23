import { renderTopTracks } from './fetchTopTracks.js';
import { renderTopArtists } from './fetchTopArtists.js';
import { createPlaylist } from './playlists.js';

document.getElementById('time-range-selector').addEventListener('change', async (e) => {
    const timeRange = e.target.value;
    await renderTopTracks(timeRange);
    await renderTopArtists(timeRange); 
});

document.querySelector('.signout-button').addEventListener('click', async () => {
    sessionStorage.removeItem('access_token');
  
    window.location.href = '/auth.html';
});

document.querySelector('.playlist-button').addEventListener('click', async () => {
    createPlaylist(); 
});
