import {Button, Drawer} from '@alifd/next';
import React, {useRef, useState} from 'react';
import {Map} from 'react-amap';
import {config} from 'ice';
import AmapSearch from '@/components/Amap/search';

const {AMAP_KEY, AMAP_VERSION} = config;

const Amap = ({title, value, onClose, onChange}) => {
  const [visible, setVisible] = useState(false);

  const mapRef = useRef(null);

  const events = {
    dragend: () => {
      mapRef.current.setCenter(true);
    },
    dragging: (v) => {
      mapRef.current.setCenter(false);
    }
  };

  return (
    <>
      {value &&
      <div style={{padding: 8}}>
        <div style={{fontSize: 14, fontWeight: 900}}>{value.name}</div>
        {value.address}
      </div>}
      <Button type="primary" size="small" onClick={() => {
        setVisible(true);
      }}>{title || '定位'}</Button>
      <Drawer
        visible={visible}
        onClose={() => {
          setVisible(false);
          typeof onClose === 'function' && onClose();
        }}
        width="50%"
        title={title}>
        <div style={{height: 'calc(100vh - 90px)'}}>
          <Map events={events} amapkey={AMAP_KEY} version={AMAP_VERSION} zoom={16}>
            <AmapSearch ref={mapRef} onChange={(value) => {
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