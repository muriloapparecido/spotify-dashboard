import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config(); 

const app = express(); 
const PORT = process.env.PORT || 8000;

// Enable CORS so the frontend can talk to this server
app.use(cors()); 


//Enable parsing of JSON and URL-encoded data in requests
app.use(express.json());
app.use(express.urlencoded({ extended: true})); 


// Redirect '/' to Spotify Auth Flow before serving static files
app.get('/', (req, res) => {
  const scopes = 'user-read-private user-read-email playlist-read-private';
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirect_uri)}`;

  res.redirect(authUrl);
});

// Handle static files in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Define a POST route to exchange authorization code for access + refresh tokens
app.post('/api/token', async (req, res) =>{
    const { code, code_verifier, refresh_token} = req.body; 


    let body;
    if (refresh_token) {
      //Refresh token flow
      body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
      });
    } else if (code && code_verifier) {
      //Authorization code exchange flow (PKCE)
      body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        code_verifier,
      });
    } else {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }
    try { 
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
          ).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body
      });

      const data = await response.json(); // get the access_token and refresh_token
      res.json(data); //send token data back to frontend
    } catch (error) {
      console.error('Error exchanging token:', error);
      res.status(500).json({ error: 'Token exchange failed.' });
    }
}); 

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
