import { ensureValidToken, currentTopTracks, fetchWebApi } from './fetchTopTracks.js';


function removeDuplicates(arr) {
    const seen = {};
    const result = [];

    for (let i = 0; i < arr.length; i++) {
        if (!seen[arr[i]]) {
            seen[arr[i]] = true;
            result.push(arr[i]);
        }
    }

    return result;
}


async function getTopGenre(){
    await ensureValidToken(); 

    let artistIds = []; 

    currentTopTracks.forEach(({artists}) => {
        artists.forEach(artist => {
            artistIds.push(artist.id);
        });
    })


    // Remove duplicate artist IDs
    const uniqueArtistIds = removeDuplicates(artistIds);


    let genres = []; 

    // Get all genres from each unique artist
    for (let id of uniqueArtistIds) {
        const artistInfo = await fetchWebApi(`v1/artists/${id}`, 'GET');
        genres.push(...artistInfo.genres);
    }

    //Count genre occurences
    const genreCount = {};
    genres.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
    });

    // Find the most common genre
    let topGenre = null;
    let maxCount = 0;
    for (const genre in genreCount) {
        if (genreCount[genre] > maxCount) {
            maxCount = genreCount[genre];
            topGenre = genre;
        }
    }

    return topGenre.charAt(0).toUpperCase() + topGenre.slice(1); //Capitalize
}

export async function renderTopGenre(){
    const tag = document.getElementById('display-genre'); 
    tag.textContent = 'Loading top genre...';

    const displayedGenre = await getTopGenre(); 
    tag.textContent = `Your Top Genre: ${displayedGenre}`
}