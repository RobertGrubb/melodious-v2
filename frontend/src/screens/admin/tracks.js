import React, { useState, useEffect } from 'react';
import { navigate } from 'hookrouter';
import { subscribe } from 'react-contextual';
import { PageHeader, Table, Button, Menu, Dropdown, Modal, Input, Select, Upload, message } from 'antd';
import moment from 'moment';

// Local imports
import api from '../../shared/libs/api';
import Loader from '../../shared/components/loader';
import ErrorComponent from '../../shared/components/error';
import './admin.scss';

// Ant Design Icons
import {
  EllipsisOutlined,
  InboxOutlined
} from '@ant-design/icons';

// Default track data state.
const defaultTrackData = {
  title: '',
  artist: '',
  genre: '',
  videoId: '',
  trackData: false,
  type: 'youtube'
};

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const TracksAdmin = props => {

  // Local state variables.
  const [tracks, setTracks] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [newTrackData, setNewTrackData] = useState(defaultTrackData)

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
      const res = await api.createTrack(newTrackData);

      // If successful, update all necessary states.
      if (res.success) {
        setVisible(false);
        setNewTrackData(defaultTrackData);
        loadTracks();
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

  // Loads all tracks for table display.
  const loadTracks = async () => {
    setLoading(true);
    try {
      const res = await api.tracks();
      setTracks(res);
    } catch (error) {
      setError(true);
    }
    setLoading(false);
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

  // Update the page title on mount
  useEffect(() => {
    props.setTitle('Track Administration');
    loadTracks();
  }, [])

  // If error, or loading, return that component.
  if (error) return <ErrorComponent />;
  if (loading) return <Loader />;

  // Menu for admin track options.
  const menu = id => (
    <Menu>
      <Menu.Item key="1" onClick={setEditVisible.bind(this, true)}>Edit Track</Menu.Item>
      <Menu.Item key="2">Remove Track</Menu.Item>
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
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: id => <Dropdown trigger="click" overlay={menu.bind(this, id)}><Button shape="circle"><EllipsisOutlined /></Button></Dropdown>
    },
  ];

  return (
    <>
      <PageHeader
        title="Tracks"
        extra={[
          <Button key="1" type="primary" onClick={setVisible.bind(this, true)}>
            Add Track
          </Button>,
        ]}
      />
      <Table
        dataSource={dataSource}
        columns={columns}
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
                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                band files
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
        onOk={setEditVisible.bind(this, false)}
        onCancel={setEditVisible.bind(this, false)}
      >
        Editing a track
      </Modal>
    </>
  );
}

export default subscribe()(TracksAdmin);
