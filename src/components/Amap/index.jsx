import React, {useRef, useState} from 'react';
import {Map} from 'react-amap';
import {config} from 'ice';
import {Button, Drawer} from 'antd';
import AmapSearch from '@/components/Amap/search';
import Icon from '@/components/Icon';
import {isArray} from '@/util/Tools';

const {AMAP_KEY, AMAP_VERSION} = config;

const Amap = ({
  title,
  value = [],
  onClose = () => {
  },
  onChange = () => {
  }
}) => {

  const [visible, setVisible] = useState(false);
  const [center, setCenter] = useState(isArray(value).length > 0 ? {longitude: value[0], latitude: value[1]} : {});

  const mapRef = useRef(null);

  const events = {
    complete: () => {
      if (isArray(value).length > 0) {
        mapRef.current.setCenter(true);
      }
    },
    dragend: () => {
      mapRef.current.setCenter(true);
    },
    dragging: (v) => {
      mapRef.current.setCenter(false);
    }
  };

  return (
    <>
      <Button type="text" onClick={() => {
        setVisible(true);
      }}><Icon type="icon-dingwei" />{title || '定位'}</Button>
      <Drawer
        destroyOnClose
        open={visible}
        onClose={() => {
          setVisible(false);
          onClose();
        }}
        width="50%"
        title={title}>
        <div style={{height: 'calc(100vh - 90px)'}}>
          <Map events={events} amapkey={AMAP_KEY} center={center} version={AMAP_VERSION} zoom={16}>
            <AmapSearch value={value} ref={mapRef} center={(value) => {
              setCenter({longitude: value.lgn, latitude: value.lat});
            }} onChange={(value) => {
              setVisible(false);
              typeof onChange === 'function' && onChange(value);
            }} />
          </Map>
        </div>
      </Drawer>
    </>

  );
};
export default Amap;
