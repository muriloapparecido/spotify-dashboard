import { renderTopTracks } from './fetchTopTracks.js';
import { renderTopArtists } from './fetchTopArtists.js';

document.getElementById('time-range-selector').addEventListener('change', async (e) => {
    const timeRange = e.target.value;
    await renderTopTracks(timeRange);
    await renderTopArtists(timeRange); 
    });