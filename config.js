require('dotenv').config();

const config = {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET, 
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
};

module.exports = config;
