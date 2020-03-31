import React from 'react';
import Home from './screens/home';
import Browse from './screens/browse';
import Test from './screens/test';
import Oauth from './screens/oauth';
import UserLogout from './screens/user/logout';

const routes = {
  '/': () => <Home />,
  '/browse': () => <Browse />,
  '/test': () => <Test />,
  '/oauth/:platform': ({platform}) => <Oauth platform={platform} />,
  '/user/logout': () => <UserLogout />,
};

export default routes;
