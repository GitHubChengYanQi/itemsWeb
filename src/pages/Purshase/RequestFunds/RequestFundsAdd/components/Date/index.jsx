import React from 'react';
import {DatePicker} from 'antd';
import moment from 'moment';

const Date = ({showTime, value, onChange}) => {

  return <>
    <DatePicker
      value={value ? moment.unix(value) : null}
      showTime={showTime}
      onChange={(date) => {
        onChange(date ? moment(date).unix() : null);
      }}
    />
  </>;
};

export default Date;
