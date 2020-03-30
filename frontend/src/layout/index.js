import React from 'react';
import Content from './content';
import Navigation from './navigation';
import Toolbar from './toolbar';
import PlayerBar from './playerbar';
import './layout.scss';
import 'antd/dist/antd.css';

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

export default Layout;
