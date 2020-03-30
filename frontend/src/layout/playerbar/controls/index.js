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
      <Row>
        <Col span={24}>
          <Slider defaultValue={30} />
        </Col>
      </Row>
    </div>
  );
}

export default Controls;
