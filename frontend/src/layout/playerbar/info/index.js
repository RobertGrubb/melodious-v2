import React from 'react';
import './info.scss';

const Info = props => {
  return (
    <div className="info__container">
      <img className="cover" src="//placehold.it/120x120" />
      <div className="label">
        <div className="title">Something Here</div>
        <div className="artist">Artist Name</div>
      </div>
    </div>
  );
}

export default Info;
