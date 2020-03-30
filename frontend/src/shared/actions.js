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
      audio: new Audio(`${state.trackData.tracks[key].lqMediaUrl}`)
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
      audio: new Audio(`${state.trackData.tracks[currentTrack].lqMediaUrl}`)
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
      audio: new Audio(`${state.trackData.tracks[currentTrack].lqMediaUrl}`)
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
