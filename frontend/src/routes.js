import React, { useState, useEffect } from 'react';
import { subscribe } from 'react-contextual';
import { navigate } from 'hookrouter';
import Home from './screens/home';
import Browse from './screens/browse';
import Oauth from './screens/oauth';
import Playlist from './screens/playlist';
import TracksAdmin from './screens/admin/tracks';
import UserLogout from './screens/user/logout';
import Loader from './shared/components/loader';

const routes = {
  '/': () => <Home />,
  '/browse': () => <Browse />,
  '/playlist/:id': params => <AuthedRoute authLevel="user" params={params} component={Playlist} />,
  '/oauth/:platform': ({ platform }) => <Oauth platform={platform} />,
  '/admin/tracks': params => <AuthedRoute authLevel="admin" params={params} component={TracksAdmin} />,
  '/user/logout': () => <UserLogout />,
};

const AuthedRoute = subscribe()(props => {
  const levels = {
    admin: 3,
    user: 2,
    guest: 1
  };

  const { params, component } = props;

  const [ loading, setLoading ] = useState(true);
  const [ loggedIn, setLoggedIn ] = useState(false);
  const [ userLevel, setUserLevel ] = useState(false);

  let authLevel = (props.authLevel ? props.authLevel : 'guest');

  const setAuth = () => {
    if (props.session.fetched) {
      setLoading(true);
      setLoggedIn(props.session.loggedIn);
      setUserLevel(props.session.userLevel);
      setLoading(false);
    }
  }

  useEffect(() => {
    setAuth();
  }, [props.session.loggedIn, props.session.userLevel, props.session.fetched]);

  if (!loading)
    if (levels[userLevel] < levels[authLevel])
      return window.location.href = '/';
    else
      return (<props.component {...params} />);
  else
    return <Loader />;
})

export default routes;
