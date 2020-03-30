import React from 'react';
import './navigation.scss';
import { Menu, Button } from 'antd';
import {
  HomeOutlined,
  SearchOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';

const Navigation = props => {
  return (
    <div className="navigation__container">
      <div className="logo" />
      <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
        >
        <Menu.Item key="1">
          <HomeOutlined />
          <span>Home</span>
        </Menu.Item>
        <Menu.Item key="2">
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
