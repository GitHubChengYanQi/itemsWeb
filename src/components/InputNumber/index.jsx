import React, {useState} from 'react';
import {InputNumber as AntInputNumber} from 'antd';

const InputNumber = (
  {
    placeholder,
    onBlur = () => {
    },
    value,
    width,
    onChange = () => {
    },
    min,
    addonAfter,
    ...props
  }) => {

  const [number, setNumber] = useState(value);

  return <AntInputNumber
    addonAfter={addonAfter}
    controls={false}
    min={min === undefined ? 1 : min}
    style={{width:width || '100%'}}
    value={value}
    placeholder={placeholder}
    {...props}
    onPressEnter={()=>{
      onBlur(number || value);
    }}
    onChange={(value) => {
      onChange(value);
      setNumber(value);
    }}
    onBlur={() => {
      onBlur(number || value);
    }}
  />;
};

export default InputNumber;
