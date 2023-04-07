/**
 * 系统租户表字段配置页
 *
 * @author Captain_Jazz
 * @Date 2023-04-07 09:26:48
 */

import React from 'react';
import {Input,InputNumber,TimePicker,DatePicker,Select as AntdSelect,Checkbox,Radio} from 'antd';
import Tree from '@/components/Tree';
import Cascader from '@/components/Cascader';
import Select from '@/components/Select';
import * as apiUrl from '../tenantUrl';

export const Name = (props) =>{
  return (<Input {...props}/>);
};
export const Address = (props) =>{
  return (<Input {...props}/>);
};
export const Email = (props) =>{
  return (<Input {...props}/>);
};
export const Telephone = (props) =>{
  return (<Input {...props}/>);
};
export const CreateTime = (props) =>{
  return (<Input {...props}/>);
};
