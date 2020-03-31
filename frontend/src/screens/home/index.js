import React, { useState, useEffect } from 'react';
import { subscribe } from 'react-contextual';
import { Table } from 'antd';
import Loader from '../../shared/components/loader';
import moment from 'moment';
import './home.scss';

const Home = props => {
  // Loading based on tracks being fetched
  const [loading, setLoading] = useState(!props.trackData.fetched);

  // Sets a track based on key
  const setTrack = key => props.setTrack(key);

  // Set loading if fetched has changed.
  useEffect(() => {
    setLoading(!props.trackData.fetched)
  }, [props.trackData.fetched])

  // If loading, return the loader component
  if (loading) return (<Loader />);

  // Format the dataSource array.
  const dataSource = props.trackData.tracks.map((track, index) => {
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
      track: track.title,
      artist: track.artist,
      duration: length,
      cover: track.cover.url
    }
  });

  const columns = [
    {
      title: '',
      dataIndex: 'cover',
      key: 'cover',
      render: image => <img alt="cover" src={image} height={24} width="auto" />
    },
    {
      title: 'Track',
      dataIndex: 'track',
      key: 'track',
    },
    {
      title: 'Artist',
      dataIndex: 'artist',
      key: 'artist',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
  ];

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
