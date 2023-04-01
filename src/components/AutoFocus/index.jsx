import React, {useEffect, useRef} from 'react';
import {Input} from 'antd';

const AutoFocus = (
  {
    value,
    placeholder,
    onChange = () => {
    }
  }
) => {

  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <>
    <Input ref={inputRef} value={value} placeholder={placeholder} onChange={onChange} />
  </>;
};

export default AutoFocus;
