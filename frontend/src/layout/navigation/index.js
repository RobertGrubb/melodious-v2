import React from 'react';
import { navigate } from 'hookrouter';
import './navigation.scss';
import { Menu } from 'antd';
import {
  HomeOutlined,
  SearchOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';

const Navigation = props => {

  const goTo = (url) => navigate(url);

  return (
    <div className="navigation__container">
      <div className="logo" onClick={goTo.bind(this, '/')}>m</div>
      <Menu
          defaultSelectedKeys={['1']}
          mode="inline"
          theme="dark"
          inlineCollapsed={true}
        >
        <Menu.Item key="1" onClick={goTo.bind(this, '/')}>
          <HomeOutlined />
          <span>Home</span>
        </Menu.Item>
        <Menu.Item key="2" onClick={goTo.bind(this, '/test')}>
          <SearchOutlined />
          <span>Browse</span>
        </Menu.Item>
        <Menu.Item key="3">
          <PlayCircleOutlined />
          <span>Radio</span>
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default Navigation;
