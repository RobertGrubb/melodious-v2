import * as actions from './actions';

export default {
  appTitle: 'Melodious',

  songInfo: {
    title: 'Girls Just Wanna',
    artist: 'Cyndi Lauper',
    cover: '//placehold.it/120x120'
  },

  player: {
    state: 'stopped',
    currentTrack: false,
    currentTime: 0,
    volume: 100,
    audio: null
  },

  trackData: {
    fetched: false,
    tracks: []
  },

  ...actions
};
