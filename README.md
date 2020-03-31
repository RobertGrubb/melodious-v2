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
REACT_APP_API_URL="http://localhost:3007"
REACT_APP_TWITCH_CLIENT_ID=""
REACT_APP_TWITCH_REDIRECT_URL=""
```

2. Create `.env` in `frontend` with the following:

```
YOUTUBE_API_KEY=""
TWITCH_CLIENT_ID=""
TWITCH_CLIENT_SECRET=""
TWITCH_REDIRECT_URL="http://localhost:3000/oauth/twitch"
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

Connect to your api with the following route:

`http://localhost:3007/track/add/:youtubeVideoId`

This will add the track to the db.json file, when you pull `/tracks` next, it will be fetched.
