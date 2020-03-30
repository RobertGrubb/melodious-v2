import React, { useEffect, useState } from 'react';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { subscribe } from 'react-contextual';
import { Row, Col, Slider } from 'antd';
import { PauseCircleOutlined, PlayCircleOutlined, BackwardOutlined, ForwardOutlined } from '@ant-design/icons';
import './controls.scss';

momentDurationFormatSetup(moment);

const Controls = props => {
  const [time, setTime] = useState('00:00');

  let length = '00:00';

  if (props.player.currentTrack !== false) {
    const duration = moment.duration({
      seconds: props.trackData.tracks[props.player.currentTrack].duration
    });
    length = duration.format('mm:ss');
  }

  const play = async () => {
    const res = await props.setTrack(props.player.currentTrack ? props.player.currentTrack : 0);
  };

  const pause = async () => {
    props.pause();
  }

  const next = async () => {
    removeAudioEvents();
    props.nextTrack();
  }

  const previous = async () => {
    removeAudioEvents();
    props.previousTrack();
  }

  const setAudioEvents = () => {
    if (props.player.audio) {
      // Add event listener to get current time of audio
      props.player.audio.addEventListener('timeupdate', handleTimeUpdate);
    }
  }

  const handleTimeUpdate = () => {
    // Move to next song
    if (props.player.audio.currentTime === props.player.audio.duration) {
      setTimeout(() => {
        props.nextTrack();
      }, 2000)
    }

    setTime(props.player.audio.currentTime);
  }

  const removeAudioEvents = () => {
    if (props.player.audio) props.player.audio.removeEventListener('timeupdate', handleTimeUpdate);
  }

  useEffect(() => {
    if (props.player.state === 'play' && props.player.audio) {
      props.player.audio.play();
      setAudioEvents();
    }

    if (props.player.state === 'pause' && props.player.audio) props.player.audio.pause();
    if (props.player.currentTime) setTime(props.player.currentTime);
  }, [props.player])

  let formattedTime = time;

  if (time !== '00:00') {
    const duration = moment.duration({ seconds: time });
    formattedTime = duration.format('mm:ss');
  }

  return (
    <div className="controls__container">
      <Row>
        <Col span={24} style={{textAlign: 'center'}}>
          <BackwardOutlined className="previous" onClick={previous} />
          {
            props.player.state == 'play' ?
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
        <Col span={3} style={{fontSize: 9}}>{formattedTime}</Col>
        <Col span={18}>
          <Slider disabled={!props.player.currentTrack} defaultValue={props.player.currentTime} />
        </Col>
        <Col span={3} style={{textAlign: 'right', fontSize: 9}}><span>{length}</span></Col>
      </Row>
    </div>
  );
}

export default subscribe()(Controls);
