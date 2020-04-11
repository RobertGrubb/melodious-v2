import cookies from 'react-cookies';

export const setTitle = title => state => {
  return { title };
}

export const minimizeNavigation = navMinimized => state => {
  return { navMinimized };
}

/**
 * ==============================
 * Session Actions
 * ==============================
 */

 export const setPlaylists = playlists => state => {
   return {
     session: {
       ...state.session,
       playlists
     }
   }
 }

export const setSession = userData => state => {
  cookies.save('userId', userData.id, { path: '/' })

  return {
    session: {
      ...userData,
      loggedIn: true,
      fetched: true
    }
  }
}

export const setSessionFetched = () => state => {
  return {
    session: {
      ...state.session,
      fetched: true
    }
  }
}

export const destroySession = () => state => {
  cookies.remove('userId', { path: '/' })

  return {
    session: { loggedIn: false }
  }
}

/**
 * ==============================
 * Track Actions
 * ==============================
 */

export const setTrack = key => state => {
  if (state.player.audio) state.player.audio.pause();
  if (!state.trackData.tracks[key]) return state;

  return {
    player: {
      ...state.player,
      currentTrack: key
    }
  }
}

 export const setTracks = tracks => state => {
   let newTracks = {
     ...state.trackData,
     fetched: true,
     tracks: tracks
   };

   return { trackData: newTracks };
 }

/**
 * ==============================
 * Player Actions
 * ==============================
 */

export const updateSource = (source, tracks, key) => state => {
  if (state.player.audio) state.player.audio.pause();

  let trackData = state.trackData;
  trackData.source = source;
  trackData.tracks = tracks;

  return {
    player: {
      ...state.player,
      currentTrack: key,
      source: source
    },
    trackData
  }
}

export const nextTrack = shuffle => state => {
  let player = state.player;
  if (player.audio) player.audio.pause();
  let currentTrack = player.currentTrack;

  if (shuffle === true) {
    currentTrack = Math.floor(Math.random() * state.trackData.tracks.length);
  } else {
    if (currentTrack === false) currentTrack = 0;
    else currentTrack++;
    if (currentTrack > (state.trackData.tracks.length - 1)) currentTrack = 0;
  }

  return {
    player: {
      ...state.player,
      currentTrack: currentTrack,
      audioPlaying: true
    }
  };
}

export const previousTrack = () => state => {
  let player = state.player;
  let currentTrack = player.currentTrack;
  if (player.audio) player.audio.pause();
  if (currentTrack === false) currentTrack = 0;
  else currentTrack--;
  if (currentTrack < 0) currentTrack = (state.trackData.tracks.length -1);

  return {
    player: {
      ...state.player,
      currentTrack: currentTrack,
      audioPlaying: true
    }
  };
}

export const setAudioPlaying = playing => state => {
  return {
    player: {
      ...state.player,
      audioPlaying: playing
    }
  };
}

export const play = () => state => {
  let currentTrack = state.player.currentTrack;
  if (currentTrack === false) currentTrack = 0;

  return {
    player: {
      ...state.player,
      currentTrack: currentTrack
    }
  };
}

export const setVolume = volume => state => {
  return {
    player: {
      ...state.player,
      volume
    }
  };
}
