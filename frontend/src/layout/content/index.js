import React from 'react';
import Toolbar from '../toolbar';
import './content.scss';

const Content = props => {
  return (
    <div className="content__container">
      <Toolbar />
      <div className="inner">
        {props.children}
      </div>
    </div>
  );
}

export default Content;
