import React, { useState, useEffect } from 'react';
import { subscribe } from 'react-contextual';
import { Table } from 'antd';
import Loader from '../../shared/components/loader';
import moment from 'moment';
import './home.scss';

const Home = props => {
  const [loading, setLoading] = useState(!props.trackData.fetched);

  const setTrack = key => {
    props.setTrack(key);
  }

  useEffect(() => {
    setLoading(!props.trackData.fetched)
  }, [props.trackData.fetched])

  if (loading) {
    return (<Loader />);
  }

  const dataSource = props.trackData.tracks.map((track, index) => {
    let length = '00:00';

    if (track.duration) {
      const duration = moment.duration({seconds: track.duration});
      length = duration.format('mm:ss');
    }

    return {
      key: index,
      track: track.title,
      artist: track.artist.name,
      duration: length,
      cover: '//placehold.it/24x24'
    }
  });

  const columns = [
    {
      title: '',
      dataIndex: 'cover',
      key: 'cover',
      render: image => <img src={image} height={24} width={24} />
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
          onClick: () => { setTrack(record.key) }
      })}
    />
  );
}

export default subscribe()(Home);
