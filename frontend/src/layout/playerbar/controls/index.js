import React, { useEffect, useState } from 'react';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { subscribe } from 'react-contextual';
import { Row, Col, Slider } from 'antd';
import { PauseCircleOutlined, PlayCircleOutlined, BackwardOutlined, ForwardOutlined } from '@ant-design/icons';

import Loader from '../../../shared/components/loader';
import api from '../../../shared/libs/api';
import './controls.scss';

momentDurationFormatSetup(moment);

const Controls = props => {
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [audio] = useState(new Audio());
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [playing, setPlaying] = useState(false);

  const originalDocumentTitle = 'Melodious';

  /**
   * Do not load bar unless there are tracks.
   */
  useEffect(() => {
    if (props.trackData.tracks.length >= 1) setLoading(false);
  }, [props.trackData.tracks])

  /**
   * The following methods do not alter the
   * actual audio object at all, however, they do
   * update the state variables, both local and global.
   */

  // Sets the track state
  const play = async () => {
    props.setTrack(props.player.currentTrack !== false ? props.player.currentTrack : 0);
  };


  // Go to next track
  const next = async () => props.nextTrack(shuffle);

  // Go to previous track
  const previous = async () => props.previousTrack();

  /**
   * Set audio event listener
   */
  const setAudioEvents = () => {
    if (audio) {
      // Add event listener to get current time of audio
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleAudioOnEnded);
      audio.addEventListener('play', handleAudioOnPlay);
      audio.addEventListener('pause', handleAudioOnPause);
    }
  }

  /**
   * Set the time to a specific time (controlled by slider)
   */
  const setAudioTime = (seconds) => {
    if (audio) audio.currentTime = seconds;
  }

  /**
   * Handles the time update for an audio object.
   */
  const handleTimeUpdate = () => setTime(audio.currentTime);
  const handleAudioOnEnded = () => next();

  // Update state in multiple places
  const handleAudioOnPlay = () => {
    props.setAudioPlaying(true);
    setPlaying(true);
    if (props.player.currentTrack) document.title = `${props.trackData.tracks[props.player.currentTrack].title} - ${props.trackData.tracks[props.player.currentTrack].artist}`;
  }

  // Update state in multiple places.
  const handleAudioOnPause = () => {
    props.setAudioPlaying(false);
    setPlaying(false)
    document.title = originalDocumentTitle;
  };

  /**
   * Removes any existing audio events that are listening.
   */
  const removeAudioEvents = () => {
    if (audio) audio.removeEventListener('timeupdate', handleTimeUpdate);
    if (audio) audio.removeEventListener('ended', handleAudioOnEnded);
    if (audio) audio.removeEventListener('play', handleAudioOnPlay);
    if (audio) audio.removeEventListener('pause', handleAudioOnPause);
  }

  /**
   * Plays the actual audio object.
   *
   * Will also set the source and currentTIme
   * if a new src is passed.
   */
  const playAudio = async (src = false) => {
    if (src) audio.src = src;
    if (src) audio.currentTime = 0;
    if (audio.paused) audio.play();

    props.setAudioPlaying(true);

    // If logged in, update the API with the latest track played.
    if (props.session.loggedIn) await api.loadTrack(
      props.trackData.tracks[props.player.currentTrack].id,
      props.player.source
    );
  }

  /**
   * Method handles pausing of the audio, as well
   * as updated the state to playing = false.
   *
   * Mostly called by custom events passed from
   * track table.
   */
  const pauseAudio = () => {
    if (!audio.paused) audio.pause();
    props.setAudioPlaying(false);
  }

  /**
   * Method handles playing of the audio, as well
   * as updated the state to playing = true.
   *
   * Mostly called by custom events passed from
   * track table.
   */
  const resumeAudio = () => {
    if (audio.paused) audio.play();
    props.setAudioPlaying(true);
  }

  /**
   * Stops the actual audio object.
   */
  const stopAudio = () => {
    removeAudioEvents();
    if (!audio.paused) audio.pause();
    props.setAudioPlaying(false);
  }

  /**
   * Resets the audio, pauses it, sets the
   * current time to 0, and updates state to
   * not playing.
   */
  const resetAudio = () => {
    removeAudioEvents();
    if (!audio.paused) audio.pause();
    audio.src = '';
    audio.currentTime = 0;
    props.setAudioPlaying(false);
  }

  /**
   * Set the audio's volume to match the state
   */
  const setAudioVolume = () => {
    if (audio) audio.volume = props.player.volume;
  }

  /**
   * Listens for changes in the player volume, then
   * calls setAudioVolume which actually alters the audio
   * object.
   */
  useEffect(() => {
    setAudioVolume();
  }, [props.player.volume])

  /**
   * Add event listener for player.pause from track table.
   */
  useEffect(() => {
    document.addEventListener('player.pause', pauseAudio.bind(this));
    return document.removeEventListener('player.pause', pauseAudio.bind(this));
  }, [])


  /**
   * Add event listener for player.resume from track table.
   */
  useEffect(() => {
    document.addEventListener('player.resume', resumeAudio.bind(this));
    return document.removeEventListener('player.resume', resumeAudio.bind(this));
  }, [])

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', playAudio);
      navigator.mediaSession.setActionHandler('pause', pauseAudio);
      navigator.mediaSession.setActionHandler('previoustrack', props.previousTrack);
      navigator.mediaSession.setActionHandler('nexttrack', props.nextTrack);
    }

    setAudioEvents();
  }, []);

  /**
   * Plays new source based on the track passed.
   */
  useEffect(() => {
    if (props.trackData.tracks.length && props.player.currentTrack !== false) {
      const src = `${process.env.REACT_APP_API_URL}/stream/${props.trackData.tracks[props.player.currentTrack].id}`;
      resetAudio();
      setTimeout(() => {
        playAudio(src);
      }, 200);

      if ('mediaSession' in navigator) {

        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: props.trackData.tracks[props.player.currentTrack].title,
          artist: props.trackData.tracks[props.player.currentTrack].artist,
          artwork: [
            { src: '/m.jpg',   sizes: '96x96',   type: 'image/jpeg' },
            { src: '/m.jpg', sizes: '128x128', type: 'image/jpeg' }
          ]
        });
      }
    }
  }, [props.player.currentTrack, props.player.source]);

  /**
   * Format the current
   */
  let formattedTime = time;
  if (formattedTime) {
    const duration = moment.duration({ seconds: time });
    formattedTime = duration.format('mm:ss');

    if (!formattedTime.includes(':')) {
      formattedTime = `00:${formattedTime}`;
    }
  } else {
    formattedTime = `00:00`;
  }

  /**
   * Format the full length of the track.
   * By default set it to 00:00
   */
  let length = '00:00';
  if (props.player.currentTrack !== false) {
    const duration = moment.duration({
      seconds: props.trackData.tracks[props.player.currentTrack].duration
    });
    length = duration.format('mm:ss');
  }

  if (loading) return (<div className="controls__container"><Loader /></div>);

  return (
    <div className="controls__container">
      <Row>
        <Col span={24} style={{textAlign: 'center'}}>
          <i onClick={setRepeat.bind(this, !repeat)} className={"fas fa-redo small-icon " + (repeat ? 'active' : '')}></i>
          <i className="fas fa-backward small-icon" onClick={previous}></i>
          {
            playing ?
            (
              <i className="far fa-pause-circle pause" onClick={() => audio.pause()}></i>
            ) : (
              <i className="far fa-play-circle play" onClick={() => props.player.currentTrack ? audio.play() : play()}></i>
            )
          }
          <i className="fas fa-forward small-icon" onClick={next}></i>
          <i onClick={setShuffle.bind(this, !shuffle)} className={"fas fa-random small-icon " + (shuffle ? 'active' : '')}></i>
        </Col>
      </Row>
      <Row type="flex" style={{alignItems: 'center'}}>
        <Col span={6} style={{textAlign: 'center', fontSize: 9}}>{(formattedTime !== '00:00' ? formattedTime : '')}</Col>
        <Col span={12}>
          <Slider
            tooltipVisible={false}
            onChange={setAudioTime}
            disabled={props.player.currentTrack === false}
            value={time}
            min={0}
            max={props.player.currentTrack !== false ? props.trackData.tracks[props.player.currentTrack].duration : 0}
          />
        </Col>
        <Col span={6} style={{textAlign: 'center', fontSize: 9}}><span>{(length !== '00:00' ? length : '')}</span></Col>
      </Row>
    </div>
  );
}

export default subscribe()(Controls);
