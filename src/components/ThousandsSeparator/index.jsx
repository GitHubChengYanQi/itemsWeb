import React from 'react';
import {Statistic} from 'antd';

const ThousandsSeparator = ({value, suffix}) => {


  return <Statistic
    suffix={suffix}
    valueStyle={{fontSize: 14}}
    value={value}
    style={{display: 'inline-block'}}
    precision={2}
  />;
};

export default ThousandsSeparator;
