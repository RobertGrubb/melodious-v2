import React from 'react';
import Home from './screens/home';
import Test from './screens/browse';

const routes = {
  '/': () => <Home />,
  '/browse': () => <Test />
};

export default routes;
