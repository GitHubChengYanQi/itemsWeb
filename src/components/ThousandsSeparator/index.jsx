import React from 'react';
import {Statistic} from 'antd';
import classNames from 'classnames';
import styles from './index.module.less';

const ThousandsSeparator = ({value, suffix, style = {}, valueStyle = {}, className, prefix, shopNumber}) => {


  return <Statistic
    suffix={suffix}
    prefix={prefix}
    valueStyle={{fontSize: 14, ...valueStyle}}
    value={value}
    className={classNames(className, shopNumber && styles.shopNumber)}
    style={{display: 'inline-block', ...style}}
    precision={2}
  />;
};

export default ThousandsSeparator;
