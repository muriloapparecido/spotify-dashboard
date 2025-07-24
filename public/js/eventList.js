import { renderTopTracks } from './fetchTopTracks.js';
import { renderTopArtists } from './fetchTopArtists.js';
import { createPlaylist } from './playlists.js';

document.getElementById('time-range-selector').addEventListener('change', async (e) => {
    const timeRange = e.target.value;
    sessionStorage.setItem('time_range', timeRange);
    await renderTopTracks(timeRange);
    await renderTopArtists(timeRange); 
});

document.querySelector('.signout-button').addEventListener('click', async () => {
    sessionStorage.removeItem('access_token');
  
    window.location.href = '/auth.html';
});

document.querySelector('.playlist-button').addEventListener('click', openNamePopup); 

document.querySelector('.submit-popup').addEventListener('click', submitPlaylistName); 

document.querySelector('.close-name-popup').addEventListener('click', closeNamePopup); 

document.querySelector('.close-success-popup').addEventListener('click', closeSuccessPopup); 


// Called when user clicks "Create Playlist"
function openNamePopup() {
    document.getElementById('name-popup').classList.remove('hidden');
  }
  
  // User clicks "Create" in popup
async function submitPlaylistName() {
    const name = document.getElementById('playlist-name-input').value.trim();
    const timeRange = sessionStorage.getItem('time_range') || 'short_term'; 

    // Human-readable time ranges
    const readableMap = {
        short_term: 'the last 4 weeks',
        medium_term: 'the last 6 months',
        long_term: 'all time',
    };
    const description = `Top 20 tracks of ${readableMap[timeRange] || 'last 4 weeks'}`;


    let finalName = name || 'My Top 20 Tracks';

    const playlistId = await createPlaylist(finalName, description);
    const url = `https://open.spotify.com/playlist/${playlistId}`;
    window.open(url, '_blank');  // open in new tab

    showSuccessPopup(`Playlist "${finalName}" created!`);

    closeNamePopup();
}
  
  // Close name popup
function closeNamePopup() {
    document.getElementById('playlist-name-input').value = '';
    document.getElementById('name-popup').classList.add('hidden');
}
  
  // Show success message
function showSuccessPopup(message) {
    document.getElementById('success-message').textContent = message;
    document.getElementById('success-popup').classList.remove('hidden');
}
  
  // Close success popup
function closeSuccessPopup() {
    document.getElementById('success-popup').classList.add('hidden');
}
  