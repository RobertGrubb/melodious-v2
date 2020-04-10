import React, { useState } from 'react';
import { subscribe } from 'react-contextual';
import { navigate } from 'hookrouter';
import { PageHeader, Button, Avatar, Menu, Dropdown, Modal, Input, Switch } from 'antd';

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DownOutlined
} from '@ant-design/icons';

import './toolbar.scss';

const Toolbar = props => {
  const [visible, setVisible] = useState(false);
  const [theme, setTheme] = useState('dark');

  const loggedInMenu = (
    <Menu>
      <Menu.Item key="1">
        <a onClick={setVisible.bind(this, true)}>My Overlay</a>
      </Menu.Item>
      <Menu.Item key="0">
        <a onClick={navigate.bind(this, '/user/logout')}>Logout</a>
      </Menu.Item>
    </Menu>
  );

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
    <>
      <PageHeader
        ghost={false}
        title={title}
        className="toolbar__container"
        extra={buttons}
        backIcon={(props.navMinimized ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
        onBack={props.minimizeNavigation.bind(this, !props.navMinimized)}
      />
      {
        props.session.loggedIn &&
        (
          <Modal
            title="My Overlay"
            visible={visible}
            onCancel={setVisible.bind(this, false)}
            width={348}
            footer={false}
          >
            <div style={{width: '100%', height: 95, textAlign: 'center'}}>
              <iframe frameBorder={0} style={{display: 'inline-block'}} src={`${(window.location.href.includes('localhost') ? `http://localhost:3008` : `https://overlay.melodious.live`)}/?streamer=${props.session.userData.login}&theme=${(theme ? 'dark' : 'light')}`} />
            </div>
            <br />
            <div style={{width: 300, margin: '0 auto', padding: 15, background: 'rgba(0, 0, 0, 0.1)'}}>
              <Switch defaultChecked onChange={checked => setTheme(checked)} />&nbsp;&nbsp;{(theme ? 'Dark' : 'Light')} Theme
              <br /><br />
              <Input style={{textAlign: 'center'}} disabled={true} value={`${(window.location.href.includes('localhost') ? `http://localhost:3008` : `https://overlay.melodious.live`)}/?streamer=${props.session.userData.login}&theme=${(theme ? 'dark' : 'light')}`} />
              <center><small>Copy the link for browser source usage</small></center>
            </div>
          </Modal>
        )
      }
    </>
  );
}

export default subscribe()(Toolbar);
