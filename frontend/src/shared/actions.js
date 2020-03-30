/**
 * ==============================
 * Track Actions
 * ==============================
 */

export const setTrack = key => state => {
  return {
    player: {
      ...state.player,
      currentTrack: key,
      playing: true
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

export const updateVolume = percent => state => {
  let player = state.player;
  player.volume = percent;
  return { player };
}

export const updateTime = seconds => state => {
  let player = state.player;
  player.currentTime = seconds;
  return { player };
}

export const nextTrack = () => state => {
  let player = state.player;
  let currentTrack = player.currentTrack;

  if (currentTrack === false) currentTrack = 0;
  else currentTrack++;
  if (currentTrack > (state.trackData.tracks.length - 1)) currentTrack = 0;

  return {
    player: {
      ...state.player,
      playing: true,
      currentTrack: currentTrack
    }
  };
}

export const previousTrack = () => state => {
  let player = state.player;
  let currentTrack = player.currentTrack;

  if (currentTrack === false) currentTrack = 0;
  else currentTrack--;
  if (currentTrack < 0) currentTrack = (state.trackData.tracks.length -1);

  return {
    player: {
      ...state.player,
      playing: true,
      currentTrack: currentTrack
    }
  };
}

export const play = () => state => {
  let currentTrack = state.player.currentTrack;

  if (currentTrack === false) currentTrack = 0;

  return {
    player: {
      ...state.player,
      playing: true,
      currentTrack: currentTrack
    }
  };
}

export const pause = () => state => {
  return {
    player: {
      ...state.player,
      playing: false
    }
  };
}
