# Melodious

A platform for twitch users to have easy access to no copyright music that they can play on their stream without fear of infringing copyrights.

[View the Demo](https://melodious.live)

# Disclaimer

This project is actively being updated, and in no way tested for production release. Please keep this in mind as updates are always being pushed, and we do not endorse this application as "production ready" at all. We try our best to keep a list of actively known bugs below. If you find one, please create an issue.

# Recent Big Win

You can now control next, play/pause, and previous actions via your keyboard, or bluetooth.

# Todo Items

- [X] Ability to edit playlist
- [X] Ability to upload custom tracks to your playlist
- [X] Ability to remove playlists
- [ ] Login page update (Accept more social networks, etc)

# Known Bugs

- None yet, please report them by opening an issue.

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

4. Running the overlay service (Optional)

- `cd overlay && yarn`
- `yarn start`
- `Access it via: http://localhost:3008/?streamer=username`

# Database

For the ease of spinning up a development API service, the API is using `lowdb`, a flat file json database api.

# Overlay

The overlay portion of melodious is for streamers. They would use the given url to add a browser source to their stream so they can properly give artists of the songs playing credit. This is to avoid any issues with copyrights.

# Note about watch

Make sure when you are running the server, if you are running it with anything that watches files, ignore `melodious.json`. If you do not, the server will constantly loop because of changes to the file.

# How to add tracks to your playlist:

There are a few ways to add tracks to your melodious application. Look below for more information.

## Melodious Admin

To access Melodious Admin from within the melodious application, you must first add your Twitch username to the `ADMIN_ACCOUNTS=""` environment variable in `/backend/api/.env` (Refer to installation above.)

Once you have done this, run the frontend application, login with your Twitch account, then navigate to "Admin -> Tracks". From there, you can add tracks.
