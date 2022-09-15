import React, {useState} from 'react';
import {Popover} from 'antd';
import DatePicker from '@/components/DatePicker';

const DateEdit = ({value,onChange,disabledDate}) => {

  const [change, setChange] = useState(value);
  const [visiable, setVisiable] = useState();

  return (
    <div style={{display: 'inline-block', cursor: 'pointer'}}>
      <Popover placement="bottom" open={visiable} onOpenChange={(value) => {
        setVisiable(value);
      }} trigger="click" content={<DatePicker value={change} disabledDate={disabledDate} onChange={(value,dateString)=>{
        setChange(value);
        setVisiable(false);
        typeof onChange === 'function' && onChange(value);
      }} />} >
        {change || '未填写'}
      </Popover>
    </div>
  );
};

export default DateEdit;
