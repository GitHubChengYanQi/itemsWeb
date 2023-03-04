/**
 * 编码规则和模块的对应关系字段配置页
 *
 * @author song
 * @Date 2021-10-25 14:05:08
 */

import React from 'react';
import {Input,InputNumber,TimePicker,DatePicker,Select as AntdSelect,Checkbox,Radio} from 'antd';
import Tree from '@/components/Tree';
import Cascader from '@/components/Cascader';
import Select from '@/components/Select';
import * as apiUrl from '../rulesRelationUrl';

export const CodingRulesId = (props) =>{
  return (<Input {...props}/>);
};
export const ModuleId = (props) =>{
  return (<Input {...props}/>);
};
