import React from 'react';
import ScrollArea from 'react-scrollbar';

import Toolbar from '../toolbar';
import './content.scss';

const Content = props => {
  return (
    <div className="content__container">
      <Toolbar />
      <ScrollArea
        speed={0.8}
        className="inner"
        contentClassName="area"
        horizontal={false}
      >
        {props.children}
      </ScrollArea>
    </div>
  );
}

export default Content;
