import React from 'react';
import { subscribe } from 'react-contextual';
import './info.scss';

const Info = props => {
  return (
    <div className="info__container">
      <img src="Artist Cover" className="cover" src={props.songInfo.cover} />
      <div className="label">
        <div className="title">{props.songInfo.title}</div>
        <div className="artist">{props.songInfo.artist}</div>
      </div>
    </div>
  );
}

export default subscribe()(Info);
