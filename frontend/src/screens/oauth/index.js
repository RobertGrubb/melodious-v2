import React, { useEffect } from 'react';
import { navigate } from 'hookrouter';
import { subscribe } from 'react-contextual';

import { useQueryParameters } from '../../shared/hooks';
import twitch from '../../shared/libs/twitch';
import api from '../../shared/libs/api';
import Loader from '../../shared/components/loader';

const Oauth = props => {
  const { platform } = props;
  const params = useQueryParameters();

  const login = async () => {
    try {
      const res = await api.login(params.code);
      if (res.error) return navigate('/');

      await props.setSession(res);
      navigate('/');
    } catch (error) {
      navigate('/');
    }
  }

  useEffect(() => {
    if (platform === 'twitch' && !params.code) {
      const authLink = twitch.authLink();
      return window.location.href = authLink;
    }

    login();
  }, []);

  return (<Loader />);
}

export default subscribe()(Oauth);
