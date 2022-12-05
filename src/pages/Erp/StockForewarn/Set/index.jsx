import React from 'react';
import ProCard from '@ant-design/pro-card';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './index.module.less';

const Set = () => {


  return <>
    <div className={styles.breadcrumb}>
      <Breadcrumb />
    </div>
    <div className={styles.set}>
      <ProCard title='预警条件' className='h2Card' headerBordered>
        
      </ProCard>
    </div>
  </>;
};

export default Set;
