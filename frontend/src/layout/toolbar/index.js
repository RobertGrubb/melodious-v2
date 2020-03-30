import React from 'react';
import { PageHeader } from 'antd';
import './toolbar.scss';

const Toolbar = props => {
  console.log(process.env);
  return (
    <PageHeader
      ghost={false}
      title="Melodious"
      subTitle="This is a subtitle"
      className="toolbar__container"
    />
  );
}

export default Toolbar;
