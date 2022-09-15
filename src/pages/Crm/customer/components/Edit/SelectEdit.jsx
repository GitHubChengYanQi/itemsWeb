import React, {useState} from 'react';
import {Popover, Select} from 'antd';
import Cascader from '@/components/Cascader';


const SelectEdit = ({value: values, val, onChange, data, tree, api}) => {

  const [value, setValue] = useState(values);
  const [change, setChange] = useState(val);
  const [visiable, setVisiable] = useState();

  return (
    <div style={{display: 'inline-block', cursor: 'pointer'}}>
      <Popover placement="bottom" open={visiable} onOpenChange={(valuhe) => {
        setVisiable(valuhe);
      }} trigger="click" content={
        tree ? <Cascader value={value} api={api} onChange={(value, option = []) => {
          setVisiable(false);
          setValue(value);
          setChange(option[option.length - 1] && option[option.length - 1].label);
          typeof onChange === 'function' && onChange(value);
        }} /> : <Select
          value={value}
          style={{width: 200}}
          options={data}
          onSelect={(value, option) => {
            setVisiable(false);
            setValue(value);
            setChange(option.label);
            typeof onChange === 'function' && onChange(value);
          }}
        />}>
        {change || '未填写'}
      </Popover>
    </div>
  );
};

export default SelectEdit;
