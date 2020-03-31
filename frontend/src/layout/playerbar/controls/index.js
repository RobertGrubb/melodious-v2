import React, { useEffect, useState } from 'react';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { subscribe } from 'react-contextual';
import { Row, Col, Slider } from 'antd';
import { PauseCircleOutlined, PlayCircleOutlined, BackwardOutlined, ForwardOutlined } from '@ant-design/icons';
import './controls.scss';

momentDurationFormatSetup(moment);

const Controls = props => {
  const [time, setTime] = useState(0);

  // Play the track
  const play = async () => {
    await props.setTrack(props.player.currentTrack ? props.player.currentTrack : 0);
  };

  // Pause the track
  const pause = async () => {
    props.pause();
  }

  // Go to next track
  const next = async () => {
    removeAudioEvents();
    props.nextTrack();
  }

  // Go to previous track
  const previous = async () => {
    removeAudioEvents();
    props.previousTrack();
  }

  /**
   * Set audio event listener
   */
  const setAudioEvents = () => {
    if (props.player.audio) {
      // Add event listener to get current time of audio
      props.player.audio.addEventListener('timeupdate', handleTimeUpdate);
    }
  }

  /**
   * Set the time to a specific time (controlled by slider)
   */
  const setAudioTime = (seconds) => {
    if (props.player.audio) props.player.audio.currentTime = seconds;
  }

  /**
   * Handles the time update for an audio object.
   */
  const handleTimeUpdate = () => {
    // Move to next song
    if (props.player.audio.currentTime === props.player.audio.duration) {
      setTimeout(() => {
        props.nextTrack();
      }, 2000)
    }

    setTime(props.player.audio.currentTime);
  }

  /**
   * Removes any existing audio events that are listening.
   */
  const removeAudioEvents = () => {
    if (props.player.audio) props.player.audio.removeEventListener('timeupdate', handleTimeUpdate);
  }

  useEffect(() => {

    // If state is playing and there is audio, make sure play is called
    // and the audio events are listening.
    if (props.player.state === 'play' && props.player.audio) {
      props.player.audio.play();
      setAudioEvents();
    }

    // If the state is paused, pause the audio.
    if (props.player.state === 'pause' && props.player.audio) props.player.audio.pause();

    // If currentTime changes, set it to local state.
    if (props.player.currentTime) setTime(props.player.currentTime);
  }, [props.player])

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

  return (
    <div className="controls__container">
      <Row>
        <Col span={24} style={{textAlign: 'center'}}>
          <BackwardOutlined className="previous" onClick={previous} />
          {
            props.player.state === 'play' ?
            (
              <PauseCircleOutlined className="pause" onClick={pause} />
            ) : (
              <PlayCircleOutlined className="play" onClick={play} />
            )
          }
          <ForwardOutlined className="next" onClick={next} />
        </Col>
      </Row>
      <Row type="flex" style={{alignItems: 'center'}}>
        <Col span={6} style={{fontSize: 9}}>{(formattedTime !== '00:00' ? formattedTime : '')}</Col>
        <Col span={12}>
          <Slider
            tooltipVisible={false}
            onChange={setAudioTime}
            disabled={!props.player.currentTrack}
            value={time}
            min={0}
            max={props.player.currentTrack ? props.trackData.tracks[props.player.currentTrack].duration : 0}
          />
        </Col>
        <Col span={6} style={{textAlign: 'right', fontSize: 9}}><span>{(length !== '00:00' ? length : '')}</span></Col>
      </Row>
    </div>
  );
}

export default subscribe()(Controls);
