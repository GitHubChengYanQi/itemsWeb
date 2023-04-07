/**
 * 系统租户表编辑页
 *
 * @author Captain_Jazz
 * @Date 2023-04-07 09:26:48
 */

import React, {useRef} from 'react';
import Form from '@/components/Form';
import {tenantDetail, tenantAdd, tenantEdit} from '../tenantUrl';
import * as SysField from '../tenantField';

const {FormItem} = Form;

const ApiConfig = {
  view: tenantDetail,
  add: tenantAdd,
  save: tenantEdit
};

const TenantEdit = ({...props}) => {

  const formRef = useRef();

  return (
    <Form
      {...props}
      ref={formRef}
      api={ApiConfig}
      fieldKey="tenantId"
    >
      <FormItem label="租户名称" name="name" component={SysField.Name} required/>
      <FormItem label="租户地址" name="address" component={SysField.Address}/>
      <FormItem label="租户邮箱" name="email" component={SysField.Email}/>
      <FormItem label="联系方式" name="telephone" component={SysField.Telephone}/>
    </Form>
  );
};

export default TenantEdit;
