/**
 * 微信小程序配置表（对应租户）编辑页
 *
 * @author Captain_Jazz
 * @Date 2023-04-25 09:53:02
 */

import React, {useRef} from 'react';
import Form from '@/components/Form';
import {wxMaConfigDetail, wxMaConfigAdd, wxMaConfigEdit} from '../wxMaConfigUrl';
import * as SysField from '../wxMaConfigField';

const {FormItem} = Form;

const ApiConfig = {
  view: wxMaConfigDetail,
  add: wxMaConfigAdd,
  save: wxMaConfigEdit
};

const WxMaConfigEdit = ({...props}) => {

  const formRef = useRef();

  return (
    <Form
      {...props}
      ref={formRef}
      api={ApiConfig}
      fieldKey="wxMaConfigId"
    >
      <FormItem label="appid" name="appid" component={SysField.Appid} required/>
      <FormItem label="secret" name="secret" component={SysField.Secret} required/>
      <FormItem label="aesKey" name="aesKey" component={SysField.AesKey} required/>
      <FormItem label="token" name="token" component={SysField.Token} required/>
      <FormItem label="msgDataFormat" name="msgDataFormat" component={SysField.MsgDataFormat} required/>
    </Form>
  );
};

export default WxMaConfigEdit;
