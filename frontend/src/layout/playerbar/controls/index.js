import React from 'react';
import { Row, Col, Slider } from 'antd';
import { PlayCircleOutlined, BackwardOutlined, ForwardOutlined } from '@ant-design/icons';
import './controls.scss';

const Controls = props => {
  return (
    <div className="controls__container">
      <Row>
        <Col span={24} style={{textAlign: 'center'}}>
          <BackwardOutlined className="previous" />
          <PlayCircleOutlined className="play" />
          <ForwardOutlined className="next" />
        </Col>
      </Row>
      <Row type="flex" style={{alignItems: 'center'}}>
        <Col span={3} style={{fontSize: 9}}>0:00</Col>
        <Col span={18}>
          <Slider defaultValue={30} />
        </Col>
        <Col span={3} style={{textAlign: 'right', fontSize: 9}}>3:21</Col>
      </Row>
    </div>
  );
}

export default Controls;
