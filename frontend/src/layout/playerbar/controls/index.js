import React, { useEffect } from 'react';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { subscribe } from 'react-contextual';
import { Row, Col, Slider } from 'antd';
import { PauseCircleOutlined, PlayCircleOutlined, BackwardOutlined, ForwardOutlined } from '@ant-design/icons';
import './controls.scss';

momentDurationFormatSetup(moment);

const Controls = props => {

  let length = '00:00';

  if (props.player.currentTrack !== false) {
    const duration = moment.duration({seconds: props.trackData.tracks[props.player.currentTrack].duration});

    length = duration.format('mm:ss');
  }

  const play = () => props.play();
  const pause = () => props.pause();
  const next = () => props.nextTrack();
  const previous = () => props.previousTrack();

  useEffect(() => {
    console.log(props);
  }, [props.player]);

  return (
    <div className="controls__container">
      <Row>
        <Col span={24} style={{textAlign: 'center'}}>
          <BackwardOutlined className="previous" onClick={previous} />
          {
            props.player.playing ?
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
        <Col span={3} style={{fontSize: 9}}>00:00</Col>
        <Col span={18}>
          <Slider disabled={!props.player.currentTrack} defaultValue={props.player.currentTime} />
        </Col>
        <Col span={3} style={{textAlign: 'right', fontSize: 9}}><span>{length}</span></Col>
      </Row>
    </div>
  );
}

export default subscribe()(Controls);
