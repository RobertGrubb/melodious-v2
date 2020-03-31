import React, { useEffect } from 'react';
import { subscribe } from 'react-contextual';
import twitch from '../../shared/libs/twitch';

const Test = props => {

  useEffect(() => {
    console.log(twitch.authLink());
  }, []);

  return (
    <span>Browse</span>
  );
}

export default subscribe()(Test);
