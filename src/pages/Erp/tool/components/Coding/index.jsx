import React, {useState} from 'react';
import {Input, Select as AntdSelect} from 'antd';
import cookie from 'js-cookie';


const Coding = ({value, onChange, placeholder}) => {

  const [state, setState] = useState(value ? 'defined' : (cookie.get('codingType') || 'defined'));

  const options = [
    {
      label: '自动生成',
      value: 'sys'
    },
    {
      label: '自定义',
      value: 'defined'
    }
  ];

  return (
    <div style={{display: 'flex'}}>
      <AntdSelect
        style={state === 'defined' ? {width: 100, marginRight: 16} : {}}
        value={state}
        options={options}
        onSelect={(value) => {
          cookie.set('codingType', value);
          setState(value);
          onChange(null);
        }}
      />
      {state === 'defined' && <Input value={value} placeholder={placeholder || '请输入自定义编码'} onChange={(value) => {
        onChange(value.target.value);
      }} />}
    </div>
  );
};

export default Coding;
