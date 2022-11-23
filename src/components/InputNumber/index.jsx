import React, {useState} from 'react';
import {InputNumber as AntInputNumber} from 'antd';
import styles from './index.module.less';
import classNames from 'classnames';

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
    status,
    ...props
  }) => {

  const [number, setNumber] = useState(value);

  return <AntInputNumber
    className={classNames(addonAfter && styles.addonAfter)}
    status={status}
    addonAfter={addonAfter}
    controls={false}
    min={min === undefined ? 1 : min}
    style={{width: width || '100%'}}
    value={value}
    placeholder={placeholder}
    {...props}
    onPressEnter={() => {
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
