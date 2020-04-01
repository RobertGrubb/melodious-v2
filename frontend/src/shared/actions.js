import cookies from 'react-cookies';

export const setTitle = title => state => {
  return { title };
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
      loggedIn: true
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

  return {
    player: {
      ...state.player,
      currentTrack: key,
      currentTime: 0,
      state: 'play',
      audio: new Audio(`${process.env.REACT_APP_API_URL}/stream/${state.trackData.tracks[key].id}`)
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

export const updateTime = seconds => state => {
  let player = state.player;
  player.currentTime = seconds;
  return { player };
}

export const updateSource = (source, tracks, key) => state => {
  if (state.player.audio) state.player.audio.pause();

  let trackData = state.trackData;
  trackData.source = source;
  trackData.tracks = tracks;

  return {
    player: {
      ...state.player,
      currentTrack: key,
      currentTime: 0,
      state: 'play',
      audio: new Audio(`${process.env.REACT_APP_API_URL}/stream/${state.trackData.tracks[key].id}`)
    },
    trackData
  }
}

export const nextTrack = () => state => {
  let player = state.player;
  if (player.audio) player.audio.pause();
  let currentTrack = player.currentTrack;
  if (currentTrack === false) currentTrack = 0;
  else currentTrack++;
  if (currentTrack > (state.trackData.tracks.length - 1)) currentTrack = 0;

  return {
    player: {
      ...state.player,
      state: 'play',
      currentTrack: currentTrack,
      currentTime: 0,
      audio: new Audio(`${process.env.REACT_APP_API_URL}/stream/${state.trackData.tracks[currentTrack].id}`)
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
      state: 'play',
      currentTrack: currentTrack,
      currentTime: 0,
      audio: new Audio(`${process.env.REACT_APP_API_URL}/stream/${state.trackData.tracks[currentTrack].id}`)
    }
  };
}

export const play = () => state => {
  let currentTrack = state.player.currentTrack;
  if (currentTrack === false) currentTrack = 0;

  return {
    player: {
      ...state.player,
      state: 'play',
      currentTrack: currentTrack
    }
  };
}

export const pause = () => state => {
  return {
    player: {
      ...state.player,
      state: 'pause'
    }
  };
}
