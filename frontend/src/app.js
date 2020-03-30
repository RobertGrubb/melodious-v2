import React from 'react';
import { useRoutes } from 'hookrouter';
import Layout from './layout';
import routes from './routes';

const App = () => {
  const route = useRoutes(routes);

  return (
    <Layout>
      {route}
    </Layout>
  );
}

export default App;
