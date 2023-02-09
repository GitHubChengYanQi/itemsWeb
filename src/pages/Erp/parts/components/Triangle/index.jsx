import React, {useEffect, useState} from 'react';
import {CaretRightOutlined} from '@ant-design/icons';
import styles from '@/pages/Erp/parts/PartsEditV2/index.module.less';

const Triangle = () => {


  const [scrollTop, setScrollTop] = useState(0);

  const describeId = document.getElementById('describeId');

  useEffect(() => {
    const partsEditId = document.getElementById('partsEditId');
    if (partsEditId) {
      partsEditId.addEventListener('scroll', (event) => {
        setScrollTop(event.target.scrollTop);
      });
    }
  }, []);

  return <>
    <CaretRightOutlined
      style={{top: (describeId?.clientHeight || 0) - 83 > scrollTop + 83 ? scrollTop + 83 : (describeId?.clientHeight || 0) - 83}}
      className={styles.triangle}
    />
  </>;
};

export default Triangle;
