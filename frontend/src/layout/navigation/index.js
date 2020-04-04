import React, { useState } from 'react';
import { subscribe } from 'react-contextual';
import { navigate } from 'hookrouter';

import './navigation.scss';
import api from '../../shared/libs/api';
import { Menu, Modal, Input, message } from 'antd';
import {
  HomeOutlined,
  SearchOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { SubMenu } = Menu;
const { TextArea } = Input;

const Navigation = props => {
  // State vars
  const [visible, setVisible] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');

  // Navigation method
  const goTo = (url) => navigate(url);

  /**
   * Creates a new playlist via the API
   */
  const createPlaylist = async () => {

    // Validation
    if (!playlistTitle) return message.error('You must provide a title.');
    if (!playlistDescription) return message.error('You must provide a description');

    // Call the api
    const res = await api.createPlaylist(playlistTitle, playlistDescription);

    // If it did not succeed, show error
    if (!res.success) return message.error('There was an error while creating your playlist.');

    // Set playlists if it came back.
    if (res.playlists) props.setPlaylists(res.playlists);

    // Reset form and close it.
    setPlaylistTitle('');
    setPlaylistDescription('');
    setVisible(false);
  }

  return (
    <div className="navigation__container">
      <div className="logo" onClick={goTo.bind(this, '/')}>melodious</div>
      <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['playlists']}
          mode="inline"
          theme="dark"
          inlineCollapsed={false}
        >
        <Menu.Item key="1" onClick={goTo.bind(this, '/')}>
          <HomeOutlined />
          <span>Home</span>
        </Menu.Item>

        <Menu.Item key="2" onClick={goTo.bind(this, '/browse')}>
          <SearchOutlined />
          <span>Browse</span>
        </Menu.Item>

        {
          props.session.loggedIn === true && props.session.userLevel === "admin" &&
          (
            <SubMenu
              key="admin"
              title={
                <span>
                  <SettingOutlined />
                  <span>Admin</span>
                </span>
              }
            >
              <Menu.Item onClick={goTo.bind(this, '/admin/genres')} key={'admin-1'}>Genres</Menu.Item>
              <Menu.Item onClick={goTo.bind(this, '/admin/tracks')} key={'admin-1'}>Tracks</Menu.Item>
            </SubMenu>
          )
        }

        {
          props.session.loggedIn === true &&
          (
            <Menu.Item key="3" onClick={() => setVisible(true)}>
              <PlusOutlined />
              <span>Create Playlist</span>
            </Menu.Item>
          )
        }

        {
          props.session.loggedIn === true && props.session.playlists.length &&
          (
            <SubMenu
              key="playlists"
              title={
                <span>
                  <UnorderedListOutlined />
                  <span>Playlists</span>
                </span>
              }
            >
              {props.session.playlists.map((playlist, index) => <Menu.Item onClick={goTo.bind(this, `/playlist/${playlist.id}`)} key={`playlist-${index}`}>{playlist.title}</Menu.Item>)}
            </SubMenu>
          )
        }
      </Menu>

      <Modal
        title="Create Playlist"
        visible={visible}
        onOk={createPlaylist}
        onCancel={() => setVisible(false)}
      >
        <Input value={playlistTitle} onChange={e => setPlaylistTitle(e.target.value)} placeholder="Playlist Title" style={{marginBottom: 15}} />
        <TextArea value={playlistDescription} onChange={e => setPlaylistDescription(e.target.value)} rows={5} placeholder="Description of playlist" />
      </Modal>
    </div>
  );
}

export default subscribe()(Navigation);
