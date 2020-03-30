import React, { useState, useEffect } from 'react';
import { subscribe } from 'react-contextual';
import { Table } from 'antd';
import Loader from '../../shared/components/loader';
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

  const dataSource = props.trackData.tracks.map((trackData, index) => {
    return {
      key: index,
      track: trackData.title,
      artist: trackData.artist.name,
      album: trackData.album.title,
      cover: trackData.album.cover
    }
  })

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
      title: 'Album',
      dataIndex: 'album',
      key: 'album',
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
