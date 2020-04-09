import React from 'react';
import { subscribe } from 'react-contextual';
import { navigate } from 'hookrouter';
import { PageHeader, Button, Avatar, Menu, Dropdown } from 'antd';

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DownOutlined
} from '@ant-design/icons';

import './toolbar.scss';

const loggedInMenu = (
  <Menu>
    <Menu.Item key="0">
      <a onClick={navigate.bind(this, '/user/logout')}>Logout</a>
    </Menu.Item>
  </Menu>
);

const Toolbar = props => {
  let buttons = [
    <Button key="1" onClick={() => navigate('/oauth/twitch')}><i className="fab fa-twitch mel-icon" />&nbsp; Login with Twitch</Button>
  ];

  // If logged in, show logged in data.
  if (props.session.loggedIn) {
    buttons = (
      <Dropdown overlay={loggedInMenu} trigger={['click']}>

        <Button>
          <Avatar size={22} src={props.session.userData.profile_image_url} /> {props.session.login} <DownOutlined />
        </Button>
      </Dropdown>
    );
  }

  const { title } = props;

  return (
    <PageHeader
      ghost={false}
      title={title}
      className="toolbar__container"
      extra={buttons}
      backIcon={(props.navMinimized ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
      onBack={props.minimizeNavigation.bind(this, !props.navMinimized)}
    />
  );
}

export default subscribe()(Toolbar);
