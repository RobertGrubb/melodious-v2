# Melodious

A platform for twitch users to have easy access to no copyright music that they can play on their stream without fear of infringing copyrights.

# Installation

`ffmpeg` is required for the backend services to run correctly. Please look up how to install it based on the intended operating system.

After `ffpmeg` is successfully installed, follow the following instructions:

- Create `.env` in `backend/api` with `YOUTUBE_API_KEY=""` as an environment variable (You can retrieve a youtube key via the google developer console)
- Create `.env` in `frontend` with the following variable: `REACT_APP_API_URL="http://localhost:3007"`
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
