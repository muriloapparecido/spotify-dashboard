# 🎵 Spotify Dashboard

A sleek and interactive web app that visualizes your Spotify listening data, including your top tracks, artists, and personalized recommendations.

🌐 **Live Site**: [spotify-dashboard-xrkr.onrender.com](https://spotify-dashboard-xrkr.onrender.com)

---

## 🚀 Features

- 🔐 Spotify OAuth login with PKCE flow
- 📊 Displays top tracks and top artists
- 📈 Dynamic charts using Chart.js
- 🧠 Personalized data pulled from Spotify Web API
- 🎧 Playlist creation directly from dashboard

---

## 🛠️ Technologies Used

- **Frontend**: HTML, CSS, JavaScript (ES6)
- **Backend**: Node.js, Express.js
- **APIs**: Spotify Web API
- **Charting**: Chart.js
- **Deployment**: Render (server) and GitHub (repo)
- **Auth Flow**: OAuth 2.0 with PKCE

---

## 📚 What I Learned

- How to implement Spotify OAuth 2.0 authentication with the PKCE extension.
- How to build a secure full-stack app that interacts with third-party APIs.
- How to visualize data using Chart.js and create responsive layouts with Flexbox.
- How to deploy full-stack apps on Render and work around free tier limitations (cold starts, routing).
- How to debug and style frontend components using DevTools and session storage.

---

## 📁 Folder Structure
public/
├── auth.html # Login page
├── callback.html #Loading page
├── dashboard.html #Main dashboard
├── css
│   │   ├── auth.css #Auth screen styling
│   │   ├── callback.css #Loading screen styling
│   │   └── styles.css #Main dashboard styling
│   ├── imgs
│   │   └── default-avatar.png #Profile image for when user's image isn't fetched
│   └── js
│       ├── auth.js  # Handles login flow and token exchange
│       ├── callback.js # Processes the redirect from Spotify after login.
│       ├── config.js # Stores reusable config values like Spotify client ID and redirect URI.
│       ├── fetchTopArtists.js # Fetches and formats the user's top Spotify artists from the Web API.
│       ├── fetchTopTracks.js # Fetches and formats the user's top Spotify songs from the Web API.
│       ├── fetchUserProfile.js #  Retrieves the logged-in user's profile information (name, email, profile image).
│       ├── main.js # Coordinates data fetching, chart rendering, and UI behavior once user is authenticated.
│       ├── playlists.js # Handles playlist creation and modification via the Spotify API.
│       ├── topGenre.js # Analyzes the user's top artists to infer their top music genres.
│       └── trackChart.js # Uses Chart.js to render a bar or line chart of the user’s top tracks.
└── server.js # Express server

---

## 🔑 How to Use

1. Visit the [live site](https://spotify-dashboard-xrkr.onrender.com)
2. Click the **Login with Spotify** button.
3. Grant the app access to your listening data.
4. Explore your top tracks, artists, and visual trends!

---

## 🙌 Acknowledgements

- [Spotify Web API Docs](https://developer.spotify.com/documentation/web-api/)
- [Chart.js](https://www.chartjs.org/)
- [Render](https://render.com/)

---

