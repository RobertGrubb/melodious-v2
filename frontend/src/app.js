import React, { useEffect, useState } from 'react';
import { useRoutes } from 'hookrouter';
import { subscribe } from 'react-contextual';
import Layout from './layout';
import routes from './routes';
import deezer from './shared/libs/deezer';

const App = props => {
  const route = useRoutes(routes);
  const [loading, setLoading] = useState(false);

  const retrieveTracks = async () => {
    if (!props.trackData.fetched) {
      setLoading(true);
      const playlistData = await deezer.playlist();
      props.setTracks(playlistData.data.tracks.data);

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
