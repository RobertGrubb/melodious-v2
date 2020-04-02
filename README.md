# Melodious

A platform for twitch users to have easy access to no copyright music that they can play on their stream without fear of infringing copyrights.

# Todo Items

- [X] Twitch Authentication
- [X] Login / Logout
- [ ] Browse Screen
- [ ] Playlist logic

# Installation

`ffmpeg` is required for the backend services to run correctly. Please look up how to install it based on the intended operating system.

After `ffpmeg` is successfully installed, follow the following instructions:

1. Create `.env` in `backend/api` with the following:

```
YOUTUBE_API_KEY=""
TWITCH_CLIENT_ID=""
TWITCH_CLIENT_SECRET=""
TWITCH_REDIRECT_URL="http://localhost:3000/oauth/twitch"
YOUTUBE_AUDIO_LIBRARY_COOKIES=""
```

NOTE: `COOKIES` is the cookies from Youtube Audio Library. Use your browser's inspector to retrieve this. It is used to make requests to the JSON data for tracks.

2. Create `.env` in `frontend` with the following:

```
REACT_APP_API_URL="http://localhost:3007"
REACT_APP_TWITCH_CLIENT_ID=""
REACT_APP_TWITCH_REDIRECT_URL=""
```

3. Run the following commands from the root directory:

- `cp backend/api/db.json.example db.json`
- `cd backend/api && yarn`
- `cd backend/api && yarn start`
- `cd frontend && yarn`
- `cd frontend && yarn start`

# Database

For the ease of spinning up a development API service, the API is using `lowdb`, a flat file json database api.

# How to add tracks to your playlist:

Run `backend/api/download.js --limit=25 --genre="Dance Electronic"` to download songs from the YouTube Audio Library. Both `limit` and `genre` are optional arguments.

NOTE: `COOKIES` in `backend/api/.env` is required for this script to run. (It will throw an error if it's not present.)
