import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import cors from 'cors';

dotenv.config(); 

const app = express(); 
const PORT = 8000;

// Enable CORS so the frontend can talk to this server
app.use(cors()); 

app.use(express.static('public'));
console.log('Redirect URI used:', process.env.SPOTIFY_REDIRECT_URI);


//Enable parsing of JSON and URL-encoded data in requests
app.use(express.json());
app.use(express.urlencoded({ extended: true})); 

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
  

    const data = await response.json();  // get the access_token and refresh_token
    res.json(data); //send token data back to frontend
}); 

//start the server on 127.0.0.1:8000
app.listen(PORT,'127.0.0.1', () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
  });