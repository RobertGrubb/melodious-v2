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
        <Col
          xs={{span: 0}}
          md={{span: 0}}
          lg={{span: 6}}
          xl={{span: 6}}
          xxl={{span: 6}}
          className="playerbar__column info"
        >
          <Info />
        </Col>
        <Col
          xs={{span: 24}}
          md={{span: 24}}
          lg={{span: 12}}
          xl={{span: 12}}
          xxl={{span: 12}}
          className="playerbar__column controls"
        >
          <Controls />
        </Col>
        <Col
          xs={{span: 0}}
          md={{span: 0}}
          lg={{span: 6}}
          xl={{span: 6}}
          xxl={{span: 6}}
          className="playerbar__column volume"
        >
          <Volume />
        </Col>
      </Row>
    </div>
  );
}

export default PlayerBar;
