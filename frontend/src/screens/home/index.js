import React, { useState, useEffect } from 'react';
import { subscribe } from 'react-contextual';
import { Table, Button, Menu, Dropdown, message } from 'antd';
import Loader from '../../shared/components/loader';
import api from '../../shared/libs/api';
import moment from 'moment';
import './home.scss';

import {
  EllipsisOutlined
} from '@ant-design/icons';

const { SubMenu } = Menu;

const Home = props => {
  // Loading based on tracks being fetched
  const [loading, setLoading] = useState(!props.trackData.fetched);
  const [tracks, setTracks] = useState([]);

  /**
   * Checks if source matches the page currently loaded.
   * Also, if it doesn't, set the source, the track list, and the key.
   * Otherwise, just set the track key.
   */
  const setTrack = async key => {
    if (!props.trackData.source || props.trackData.source === 'playlist')  {
      const trackData = await api.tracks();
      props.updateSource('popular', trackData, key);
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
    setLoading(false);
  }

  const addTrackToPlaylist = async (trackId, playlistId) => {
    try {
      const res = await api.addTrackToPlaylist(trackId, playlistId);
      if (res.error) message.error('Error adding track to playlist.');
      return message.success('Track was added');
    } catch (error) {
      console.log(error);
      return message.error('Error adding track to playlist.');
    }
  }

  // Retrieve tracks on mount
  useEffect(() => {
    retrieveTracks();
  }, []);

  // Set loading if fetched has changed.
  useEffect(() => {
    setLoading(!props.trackData.fetched)
    props.setTitle('Popular Songs');
  }, [props.trackData.fetched])

  // If loading, return the loader component
  if (loading) return (<Loader />);

  const menu = id => (
    <Menu>
      <SubMenu title="Add to Playlist">
        {
          props.session.playlists.map((playlist, index) => {
            return (<Menu.Item onClick={() => {addTrackToPlaylist(id, playlist.id)}}>{playlist.title}</Menu.Item>);
          })
        }
      </SubMenu>
    </Menu>
  );

  // Format the dataSource array.
  const dataSource = tracks.map((track, index) => {
    let length = '00:00';

    // if it has a duration, format it.
    if (track.duration) {
      const duration = moment.duration({seconds: track.duration});
      length = duration.format('mm:ss');
    }

    // Return the data in an object that columns can easily use.
    return {
      key: index,
      id: track.id,
      title: track.title,
      artist: track.artist,
      duration: length,
      genre: track.genre
    }
  });

  /**
   * Setup the columns array for the table
   * to read.
   */
  let columns = [
    {
      title: 'Track',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Artist',
      dataIndex: 'artist',
      key: 'artist',
    },
    {
      title: 'Genre',
      dataIndex: 'genre',
      key: 'genre',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    }
  ];

  if (props.session.loggedIn) {
    columns.push({
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: id => <Dropdown trigger="click" overlay={menu.bind(this, id)}><Button shape="circle"><EllipsisOutlined /></Button></Dropdown>
    });
  }

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      onRow={(record) => ({
          onClick: () => setTrack(record.key)
      })}
    />
  );
}

export default subscribe()(Home);
