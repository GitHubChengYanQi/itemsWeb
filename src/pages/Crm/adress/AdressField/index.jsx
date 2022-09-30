/**
 * 客户地址表字段配置页
 *
 * @author
 * @Date 2021-07-23 10:06:11
 */

import React, {useEffect} from 'react';
import {Input, InputNumber} from 'antd';
import AdressMap from '@/pages/Crm/customer/components/AdressMap';
import {useRequest} from '@/util/Request';
import {commonAreaList} from '@/pages/Crm/adress/AdressUrl';
import Cascader from '@/components/Cascader';


export const Location = (props) => {
  return (<Input  {...props} />);
};
export const Longitude = (props) => {
  return (<InputNumber min={0}   {...props} />);
};
export const Latitude = (props) => {
  return (<InputNumber min={0}   {...props} />);
};
export const Region = (props) => {
  const {city, onChange} = props;


  const {run} = useRequest(commonAreaList, {
    manual: true, onSuccess: (res) => {
      onChange(res.length > 0 && res[0].id);
    }
  });


  useEffect(() => {
    if (city){
      run(
        {
          data: {
            title: city
          }
        }
      );
    }
  }, [city]);

  return (<Cascader {...props} />);
};
export const CustomerId = (props) => {

  const {customer, ...other} = props;

  props.onChange(customer);

  return (<Input   {...other} />);
};

export const Map = (props) => {

  return (<AdressMap {...props} />);
};

