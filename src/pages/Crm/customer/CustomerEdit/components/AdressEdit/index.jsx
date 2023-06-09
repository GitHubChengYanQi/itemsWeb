/**
 * 客户地址表编辑页
 *
 * @author
 * @Date 2021-07-23 10:06:11
 */

import React, {useRef} from 'react';
import {Input} from 'antd';
import Form from '@/components/Form';
import * as SysField from '@/pages/Crm/adress/AdressField';
import {adressAdd, adressDetail, adressEdit} from '@/pages/Crm/adress/AdressUrl';

const {FormItem} = Form;

const ApiConfig = {
  view: adressDetail,
  add: adressAdd,
  save: adressEdit
};

const Index = ({...props}) => {

  const {customerId} = props;

  const formRef = useRef();

  return (
    <Form
      {...props}
      ref={formRef}
      api={ApiConfig}
      fieldKey="adressId"
    >
      <FormItem label="地址" name="location" component={SysField.Location} required/>
      <FormItem label="经度" name="longitude" component={SysField.Longitude} required/>
      <FormItem label="纬度" name="latitude" component={SysField.Latitude} required/>
      <FormItem hidden customerId={customerId} name="customerId" component={SysField.CustomerId} required/>
    </Form>
  );
};

export default Index;
