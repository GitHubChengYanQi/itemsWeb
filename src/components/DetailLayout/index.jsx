import React, {useState} from 'react';
import {Button} from 'antd';
import useUrlState from '@ahooksjs/use-url-state';
import styles from './index.module.less';
import Breadcrumb from '@/components/Breadcrumb';
import {isArray} from '@/util/Tools';

const DetailLayout = (
  {
    children,
    extra,
    title
  }) => {

  const [state, setState] = useUrlState(
    {
      navigateMode: 'push',
    },
  );

  const [current, setCurrent] = useState(children[0].props.id);

  return <>
    <div className={styles.header}>
      <div className={styles.breadcrumb}>
        <Breadcrumb title={title}/>
      </div>
      <div>
        {extra}
      </div>
    </div>
    <div className={styles.detail}>
      <div className={styles.nav}>
        <div>
          {
            isArray(children).map((item, index) => {
              const check = current === item.props.id;
              return <div key={index} className={styles.navItem}>
                <Button
                  className={styles.button}
                  key={index}
                  type="link"
                  style={{color: !check && 'rgba(0,0,0,0.59)'}}
                  onClick={() => {
                    setCurrent(item.props.id);
                    const box = document.getElementById(`${item.props.id}`);
                    box.scrollIntoView({block: 'start', behavior: 'smooth'});
                    // setState({
                    //   params: ''
                    // });
                  }}>{item.props.id}</Button>
                <div style={{backgroundColor: !check && '#eee'}} className={styles.line}/>
              </div>;
            })
          }
        </div>
      </div>
      <div className={styles.content}>
        {isArray(children).map(item => {

          return {...item, props: {...item.props, className: styles.item}};
        })}
      </div>
    </div>
  </>;
};

export default DetailLayout;
