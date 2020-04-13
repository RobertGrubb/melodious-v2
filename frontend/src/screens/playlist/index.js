import React, { useEffect, useState } from 'react';
import { subscribe } from 'react-contextual';
import moment from 'moment';
import { PageHeader, Table, Button, Menu, Dropdown, Modal, Input, Select, Upload, message } from 'antd';

import api from '../../shared/libs/api';
import Loader from '../../shared/components/loader';
import TrackTable from '../../shared/components/track-table';

// Ant Design Icons
import {
  InboxOutlined
} from '@ant-design/icons';

import './playlist.scss';

// Default track data state.
const defaultTrackData = {
  title: '',
  artist: '',
  genre: '',
  videoId: '',
  trackData: false,
  type: 'youtube',
  credits: false
};

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const Playlist = props => {

  // Local function state
  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] = useState(false);

  // Playlist owner options:
  const [createLoading, setCreateLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editPlaylistLoading, setEditPlaylistLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editPlaylistVisible, setEditPlaylistVisible] = useState(false);
  const [editTrackData, setEditTrackData] = useState({});
  const [newTrackData, setNewTrackData] = useState(defaultTrackData);
  const [editPlaylistData, setEditPlaylistData] = useState({});

  /**
   * Check if the current session user is the owner.
   * @return {Boolean}
   */
  const isOwner = () => {
    if (playlist === false) return false;
    if (!props.session.id) return false;
    if (props.session.id === playlist.userId) return true;
    return false;
  }

  /**
   * Retrieves the playlist data on mount.
   */
  const retrievePlaylist = async forceUpdate => {
    try {
      const res = await api.playlist(props.id);

      // response returned an error, show something.
      if (res.error) {
        message.error('Error loading specified playlist.');
        return setLoading(false);
      }

      // Set the playlist to the local component state.
      setPlaylist(res.playlist);

      if (props.trackData.tracks === false || forceUpdate)
        props.updateSource(res.playlist.id, res.playlist.tracks);

      setLoading(false);
    } catch (error) {
      console.log(error);

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
    if (props.player.source !== props.id)
      props.updateSource(props.id, playlist.tracks, key);
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


  /**
   * ADMIN / OWNER LOGIC
   */

   /**
    * Opens the playlist modal
    */
   const openEditPlaylistModal = () => {
     setEditPlaylistData({
       id: playlist.id,
       title: playlist.title,
       description: playlist.description
     });
     setEditPlaylistVisible(true);
   }

   /**
    * Closes the playlist modal
    */
   const closeEditPlaylistModal = () => {
     setEditPlaylistVisible(false);

     setTimeout(() => {
       setEditPlaylistData({});
     }, 200);
   }

   // Updates playlist data
   const updateEditPlaylistData = (field, value) => {
     setEditPlaylistData({
       ...editPlaylistData,
       [field]: value
     });
   }

   /**
    * Sends edited data to the API to update the database
    * for a specific playlist.
    */
   const updatePlaylist = async () => {
     if (!editPlaylistData.id) return message.error('ID was not set. Please try again.');
     if (!editPlaylistData.title) return message.error('You must provide a title.');
     if (!editPlaylistData.description) return message.error('You must provide an description.');

     setEditPlaylistLoading(true);

     try {
       // Call the API
       const res = await api.editPlaylist(editPlaylistData, playlist.id);

       // If successful, update all necessary states.
       if (res.success) {
         setEditPlaylistVisible(false);
         setEditPlaylistData({});
         await retrievePlaylist(true);
         setEditPlaylistLoading(false);
         return message.success('Playlist was edited successfully.');
       }

       // If not successfull, return an error.
       setEditPlaylistLoading(false);
       return message.error('Problem editing playlist.');
     } catch (error) {

       // If not successfull, return an error.
       console.log(error);
       setEditPlaylistLoading(false);
       return message.error('Problem editing playlist.');
     }
   }

  /**
   * Confirms the delete action, if confirmed it will call the api
   * and send the id of the track that needs to be deleted.
   */
  const handleRemoveTrack = async id => {
    if (window.confirm("Do you really want to remove this track from your playlist?")) {
      try {
        // Call the API
        const res = await api.removeTrack(id, playlist.id);

        // If successful, update all necessary states.
        if (res.success) {
          await retrievePlaylist(true);
          return message.success('Track was deleted successfully.');
        }

        // If not successfull, return an error.
        return message.error('Problem deleting track.');
      } catch (error) {

        // If not successfull, return an error.
        return message.error('Problem deleting track.');
      }
    }

    return;
  }

  /**
   * Sends edited data to the API to update the database
   * for a specific track.
   */
  const editTrack = async () => {
    if (!editTrackData.title) return message.error('You must provide a track title.');
    if (!editTrackData.artist) return message.error('You must provide an artist.');
    if (!editTrackData.genre) return message.error('You must provide a genre.');

    setEditLoading(true);

    try {
      // Call the API
      const res = await api.editTrack(editTrackData, playlist.id);

      // If successful, update all necessary states.
      if (res.success) {
        setEditVisible(false);
        setEditTrackData({});
        await retrievePlaylist(true);
        setEditLoading(false);
        return message.success('Track was edited successfully.');
      }

      // If not successfull, return an error.
      setEditLoading(false);
      return message.error('Problem editing track.');
    } catch (error) {

      // If not successfull, return an error.
      console.log(error);
      setEditLoading(false);
      return message.error('Problem editing track.');
    }
  }

  /**
   * Opens the edit modal
   */
  const openEditModal = track => {
    console.log(track);
    setEditTrackData(track);
    setEditVisible(true);
  }

  /**
   * Closes the edit modal
   */
  const closeEditModal = () => {
    setEditVisible(false);

    setTimeout(() => {
      setEditTrackData({});
    }, 200);
  }

  // Updates track data state
  const updateEditTrackData = (field, value) => {
    setEditTrackData({
      ...editTrackData,
      [field]: value
    });
  }

  // Updates track data state
  const updateNewTrackData = (field, value) => {
    setNewTrackData({
      ...newTrackData,
      [field]: value
    });
  }

  // Creates a new track
  const createTrack = async () => {

    // All validations
    if (!newTrackData.title) return message.error('You must provide a track title.');
    if (!newTrackData.artist) return message.error('You must provide an artist.');
    if (!newTrackData.genre) return message.error('You must provide a genre.');
    if (newTrackData.type === 'youtube' && !newTrackData.videoId) return message.error('You must provide a video id.');
    if (newTrackData.type === 'mp3' && !newTrackData.trackData) return message.error('You must upload a track.');

    // Set loading status
    setCreateLoading(true);

    try {
      // Call the API
      const res = await api.createTrack(newTrackData, playlist.id);

      // If successful, update all necessary states.
      if (res.success) {
        setVisible(false);
        setNewTrackData(defaultTrackData);
        await retrievePlaylist(true);
        setCreateLoading(false);
        return message.success('Track was added successfully.');
      }

      // If not successfull, return an error.
      setCreateLoading(false);
      return message.error('Problem adding track.');
    } catch (error) {

      // If not successfull, return an error.
      console.log(error);
      setCreateLoading(false);
      return message.error('Problem adding track.');
    }
  }

  // Props for the uploader.
  const uploadProps = {
    name: 'file',
    multiple: false,
    action: `${process.env.REACT_APP_API_URL}/admin/tracks/upload`,
    onChange (info) {
      const { status } = info.file;

      if (status === 'done') {
        console.log(info.file.response);
        message.success(`${info.file.name} file uploaded successfully.`);
        updateNewTrackData('trackData', info.file.response);
      }
      else if (status === 'error') message.error(`${info.file.name} file upload failed.`);
    },
  };



  // Menu for admin track options.
  const menu = (id) => {
    const track = playlist.tracks.find(track => track.id === id);

    return (
      <Menu>
        <Menu.Item key="1" onClick={openEditModal.bind(this, track)}>Edit Track</Menu.Item>
        <Menu.Item key="2" onClick={handleRemoveTrack.bind(this, id)}>Remove Track</Menu.Item>
      </Menu>
    )
  };

  // Render the track table
  return (
    <div className="playlist__container">
      <div className="info">
        <div className="m"><div className="m-text">m</div></div>
        <div className="content">
          <h1>{playlist.title}</h1>
          <p>{playlist.description}</p>
          {
            isOwner() &&
            (
              <>
                <Button onClick={openEditPlaylistModal.bind(this)}>Edit</Button>&nbsp;&nbsp;
                <Button type="primary" onClick={setVisible.bind(this, true)}>Add Track</Button>
              </>
            )
          }
        </div>
      </div>
      <TrackTable
        source={props.id}
        tracks={playlist.tracks}
        loading={loading}
        onSetTrack={setTrack.bind(this)}
        options={true}
        menu={menu}
      />

      <Modal
        title="Add Track"
        visible={visible}
        onOk={createTrack}
        confirmLoading={createLoading}
        onCancel={setVisible.bind(this, false)}
      >
        <Input value={newTrackData.title} onChange={e => updateNewTrackData('title', e.target.value)} placeholder="Title" style={{marginBottom: 15}} />
        <Input value={newTrackData.artist} onChange={e => updateNewTrackData('artist', e.target.value)} placeholder="Artist" style={{marginBottom: 15}} />
        <Input value={newTrackData.genre} onChange={e => updateNewTrackData('genre', e.target.value)} placeholder="Genre" style={{marginBottom: 15}} />
        <TextArea value={newTrackData.credits} onChange={e => updateNewTrackData('credits', e.target.value)} placeholder="Credits" style={{marginBottom: 15}} rows={5} />
        <Select value={newTrackData.type} onChange={val => updateNewTrackData('type', val)} style={{width: '100%', marginBottom: 15}}>
          <Option value="youtube">YouTube</Option>
          <Option value="mp3">MP3</Option>
        </Select>
        {
          newTrackData.type === 'mp3' ?
          (
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Only supports .mp3 files. Please make sure all files uploaded do not have copyrights.
              </p>
            </Dragger>
          ) : (
            <Input value={newTrackData.videoId} onChange={e => updateNewTrackData('videoId', e.target.value)} placeholder="YouTube Video ID" style={{marginBottom: 15}} />
          )
        }
      </Modal>

      <Modal
        title="Edit Track"
        visible={editVisible}
        onOk={editTrack.bind(this)}
        onCancel={closeEditModal.bind(this)}
      >
        <Input value={editTrackData.title} onChange={e => updateEditTrackData('title', e.target.value)} placeholder="Title" style={{marginBottom: 15}} />
        <Input value={editTrackData.artist} onChange={e => updateEditTrackData('artist', e.target.value)} placeholder="Artist" style={{marginBottom: 15}} />
        <Input value={editTrackData.genre} onChange={e => updateEditTrackData('genre', e.target.value)} placeholder="Genre" style={{marginBottom: 15}} />
        <TextArea value={editTrackData.credits} onChange={e => updateEditTrackData('credits', e.target.value)} placeholder="Credits" style={{marginBottom: 15}} rows={5} />
      </Modal>

      <Modal
        title="Edit Playlist"
        visible={editPlaylistVisible}
        onOk={updatePlaylist.bind(this)}
        onCancel={closeEditPlaylistModal.bind(this)}
      >
        <Input value={editPlaylistData.title} onChange={e => updateEditPlaylistData('title', e.target.value)} placeholder="Title" style={{marginBottom: 15}} />
        <TextArea value={editPlaylistData.description} onChange={e => updateEditPlaylistData('description', e.target.value)} placeholder="Description" style={{marginBottom: 15}} rows={5} />
      </Modal>
    </div>
  );
}

export default subscribe()(Playlist);
