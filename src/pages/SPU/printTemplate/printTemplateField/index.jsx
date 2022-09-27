/**
 * 编辑模板字段配置页
 *
 * @author Captain_Jazz
 * @Date 2021-12-28 13:24:55
 */

import React, {useEffect} from 'react';
import {Input, Select as AntdSelect} from 'antd';

export const Type = ({
  value,
  onChange,
  typeChange = () => {
  }
}) => {
  useEffect(() => {
    typeChange(value);
  }, []);
  return (<AntdSelect
    value={value}
    style={{width: 200}}
    options={[
      {label: '实物详情', value: 'PHYSICALDETAIL'},
      {label: '物料详情', value: 'SKU'},
      {label: '库位详情', value: 'POSITIONS'},
    ]}
    onChange={(value) => {
      onChange(value);
      typeChange(value);
    }}
  />);
};
export const Name = (props) => {
  return (<Input {...props} />);
};

export const CreateTime = (props) => {
  return (<Input {...props} />);
};
export const CreateUser = (props) => {
  return (<Input {...props} />);
};
export const UpdateTime = (props) => {
  return (<Input {...props} />);
};
export const UpdateUser = (props) => {
  return (<Input {...props} />);
};
export const Display = (props) => {
  return (<Input {...props} />);
};
export const DeptId = (props) => {
  return (<Input {...props} />);
};
