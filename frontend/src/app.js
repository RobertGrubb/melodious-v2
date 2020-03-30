import React, { useEffect } from 'react';
import { useRoutes } from 'hookrouter';
import Layout from './layout';
import routes from './routes';

import deezer from './shared/libs/deezer';

const App = () => {
  const route = useRoutes(routes);

  const test = async () => {
    await deezer.playlist();
  }

  useEffect(() => {
    test();
  }, []);

  return (
    <Layout>
      {route}
    </Layout>
  );
}

export default App;
