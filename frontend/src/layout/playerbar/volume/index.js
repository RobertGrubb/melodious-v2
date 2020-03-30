import React from 'react';
import { subscribe } from 'react-contextual';
import { Slider, Row, Col} from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import './volume.scss';

const Volume = props => {
  return (
    <div className="volume__container">
      <Row style={{width: '50%', float: 'right'}}>
        <Col span={4}>
          <SoundOutlined style={{position: 'relative', top: 4}} />
        </Col>
        <Col span={20}>
          <Slider defaultValue={props.player.volume} />
        </Col>
      </Row>
    </div>
  );
}

export default subscribe()(Volume);
