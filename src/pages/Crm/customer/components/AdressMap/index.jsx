import React from 'react';
import Amap from '@/components/Amap';

const AdressMap = ({value, onChange}) => {

  return (
    <div style={{flexGrow: 1, display: 'flex',alignItems:'center'}}>
      <div>
        <Amap value={value?.map} onChange={(value) => {
          onChange({address: value.address, map: value.location, city: value.city});
        }} />
      </div>
    </div>
  );
};

export default AdressMap;
