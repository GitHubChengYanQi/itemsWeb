import {Input, Select} from 'antd';
import React, {useState} from 'react';

export const Money = ({value={}, onChange}) => {

  return <Input.Group>
    <Input
      onChange={(e)=>{
        onChange({...value,min:e.target.value});
      }}
      style={{
        width: 100,
        textAlign: 'center',
      }}
      placeholder="最小"
    />
    <Input
      className="site-input-split"
      style={{
        width: 30,
        borderLeft: 0,
        borderRight: 0,
        pointerEvents: 'none',
      }}
      placeholder="~"
      disabled
    />
    <Input
      onChange={(e)=>{
        onChange({...value,max:e.target.value});
      }}
      className="site-input-right"
      style={{
        width: 100,
        textAlign: 'center',
      }}
      placeholder="最大"
    />
  </Input.Group>;
};

export const Status = ({value, onChange}) => {
  return <Select
    options={[
      {label: '已作废', value: 50},
      {label: '未作废', value: 0},
    ]}
    value={value}
    onChange={(value) => {
      onChange(value);
    }}
    placeholder="订单状态"
    style={{
      width: 100,
      marginRight: 16
    }}
    allowClear
  />;
};


export const RequestFundStatus = ({value, onChange}) => {
  return <Select
    options={[
      {label: '审批中', value: 1},
      {label: '已通过', value: 2},
      {label: '已驳回', value: 3},
      {label: '已撤销', value: 4},
      {label: '通过后撤销', value: 6},
      {label: '已删除', value: 7},
      {label: '已支付', value: 10},
      {label: '已完成', value: 99},
    ]}
    value={value}
    onChange={(value) => {
      onChange(value);
    }}
    placeholder="订单状态"
    style={{
      width: 100,
      marginRight: 16
    }}
    allowClear
  />;
};
