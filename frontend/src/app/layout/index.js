import React from 'react';

import styles from './layout.scss';

const Layout = props => {
  return (
    <div className={styles.main}>
      {props.children}
    </div>
  );
}

export default Layout;
