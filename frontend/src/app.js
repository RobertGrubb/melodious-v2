import React, { useEffect, useState } from 'react';
import { useRoutes } from 'hookrouter';
import { subscribe } from 'react-contextual';

import Layout from './layout';
import routes from './routes';
import api from './shared/libs/api';

const App = props => {

  // Pull in the routes
  const route = useRoutes(routes);

  /**
   * Retrieves tracks from the api and sets
   * them in the app state.
   */
  const retrieveTracks = async () => {
    if (!props.trackData.fetched) {
      const trackData = await api.tracks();
      props.setTracks(trackData);
    }
  }

  /**
   * Only run once and do not look for
   * any changes.
   */
  useEffect(() => {
    retrieveTracks();
  }, []);

  // Render the layout with the given route.
  return (<Layout>{route}</Layout>);
}

export default subscribe()(App);
