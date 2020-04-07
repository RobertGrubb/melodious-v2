import React, { useState } from 'react';
import { subscribe } from 'react-contextual';
import { navigate } from 'hookrouter';

import { Menu, Modal, Input, message } from 'antd';
import {
  HomeOutlined,
  SearchOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  SettingOutlined
} from '@ant-design/icons';

import './navigation.scss';
import api from '../../shared/libs/api';

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
      <div className="logo" onClick={goTo.bind(this, '/')}>m</div>
      <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={[]}
          mode="inline"
          theme="dark"
          inlineCollapsed={true}
        >
        <Menu.Item key="1" onClick={goTo.bind(this, '/')}>
          <HomeOutlined />
          <span>Home</span>
        </Menu.Item>

        {
          props.session.loggedIn === true && props.session.userLevel === "admin" &&
          (
            <Menu.Item key="admin" onClick={goTo.bind(this, '/admin/tracks')}>
              <SettingOutlined />
              <span>Administrator</span>
            </Menu.Item>
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
