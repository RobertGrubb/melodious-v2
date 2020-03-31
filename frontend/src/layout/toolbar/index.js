import React from 'react';
import { PageHeader, Button } from 'antd';
import './toolbar.scss';

const Toolbar = props => {
  return (
    <PageHeader
      ghost={false}
      title="Popular Songs"
      className="toolbar__container"
      extra={[
        <Button key="1">Sign Up</Button>,
        <Button key="2" type="primary">Login</Button>
      ]}
    />
  );
}

export default Toolbar;
