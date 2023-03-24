import React, {useEffect, useState} from 'react';
import {Button} from 'antd';
import styles from './index.module.less';
import Breadcrumb from '@/components/Breadcrumb';
import {isArray} from '@/util/Tools';
import store from '@/store';

const DetailLayout = (
  {
    children,
    extra,
    title
  }) => {

  const [current, setCurrent] = useState(children[0].props.id);

  const [tableStore] = store.useModel('table');

  useEffect(() => {
    const detailContent = document.getElementById('detailContent');
    if (!tableStore.loading && detailContent) {
      setTimeout(() => {
        const box = document.getElementById(current);
        if (box){
          box.scrollIntoView({block: 'start', behavior: 'smooth'});
        }
      },500);
    }
  }, [tableStore.loading]);

  useEffect(() => {
    const detailContent = document.getElementById('detailContent');
    const listener = (event) => {
      const scrollTop = event.target.scrollTop;
      let height = 0;
      const boxHeights = isArray(children).map((item) => {
        const box = document.getElementById(item.props.id);
        return box.clientHeight;
      });
      const boxIndex = boxHeights.findIndex((item) => {
        height += item;
        return scrollTop + 24 < height;
      });
      setCurrent(isArray(children)[boxIndex]?.props?.id);
    };
    if (detailContent){
      detailContent.addEventListener('scroll', listener);
    }

    return () => {
      detailContent.removeEventListener('scroll', listener);
    };
  }, []);

  return <>
    <div className={styles.header}>
      <div className={styles.breadcrumb}>
        <Breadcrumb title={title} />
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
                    // setCurrent(item.props.id);
                    const box = document.getElementById(`${item.props.id}`);
                    box.scrollIntoView({block: 'start', behavior: 'smooth'});
                    // setState({
                    //   params: ''
                    // });
                  }}>{item.props.id}</Button>
                <div style={{backgroundColor: !check && '#eee'}} className={styles.line} />
              </div>;
            })
          }
        </div>
      </div>
      <div id="detailContent" className={styles.content}>
        {isArray(children).map(item => {

          return {...item, props: {...item.props, className: styles.item}};
        })}
      </div>
    </div>
  </>;
};

export default DetailLayout;
