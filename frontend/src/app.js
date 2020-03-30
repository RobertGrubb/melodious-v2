import React, { useEffect, useState } from 'react';
import { useRoutes } from 'hookrouter';
import { subscribe } from 'react-contextual';
import Layout from './layout';
import routes from './routes';
import api from './shared/libs/api';

const App = props => {
  const route = useRoutes(routes);
  const [loading, setLoading] = useState(false);

  const retrieveTracks = async () => {
    if (!props.trackData.fetched) {
      setLoading(true);
      const trackData = await api.tracks();
      props.setTracks(trackData);
      setLoading(false);
    }
  }

  const playerLoaded = () => {

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
