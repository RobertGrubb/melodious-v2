import React from 'react';
import { subscribe } from 'react-contextual';
import './home.scss';

const Home = props => {
  return (
    <span>Home</span>
  );
}

export default subscribe()(Home);
