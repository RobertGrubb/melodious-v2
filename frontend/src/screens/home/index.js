import React, { useState, useEffect } from 'react';
import { subscribe } from 'react-contextual';
import { Table, Button, Menu, Dropdown, message } from 'antd';
import moment from 'moment';

import {
  EllipsisOutlined
} from '@ant-design/icons';

import Loader from '../../shared/components/loader';
import TrackTable from '../../shared/components/track-table';
import api from '../../shared/libs/api';
import './home.scss';

const { SubMenu } = Menu;

const Home = props => {
  // Loading based on tracks being fetched
  const [loading, setLoading] = useState(!props.trackData.fetched);
  const [tracks, setTracks] = useState([]);

  // Set the source
  const source = 'popular';

  /**
   * Checks if source matches the page currently loaded.
   * Also, if it doesn't, set the source, the track list, and the key.
   * Otherwise, just set the track key.
   */
  const setTrack = async key => {
    if (props.player.source !== source)  {
      const trackData = await api.tracks();
      props.updateSource(source, trackData, key);
    } else {
      props.setTrack(key);
    }
  };

  /**
   * Retrieves tracks from the api and sets
   * them in the app state.
   */
  const retrieveTracks = async () => {
    const trackData = await api.tracks();
    setTracks(trackData);
    props.setTracks(trackData);
    setLoading(false);
  }

  // Retrieve tracks on mount
  useEffect(() => {
    retrieveTracks();
  }, []);

  // Set loading if fetched has changed.
  useEffect(() => {
    setLoading(!props.trackData.fetched)
    props.setTitle('All Songs');
  }, [props.trackData.fetched])

  // Render the track table
  return (<TrackTable
            source={source}
            tracks={tracks}
            loading={loading}
            onSetTrack={setTrack.bind(this)}
            options={true}
          />);
}

export default subscribe()(Home);
