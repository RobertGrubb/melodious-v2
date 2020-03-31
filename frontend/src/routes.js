import React from 'react';
import Home from './screens/home';
import Browse from './screens/browse';
import Test from './screens/test';

const routes = {
  '/': () => <Home />,
  '/browse': () => <Browse />,
  '/test': () => <Test />
};

export default routes;
