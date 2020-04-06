import React from 'react';
import 'antd/dist/antd.css';
import { subscribe } from 'react-contextual';

import Content from './content';
import Navigation from './navigation';
import PlayerBar from './playerbar';
import './layout.scss';

const Layout = props => {
  return (
    <div className="root">
      <Navigation />
      <Content>
        {props.children}
      </Content>
      <div className="clear" />
      <PlayerBar />
    </div>
  );
}

export default subscribe()(Layout);
