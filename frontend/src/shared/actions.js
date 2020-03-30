/**
 * ==============================
 * Track Actions
 * ==============================
 */

 export const setTracks = tracks => state => {
   return { tracks };
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
  if (player.currentTrack === false) player.currentTrack = 0;
  else player.currentTrack++;
  if (player.currentTrack > player.tracks.length) player.currentTrack = 0;
  return { player };
}

export const previosTrack = () => state => {
  let player = state.player;
  if (player.currentTrack === false) player.currentTrack = 0;
  else player.currentTrack--;
  if (player.currentTrack < 0) player.currentTrack = (player.tracks.length -1);
  return { player };
}

export const play = () => state => {
  let player = state.player;
  player.playing = true;
  return { player };
}

export const pause = () => state => {
  let player = state.player;
  player.playing = false;
  return { player };
}
