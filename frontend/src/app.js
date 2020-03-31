import React, { useEffect, useState } from 'react';
import { useRoutes } from 'hookrouter';
import { subscribe } from 'react-contextual';
import cookies from 'react-cookies';

import Layout from './layout';
import routes from './routes';
import api from './shared/libs/api';

const App = props => {

  // Pull in the routes
  const route = useRoutes(routes);

  /**
   * Checks if an existing session is set.
   */
  const checkSession = async () => {
    if (cookies.load('userId')) {
      try {
        const res = await api.session();
        props.setSession(res);
      } catch (error) {
        console.log(error);
      }
    }
  }

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
    checkSession();
  }, []);

  // Render the layout with the given route.
  return (<Layout>{route}</Layout>);
}

export default subscribe()(App);
