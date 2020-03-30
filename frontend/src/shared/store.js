import * as actions from './actions';

export default {
  appTitle: 'Melodious',

  songInfo: {
    title: 'Girls Just Wanna',
    artist: 'Cyndi Lauper',
    cover: '//placehold.it/120x120'
  },

  player: {
    playing: false,
    currentTrack: false,
    currentTime: 0,
    volume: 100
  },

  tracks: [],

  ...actions
};
