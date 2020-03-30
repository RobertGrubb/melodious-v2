import React from 'react';
import { useRoutes } from 'hookrouter';
import Layout from './layout';
import routes from './routes';

const App = () => {
  const routeResult = useRoutes(routes);

  return (
    <Layout>
      {routeResult}
    </Layout>
  );
}

export default App;
