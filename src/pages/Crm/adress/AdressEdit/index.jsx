/**
 * 客户地址表编辑页
 *
 * @author
 * @Date 2021-07-23 10:06:11
 */

import React, {useImperativeHandle, useRef, useState} from 'react';
import {createFormActions, FormEffectHooks} from '@formily/antd';
import {message} from 'antd';
import Form from '@/components/Form';
import * as SysField from '../AdressField';
import {adressAdd, adressDetail, adressEdit} from '@/pages/Crm/adress/AdressUrl';
import store from '@/store';

const {FormItem} = Form;

const ApiConfig = {
  view: adressDetail,
  add: adressAdd,
  save: adressEdit
};

const formActionsPublic = createFormActions();

const AdressEdit = ({...props}, ref) => {

  const {customer, NoButton, adressType, ...other} = props;

  const formRef = useRef();

  useImperativeHandle(ref, () => (
    {
      submit: formRef.current.submit,
    }
  ));

  const [city, setCity] = useState();

  const {onFieldChange$} = FormEffectHooks;

  const [data] = store.useModel('dataSource');

  return (
    <div style={{padding: 16}}>
      <Form
        {...other}
        ref={formRef}
        formActions={formActionsPublic}
        api={ApiConfig}
        NoButton={NoButton}
        fieldKey="adressId"
        onSubmit={(value) => {
          if (!customer) {
            message.warn('请选择客户！');
            return false;
          }
          return {...value, customerId: customer, type: adressType};
        }}
        onSuccess={(res) => {
          props.onSuccess(res.data);
        }}
        effects={() => {
          onFieldChange$('map').subscribe(({value}) => {
            setCity(value && value.city);
          });
        }}
        onError={() => {
        }}
      >
        <FormItem label="定位地址" name="map" component={SysField.Map} disabled required />
        <FormItem
          label="省市区地址"
          name="region"
          component={SysField.Region}
          city={city}
          options={data && data.area}
          required />
        <FormItem label="详细地址" name="detailLocation" component={SysField.Location} />
        <FormItem label="地址名称" name="addressName" component={SysField.Location} />
      </Form>
    </div>
  );
};

export default React.forwardRef(AdressEdit);
