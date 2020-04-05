import * as actions from './actions';

export default {
  title: 'Melodious',

  session: {
    loggedIn: false,
    userLevel: 'guest',
    fetched: false
  },

  player: {
    playlistKey: false,
    state: 'stopped',
    currentTrack: false,
    currentTime: 0,
    volume: 0.75,
    audio: new Audio()
  },

  trackData: {
    source: false, // false || popular || playlist
    fetched: false,
    tracks: false
  },

  ...actions
};
