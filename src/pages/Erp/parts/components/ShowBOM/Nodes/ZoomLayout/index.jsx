import React, {useState} from 'react';
import styles from './index.module.scss';

const ZOOM = {
  DOWN: 1,
  UP: 2,
  MIN: 10,
  MAX: 300
};

const ZoomLayout = (props) => {
  // 放大比例, 按百分制给 100 为 100%
  const [scale, setScale] = useState(100);

  function zoomSize(type) {
    if (type === ZOOM.DOWN) {
      if (scale === ZOOM.MIN) {
        return;
      }
      setScale(scale - 10);
    }
    if (type === ZOOM.UP) {
      if (scale === ZOOM.MAX) {
        return;
      }
      setScale(scale + 10);
    }
  }

  return (
    <React.Fragment>
      <div className={styles.zoom}>
        <div className={'zoom-out' + (scale === ZOOM.MIN ? ' disabled' : '')} onClick={() => zoomSize(ZOOM.DOWN)} />
        <span>{scale}%</span>
        <div className={'zoom-in' + (scale === ZOOM.MAX ? ' disabled' : '')} onClick={() => zoomSize(ZOOM.UP)} />
      </div>
      <div
        className={styles.boxScale}
        id="box-scale"
        style={{'transform': `scale(${scale / 100})`, 'transformOrigin': '50% 0px 0px'}}>
        {props.children}
      </div>
    </React.Fragment>
  );
};

export default ZoomLayout;
