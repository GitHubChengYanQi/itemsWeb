/**
 * 微信小程序配置表（对应租户）字段配置页
 *
 * @author Captain_Jazz
 * @Date 2023-04-25 09:53:02
 */

import React from 'react';
import {Input,InputNumber,TimePicker,DatePicker,Select as AntdSelect,Checkbox,Radio} from 'antd';
import Tree from '@/components/Tree';
import Cascader from '@/components/Cascader';
import Select from '@/components/Select';
import * as apiUrl from '../wxMaConfigUrl';

export const TenantId = (props) =>{
  return (<Input {...props}/>);
};
export const Appid = (props) =>{
  return (<Input {...props}/>);
};
export const Secret = (props) =>{
  return (<Input {...props}/>);
};
export const AesKey = (props) =>{
  return (<Input {...props}/>);
};
export const Token = (props) =>{
  return (<Input {...props}/>);
};
export const MsgDataFormat = (props) =>{
  return (<Input {...props}/>);
};
export const Display = (props) =>{
  return (<Input {...props}/>);
};
export const CreateUser = (props) =>{
  return (<Input {...props}/>);
};
export const UpdateUser = (props) =>{
  return (<Input {...props}/>);
};
export const CreateTime = (props) =>{
  return (<Input {...props}/>);
};
export const UpdateTime = (props) =>{
  return (<Input {...props}/>);
};
export const DeptId = (props) =>{
  return (<Input {...props}/>);
};
