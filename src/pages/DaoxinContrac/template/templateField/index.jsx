/**
 * 合同模板字段配置页
 *
 * @author
 * @Date 2021-07-21 08:22:02
 */

import React from 'react';
import {Input,InputNumber,TimePicker,DatePicker,Select as AntdSelect,Checkbox,Radio} from 'antd';
import Editor from '@/components/Editor';

export const Name = (props) =>{
  return (<Input {...props}/>);
};
export const Content = (props) =>{
  return (<Editor  {...props} />);
};