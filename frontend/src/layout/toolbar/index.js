import React from 'react';
import { subscribe } from 'react-contextual';
import { navigate } from 'hookrouter';
import { PageHeader, Button, Avatar } from 'antd';
import './toolbar.scss';

const Toolbar = props => {
  let buttons = [
    <Button key="1" className="test" onClick={() => navigate('/oauth/twitch')}><i className="fab fa-twitch mel-icon" />&nbsp; Login with Twitch</Button>
  ];

  // If logged in, show logged in data.
  if (props.session.loggedIn) {
    buttons = [
      <Avatar src={props.session.userData.profile_image_url} />,
      <Button key="1" onClick={() => navigate('/user/logout')}>Logout</Button>
    ];
  }

  const { title } = props;

  return (
    <PageHeader
      ghost={false}
      title={title}
      className="toolbar__container"
      extra={buttons}
    />
  );
}

export default subscribe()(Toolbar);
