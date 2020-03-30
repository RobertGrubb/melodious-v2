import React, { useState, useEffect} from 'react';
import { subscribe } from 'react-contextual';
import { Slider, Row, Col} from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import './volume.scss';

const Volume = props => {
  const [volume, setVolume] = useState(0.5);

  const updateVolume = (val) => {
    setVolume((val ? (val / 100) : 0))
    if (props.player.audo) props.player.audio.volume = (val ? (val / 100) : 0);
  }

  useEffect(() => {
    if (props.player.audio) props.player.audio.volume = volume;
  }, [props.player.audio, volume])

  return (
    <div className="volume__container">
      <Row style={{width: '50%', float: 'right'}}>
        <Col span={4}>
          <SoundOutlined style={{position: 'relative', top: 4}} />
        </Col>
        <Col span={20}>
          <Slider onChange={updateVolume} defaultValue={volume} value={(volume ? (volume * 100) : 0)} min={0} max={100} />
        </Col>
      </Row>
    </div>
  );
}

export default subscribe()(Volume);
