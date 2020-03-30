import React from 'react';
import { Slider, Row, Col, Icon } from 'antd';
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
          <Slider defaultValue={30} />
        </Col>
      </Row>
    </div>
  );
}

export default Volume;
