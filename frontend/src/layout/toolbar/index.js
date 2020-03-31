import React from 'react';
import { subscribe } from 'react-contextual';
import { navigate } from 'hookrouter';
import { PageHeader, Button, Avatar } from 'antd';
import './toolbar.scss';

const Toolbar = props => {
  let buttons = [
    <Button key="1" type="primary" onClick={() => navigate('/oauth/twitch')}>Login</Button>
  ];

  if (props.session.loggedIn) {
    buttons = [
      <Avatar src={props.session.userData.profile_image_url} />,
      <Button key="1" onClick={() => navigate('/user/logout')}>Logout</Button>
    ];
  }

  let title = "Popular Songs";

  if (props.trackData.fetched && props.trackData.tracks) {
    title += ` (${props.trackData.tracks.length})`;
  }

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
