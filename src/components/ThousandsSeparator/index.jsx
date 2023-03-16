import React from 'react';
import {Statistic} from 'antd';

const ThousandsSeparator = ({value, suffix, style = {}, className,prefix}) => {


  return <Statistic
    suffix={suffix}
    prefix={prefix}
    valueStyle={{fontSize: 14}}
    value={value}
    className={className}
    style={{display: 'inline-block', ...style}}
    precision={2}
  />;
};

export default ThousandsSeparator;
