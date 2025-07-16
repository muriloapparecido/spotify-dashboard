require('dotenv').config();

const config = {
  clientId: process.env.SPOTIFY_CLIENTID,
  redirectUri: 'http://127.0.0.1:8080/callback.html',
  scope: 'user-read-private user-read-email'
};

module.exports = config;
