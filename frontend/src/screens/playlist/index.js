import React, { useEffect, useState } from 'react';
import { subscribe } from 'react-contextual';
import api from '../../shared/libs/api';
import Loader from '../../shared/components/loader';
import moment from 'moment';
import { Table, message } from 'antd';

const Playlist = props => {
  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] = useState(false);

  /**
   * Retrieves the playlist data on mount.
   */
  const retrievePlaylist = async () => {
    try {
      const res = await api.playlist(props.id);

      // response returned an error, show something.
      if (res.error) {
        message.error('Error loading specified playlist.');
        return setLoading(false);
      }

      // Set the playlist to the local component state.
      setPlaylist(res.playlist);
      setLoading(false);
    } catch (error) {

      // Something threw an exception.
      message.error('Error loading specified playlist.');
      return setLoading(false);
    }
  }

  /**
   * Checks if source matches the page currently loaded.
   * Also, if it doesn't, set the source, the track list, and the key.
   * Otherwise, just set the track key.
   */
  const setTrack = async key => {
    if (!props.trackData.source || props.trackData.source === 'popular')
      props.updateSource('playlist', playlist.tracks, key);
    else
      props.setTrack(key);
  };

  // Retrieve playlist on mount
  useEffect(() => {
    retrievePlaylist();
  }, [props.id]);

  // Update the page title on mount after playlist
  // is set.
  useEffect(() => {
    if (playlist) props.setTitle(playlist.title);
  }, [playlist])

  // Return loader if loading.
  if (loading) return (<Loader />);

  // Format the dataSource array.
  const dataSource = playlist.tracks.map((track, index) => {
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
      genre: track.genre,
      duration: length
    }
  });

  /**
   * Setup the columns array for the table
   * to read.
   */
  const columns = [
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

export default subscribe()(Playlist);
