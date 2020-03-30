import React from 'react';
import Home from './screens/home';
import Test from './screens/test';

const routes = {
  '/': () => <Home />,
  '/test': () => <Test />
};

export default routes;
