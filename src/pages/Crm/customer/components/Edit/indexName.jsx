import React, {useState} from 'react';
import {Button, Input, Popover} from 'antd';
import {CopyOutlined, EditOutlined} from '@ant-design/icons';


export const EditName = ({value: values, onChange}) => {

  const [value, setValue] = useState(values);
  const [visiable, setVisiable] = useState(false);
  const [show, setShow] = useState();

  return (
    <Popover placement="rightBottom" open={show} onOpenChange={(visible) => {
      setShow(visible);
    }} trigger="hover" content={<>
      <Button type="link" title="编辑名称" icon={<EditOutlined />} onClick={() => {
        setValue(value);
        setVisiable(true);
      }} />
      <Button type="link" title="复制" icon={<CopyOutlined />} onClick={() => {

      }} /></>}>

      {!visiable ?
        <div style={{fontSize: 24, fontWeight: 500, display: 'initial'}}>
          {value}
        </div>
        :
        <Input
          value={value}
          onMouseOver={() => {
            setShow(true);
          }}
          disabled={!visiable}
          bordered={visiable}
          style={{fontSize: 24, fontWeight: 500, display: 'inline', color: '#000'}}
          onChange={(value) => {
            setValue(value.target.value);
          }}
          onBlur={() => {
            setVisiable(false);
            typeof onChange === 'function' && onChange(value);
            setVisiable(false);
          }} />
      }
    </Popover>
  );
};
