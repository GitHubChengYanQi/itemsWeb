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
    ...props
  }) => {

  const [number, setNumber] = useState(value);

  return <AntInputNumber
    controls={false}
    min={1}
    style={{width}}
    value={value || number}
    placeholder={placeholder}
    {...props}
    onChange={(value) => {
      onChange(value);
      setNumber(value);
    }}
    onBlur={() => {
      onBlur(number);
    }}
  />;
};

export default InputNumber;
