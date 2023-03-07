import React, {useState} from 'react';
import {InputNumber as AntInputNumber} from 'antd';
import classNames from 'classnames';
import styles from './index.module.less';

const InputNumber = (
  {
    defaultValue,
    placeholder,
    onBlur = () => {
    },
    value,
    width,
    onChange = () => {
    },
    min,
    max,
    addonAfter,
    addonBefore,
    status,
    precision,
    style = {},
    ...props
  }) => {

  const [number, setNumber] = useState(value);

  return <AntInputNumber
    addonBefore={addonBefore}
    precision={precision}
    defaultValue={defaultValue}
    className={classNames(addonAfter && styles.addonAfter)}
    status={status}
    addonAfter={addonAfter}
    controls={false}
    max={max}
    min={min === undefined ? 1 : min}
    style={{width: width || '100%', ...style}}
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
