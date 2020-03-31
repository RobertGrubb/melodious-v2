import React, { useEffect, useState } from 'react';
import { useRoutes } from 'hookrouter';
import { subscribe } from 'react-contextual';
import Layout from './layout';
import routes from './routes';
import api from './shared/libs/api';

const App = props => {
  const route = useRoutes(routes);

  const retrieveTracks = async () => {
    if (!props.trackData.fetched) {
      const trackData = await api.tracks();
      props.setTracks(trackData);
    }
  }

  useEffect(() => {
    retrieveTracks();
  }, []);

  return (
    <Layout>
      {route}
    </Layout>
  );
}

export default subscribe()(App);
