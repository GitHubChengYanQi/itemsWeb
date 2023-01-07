/**
 * 地点表字段配置页
 *
 * @author
 * @Date 2021-07-15 11:13:02
 */

import React from 'react';
import {Input} from 'antd';
import Amap from '@/components/Amap';
import InputNumber from '@/components/InputNumber';

const w = 200;

export const Name = (props) =>{
  return (<Input   {...props}/>);
};
export const Position = (props) =>{
  return (<Input   {...props}/>);
};
export const Palce = (props) =>{
  return (<Input {...props}/>);
};
export const Longitude = (props) =>{
  return (<InputNumber min={0}   {...props}/>);
};
export const Latitude = (props) =>{
  return (<InputNumber min={0}   {...props}/>);
};
export const Measure = (props) =>{
  return (<InputNumber min={0} addonAfter='m²'  {...props}/>);
};
export const Capacity = (props) =>{
  return (<InputNumber min={0} addonAfter='m&nbsp;'  {...props}/>);
};

export const Map = (props) =>{
  return (<Amap {...props}/>);
};

export const Coding = (props) =>{
  return (<Input placeholder='大写字母或数字' {...props}/>);
};
