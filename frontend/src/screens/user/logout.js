import React, { useEffect } from 'react';
import { subscribe } from 'react-contextual';
import { navigate } from 'hookrouter';

import twitch from '../../shared/libs/twitch';
import Loader from '../../shared/components/loader';

const UserLogout = props => {

  const logout = async () => {
    await props.destroySession();
    navigate('/');
  }

  useEffect(() => {
    logout();
  }, []);

  return (<Loader />);
}

export default subscribe()(UserLogout);
