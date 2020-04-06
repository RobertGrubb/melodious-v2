import React, { useState, useEffect} from 'react';
import { subscribe } from 'react-contextual';
import { Slider, Row, Col} from 'antd';
import { SoundOutlined } from '@ant-design/icons';

import './volume.scss';

const Volume = props => {

  const updateVolume = val => props.setVolume((val ? (val / 100) : 0));

  return (
    <div className="volume__container">
      <Row style={{width: '50%', float: 'right'}}>
        <Col span={4}>
          <SoundOutlined style={{position: 'relative', top: 4}} />
        </Col>
        <Col span={20}>
          <Slider onChange={updateVolume} defaultValue={props.player.volume} value={(props.player.volume ? (props.player.volume * 100) : 0)} min={0} max={100} />
        </Col>
      </Row>
    </div>
  );
}

export default subscribe()(Volume);
