import React from 'react';
import moment from 'moment';
import {DatePicker as AntDatePicker} from 'antd';
import {isArray} from '@/util/Tools';

const DatePicker = (
  {
    value,
    onChange = () => {
    },
    disabled,
    disabledDate,
    showTime,
    width,
    style,
    picker,
    RangePicker,
    allowClear,
  }) => {

  // currentDate && currentDate < moment().subtract(1, 'days') 禁用今天之前的时间
  // currentDate && currentDate < moment().endOf(1, 'days') 只能选择今天之后的时间

  if (RangePicker) {
    return <AntDatePicker.RangePicker
      allowClear={allowClear}
      disabled={disabled}
      disabledDate={disabledDate}
      style={{...style, width: width || null}}
      value={isArray(value).length > 0 ? [moment(value[0]), moment(value[1])] : []}
      showTime={showTime}
      onChange={(date, dateString = []) => {
        const dates = dateString.filter(item => item);
        onChange(dates.length === 0 ? [] : [moment(dateString[0]).format('YYYY/MM/DD HH:mm:ss'), moment(dateString[1]).format('YYYY/MM/DD HH:mm:ss')]);
      }}/>;
  }
  return <AntDatePicker
    allowClear={allowClear}
    picker={picker}
    disabled={disabled}
    disabledDate={disabledDate}
    style={{...style, width: width || null}}
    value={value && moment(value)}
    showTime={showTime}
    onChange={(date, dateString) => {
      onChange(dateString ? moment(dateString).format('YYYY/MM/DD HH:mm:ss') : null);
    }}/>;


};

export default DatePicker;
