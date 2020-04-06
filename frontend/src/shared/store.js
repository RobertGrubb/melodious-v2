import * as actions from './actions';

export default {
  title: 'Melodious',

  session: {
    loggedIn: false,
    userLevel: 'guest',
    fetched: false
  },

  player: {
    source: 'popular',
    playlistKey: false,
    currentTrack: false,
    volume: 0.75,
  },

  trackData: {
    source: false, // false || popular || playlist
    fetched: false,
    tracks: false
  },

  ...actions
};
