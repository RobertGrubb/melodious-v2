import * as actions from './actions';

export default {
  title: 'Melodious',
  navMinimized: false,

  session: {
    loggedIn: false,
    userLevel: 'guest',
    fetched: false,
    playlists: []
  },

  player: {
    source: 'popular',
    playlistKey: false,
    currentTrack: false,
    audioPlaying: false,
    volume: 0.75,
  },

  trackData: {
    source: false, // false || popular || playlist
    fetched: false,
    tracks: false
  },

  ...actions
};
