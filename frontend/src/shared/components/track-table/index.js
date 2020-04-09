import React, { useState, useEffect } from 'react';
import { subscribe } from 'react-contextual';
import { Table, Button, Menu, Dropdown, Popover, message } from 'antd';
import moment from 'moment';
import * as linkify from 'linkifyjs';
import linkifyHtml from 'linkifyjs/html';

import {
  EllipsisOutlined
} from '@ant-design/icons';

import Loader from '../loader';
import api from '../../libs/api';

const { SubMenu } = Menu;

const TrackTable = props => {
  // Get variables from props
  const { tracks, loading } = props;

  /**
   * Add a specific track to a playlist.
   */
  const addTrackToPlaylist = async (trackId, playlistId) => {
    try {
      const res = await api.addTrackToPlaylist(trackId, playlistId);
      if (res.error) message.error('Error adding track to playlist.');
      return message.success('Track was added');
    } catch (error) {
      return message.error('Error adding track to playlist.');
    }
  }

  const creditContent = credits => {
    let formattedCredits = credits.replace(/(?:\r\n|\r|\n)/g, "<br />");
    formattedCredits = linkifyHtml(formattedCredits, { target: "_blank" });
    return (<span dangerouslySetInnerHTML={{__html: formattedCredits}} />);
  }

  // On track select handler
  const onSetTrack = key => props.onSetTrack(key);

  // If loading, return the loader component
  if (loading || !tracks) return (<Loader />);

  // Menu for playlists
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
      genre: track.genre,
      credits: (track.credits ? track.credits : 'Unknown')
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
      key: 'artist'
    },
    {
      title: 'Genre',
      dataIndex: 'genre',
      key: 'genre',
      className: 'no-show-mobile'
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      render: credits => (
        <Popover
          content={creditContent(credits)}
          title="Credits"
        >
          <Button>Credits</Button>
        </Popover>
      )
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      className: 'no-show-mobile'
    }
  ];

  // If they are logged in, and options are set to render
  if (props.session.loggedIn && props.options === true) {
    columns.push({
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: id => <Dropdown trigger="click" overlay={menu.bind(this, id)}><Button shape="circle"><EllipsisOutlined /></Button></Dropdown>,
      className: 'no-show-mobile'
    });
  }

  // Render the table
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      onRow={(record) => ({
          onClick: () => onSetTrack(record.key)
      })}
      pagination={false}
    />
  );
}

export default subscribe()(TrackTable);
