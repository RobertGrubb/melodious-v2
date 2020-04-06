import React, { useEffect, useState } from 'react';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { subscribe } from 'react-contextual';
import { Row, Col, Slider } from 'antd';
import { PauseCircleOutlined, PlayCircleOutlined, BackwardOutlined, ForwardOutlined } from '@ant-design/icons';
import './controls.scss';
import Loader from '../../../shared/components/loader';

momentDurationFormatSetup(moment);

const Controls = props => {
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [audio] = useState(new Audio());
  const [currentState, setCurrentState] = useState('stopped');
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  /**
   * Do not load bar unless there are tracks.
   */
  useEffect(() => {
    if (props.trackData.tracks.length >= 1) setLoading(false);
  }, [props])

  /**
   * The following methods do not alter the
   * actual audio object at all, however, they do
   * update the state variables, both local and global.
   */

  // Sets the track state
  const play = async () => {
    props.setTrack(props.player.currentTrack !== false ? props.player.currentTrack : 0);
    setCurrentState('play');
  };

  // Pause the track
  const pause = async () => setCurrentState('pause');

  // Go to next track
  const next = async () => props.nextTrack();

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

  /**
   * Removes any existing audio events that are listening.
   */
  const removeAudioEvents = () => {
    if (audio) audio.removeEventListener('timeupdate', handleTimeUpdate);
    if (audio) audio.removeEventListener('ended', handleAudioOnEnded);
  }

  /**
   * Plays the actual audio object.
   *
   * Will also set the source and currentTIme
   * if a new src is passed.
   */
  const playAudio = (src = false) => {
    if (src) audio.src = src;
    if (src) audio.currentTime = 0;

    setAudioEvents();
    audio.play();
    setCurrentState('play');
  }

  /**
   * Stops the actual audio object.
   */
  const stopAudio = () => {
    removeAudioEvents();
    audio.pause();
    setCurrentState('pause');
  }

  const setAudioVolume = () => {
    if (audio) audio.volume = props.player.volume;
  }

  /**
   * Listens for a change in the current audio state.
   * Plays or stops based on the change.
   */
  useEffect(() => {
    if (currentState === 'play') playAudio();
    else if (currentState === 'pause') stopAudio();
  }, [currentState]);

  /**
   * Listens for changes in the player volume, then
   * calls setAudioVolume which actually alters the audio
   * object.
   */
  useEffect(() => {
    setAudioVolume();
  }, [props.player.volume])

  /**
   * Plays new source based on the track passed.
   */
  useEffect(() => {
    if (props.trackData.tracks.length) {
      const src = `${process.env.REACT_APP_API_URL}/stream/${props.trackData.tracks[props.player.currentTrack].id}`;
      playAudio(src);
    }
  }, [props.player.currentTrack]);

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
          <i onClick={setRepeat.bind(this, !repeat)} class={"fas fa-redo small-icon " + (repeat ? 'active' : '')}></i>
          <i class="fas fa-backward small-icon" onClick={previous}></i>
          {
            currentState === 'play' ?
            (
              <i class="far fa-pause-circle pause" onClick={pause}></i>
            ) : (
              <i class="far fa-play-circle play" onClick={play}></i>
            )
          }
          <i class="fas fa-forward small-icon" onClick={next}></i>
          <i onClick={setShuffle.bind(this, !shuffle)} class={"fas fa-random small-icon " + (shuffle ? 'active' : '')}></i>
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
