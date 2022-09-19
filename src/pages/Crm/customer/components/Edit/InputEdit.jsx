import React, {useState} from 'react';
import {Button, Input, message as AntMessage, Popover} from 'antd';
import InputNumber from '@/components/InputNumber';

const InputEdit = ({
  value: defaultValue,
  onChange,
  patter,
  message,
  num,
  format = (value) => {
    return value;
  }
}) => {

  const [value, setValue] = useState(defaultValue);
  const [change, setChange] = useState(defaultValue);
  const [visiable, setVisiable] = useState();

  return (
    <div style={{display: 'inline-block', cursor: 'pointer'}}>
      <Popover open={visiable} onOpenChange={(visible) => {
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
        {format(change) || '未填写'}
      </Popover>
    </div>
  );
};

export default InputEdit;
