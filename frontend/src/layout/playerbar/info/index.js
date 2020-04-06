import React from 'react';
import { subscribe } from 'react-contextual';

import './info.scss';

const Info = props => {

  let title = "";
  let artist = "";

  if (props.player.currentTrack !== false) {
    title = props.trackData.tracks[props.player.currentTrack].title;
    artist = props.trackData.tracks[props.player.currentTrack].artist;
  }

  if (title.length >= 25) {
    title = title.substring(0, 25) + '...';
    artist = artist.substring(0, 25) + '...';
  }

  return (
    <>
      {
        props.player.currentTrack !== false &&
        (
          <div className="info__container">
            <div className="cover" />
            <div className="label">
              <div className="title">{title}</div>
              <div className="artist">{artist}</div>
            </div>
          </div>
        )
      }
    </>
  );
}

export default subscribe()(Info);
