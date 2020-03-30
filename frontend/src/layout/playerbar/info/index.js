import React from 'react';
import { subscribe } from 'react-contextual';
import './info.scss';

const Info = props => {
  return (
    <>
      {
        props.player.currentTrack !== false &&
        (
          <div className="info__container">
            <img src="Artist Cover" className="cover" src={props.trackData.tracks[props.player.currentTrack].album.cover} />
            <div className="label">
              <div className="title">{props.trackData.tracks[props.player.currentTrack].title}</div>
              <div className="artist">{props.trackData.tracks[props.player.currentTrack].artist.name}</div>
            </div>
          </div>
        )
      }
    </>
  );
}

export default subscribe()(Info);
