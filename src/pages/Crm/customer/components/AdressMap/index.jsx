import React, {useState} from 'react';
import Amap from '@/components/Amap';
import Note from '@/components/Note';

const AdressMap = ({width, value, onChange}) => {

  const [location, setLocation] = useState(value || {});

  return (
    <div style={{flexGrow: 1, display: 'flex',alignItems:'center'}}>
      <div>
        <Amap value={value?.map} onChange={(value) => {
          setLocation(value);
          onChange({address: value.address, map: value.location, city: value.city});
        }} />
      </div>
    </div>
  );
};

export default AdressMap;
