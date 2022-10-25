import React from 'react';
import {Input, Radio} from 'antd';
import InputNumber from '@/components/InputNumber';

export const Name = (props) => {
  return (<Input {...props} />);
};
export const Code = (props) => {
  return (<Input {...props} />);
};
export const Governor = (props) => {
  return (<Radio.Group {...props} >
    <Radio value={1}>是</Radio>
    <Radio value={0}>否</Radio>
  </Radio.Group>);
};
export const Remark = (props) => {
  return (<Input {...props} />);
};
export const Sort = (props) => {
  return (<InputNumber min={0} {...props} />);
};
