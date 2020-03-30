import React from 'react';
import { Row, Col } from 'antd';
import Controls from './controls';
import Info from './info';
import Volume from './volume';
import './playerbar.scss';

const PlayerBar = props => {
  return (
    <div className="playerbar__container">
      <Row type="flex" style={{alignItems: 'center'}}>
        <Col span={6} className="playerbar__column info">
          <Info />
        </Col>
        <Col span={12} className="playerbar__column controls">
          <Controls />
        </Col>
        <Col span={6} className="playerbar__column volume">
          <Volume />
        </Col>
      </Row>
    </div>
  );
}

export default PlayerBar;
