import React, {useState} from 'react';
import {Button, Input, message as AntMessage, Popover} from 'antd';
import InputNumber from '@/components/InputNumber';

const InputEdit = ({value: values, onChange, patter, message, num}) => {

  const [value, setValue] = useState(values);
  const [change, setChange] = useState(values);
  const [visiable, setVisiable] = useState();

  return (
    <div style={{display: 'inline-block', cursor: 'pointer'}}>
      <Popover visible={visiable} onVisibleChange={(visible) => {
        setVisiable(visible);
      }} placement="bottom" title={
        num ? <InputNumber value={value} onChange={(value) => {
          setValue(value);
        }} /> : <Input value={value} onChange={(value) => {
          setValue(value.target.value);
        }} />
      } content={<Button type="primary" style={{width: '100%'}} onClick={() => {
        if (patter && !patter.test(value)) {
          AntMessage.info(message);
        } else {
          setChange(value);
          setVisiable(false);
          onChange && typeof onChange === 'function' && onChange(value);
        }
      }}>保存</Button>} trigger="click">
        {change || '未填写'}
      </Popover>
    </div>
  );
};

export default InputEdit;
