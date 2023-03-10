import {Input, Space} from 'antd';
import React from 'react';
import InputNumber from '@/components/InputNumber';
import style from '@/pages/Erp/stock/StockField/index.module.less';

const Scope = ({
  value = {},
  onChange = () => {
  },
  placeholder
}) => {

  return <Space size={0}>
    <InputNumber
      min={0}
      className={style.between}
      value={value?.mixNum}
      style={{width: 100, textAlign: 'center'}}
      placeholder={`最小${placeholder}`}
      onChange={(mixNum) => {
        onChange({
          mixNum,
          maxNum: value?.maxNum
        });
      }}
    />
    <Input
      style={{
        width: 30,
        borderLeft: 0,
        borderRight: 0,
        backgroundColor: '#fff',
        pointerEvents: 'none',
      }}
      placeholder="~"
      disabled
    />
    <InputNumber
      className={style.and}
      style={{
        width: 100,
        textAlign: 'center',
      }}
      value={value?.maxNum}
      min={value?.mixNum + 1}
      placeholder={`最大${placeholder}`}
      onChange={(maxNum) => {
        onChange({
          ...(value || {}),
          maxNum
        });
      }}
    />
  </Space>;
};

export default Scope;
