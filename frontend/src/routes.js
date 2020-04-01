import React from 'react';
import Home from './screens/home';
import Browse from './screens/browse';
import Oauth from './screens/oauth';
import Playlist from './screens/playlist';
import UserLogout from './screens/user/logout';

const routes = {
  '/': () => <Home />,
  '/browse': () => <Browse />,
  '/playlist/:id': ({ id }) => <Playlist id={id} />,
  '/oauth/:platform': ({ platform }) => <Oauth platform={platform} />,
  '/user/logout': () => <UserLogout />,
};

export default routes;
