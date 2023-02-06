import React, {useEffect, useState} from 'react';
import {Select} from 'antd';
import {useRequest} from '@/util/Request';
import {customerIdSelect} from '@/pages/Erp/order/OrderUrl';

const Choose = ({type, value, width,placeholder, onChange}) => {

  const [options, setOptions] = useState([]);

  const {run: customerRun} = useRequest(
    customerIdSelect,
    {
      manual: true,
      onSuccess: (res) => {
        setOptions(res && res.map((items) => {
          return {
            label: items.label,
            value: items.label
          };
        }));
      }
    });


  useEffect(() => {
    switch (type) {
      case 'customer':
        customerRun({});
        break;
      default:
        break;
    }
  }, []);



  return <Select
    style={{width: width || 200}}
    value={value}
    allowClear
    showSearch
    placeholder={placeholder}
    options={options}
    onChange={(value) => {
      typeof onChange === 'function' && onChange(value);
    }} />;


};

export default Choose;
