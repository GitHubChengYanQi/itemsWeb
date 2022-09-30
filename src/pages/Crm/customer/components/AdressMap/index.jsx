import React, {useState} from 'react';
import Amap from '@/components/Amap';
import Note from '@/components/Note';

const AdressMap = ({width, value, onChange}) => {

  const [location, setLocation] = useState(value || {});

  return (
    <div style={{flexGrow: 1, display: 'flex',alignItems:'center'}}>
      <Note maxWidth='70%' style={{width}} >
        {location && location.address}
      </Note>
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
