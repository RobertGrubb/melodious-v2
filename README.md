# Melodious

A platform for twitch users to have easy access to no copyright music that they can play on their stream without fear of infringing copyrights.

[View the Demo](https://melodious.live)

# Todo Items

- [X] Twitch Authentication
- [X] Login / Logout
- [X] Playlist logic
- [X] Ability to link directly to playlist.
- [X] Create TrackTable component for less redundancy.
- [ ] Ability to remove playlists
- [ ] Shuffle ability

# Known Bugs

- None at the moment, please create an issue if you find one.

# Installation

1. Create `.env` in `backend/api` with the following:

*NOTE* Admin accounts should be based on the login username for Twitch. When you login via twitch, if it matches the login, it will give you admin privelages.

```
SERVER_PORT=3007
ADMIN_ACCOUNTS="twitchUsername1,twitchUsername2"
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

- `cp backend/api/melodious.json.example melodious.json`
- `cd backend/api && yarn`
- `cd backend/api && yarn start`
- `cd frontend && yarn`
- `cd frontend && yarn start`

# Database

For the ease of spinning up a development API service, the API is using `lowdb`, a flat file json database api.

# Note about watch

Make sure when you are running the server, if you are running it with anything that watches files, ignore `melodious.json`. If you do not, the server will constantly loop because of changes to the file.

# How to add tracks to your playlist:

There are a few ways to add tracks to your melodious application. Look below for more information.

## Melodious Admin

To access Melodious Admin from within the melodious application, you must first add your Twitch username to the `ADMIN_ACCOUNTS=""` environment variable in `/backend/api/.env` (Refer to installation above.)

Once you have done this, run the frontend application, login with your Twitch account, then navigate to "Admin -> Tracks". From there, you can add tracks via a YouTube Video, or upload your own MP3.

## YT Video Command Line

Run `backend/api/video-to-track.js --videoId="<VIDEO_ID>"` to convert a YouTube video to an MP3 track, and add it to your lowdb melodious database.

## YT Audio Library

Run `backend/api/download.js --limit=25 --genre="Dance Electronic"` to download songs from the YouTube Audio Library. Both `limit` and `genre` are optional arguments.

NOTE: `COOKIES` in `backend/api/.env` is required for this script to run. (It will throw an error if it's not present.)

NOTE 2: Make sure to shut down your server during the running of the above script. If you do not, anything that happens during this time on the frontend (ex. new user login) will override during the download script being ran.
