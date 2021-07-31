/**
 * 联系人表编辑页
 *
 * @author
 * @Date 2021-07-23 10:06:12
 */

import React, {useRef} from 'react';
import Form from '@/components/Form';
import * as SysField from '@/pages/Crm/contacts/ContactsField';
import {contactsAdd, contactsDetail, contactsEdit} from '@/pages/Crm/contacts/contactsUrl';
import FormIndex from '@/components/Form/FormIndex';
import {Reset, Submit} from '@formily/antd';

const {FormItem} = Form;

const ApiConfig = {
  view: contactsDetail,
  add: contactsAdd,
  save: contactsEdit
};

const Index = ({...props}) => {

  const formRef = useRef();

  return (
    <Form
      {...props}
      ref={formRef}
      api={ApiConfig}
      fieldKey="contactsId"
    >
      <FormItem label="联系人姓名" name="contactsName" component={SysField.ContactsName} required/>
      <FormItem label="职务" name="job" component={SysField.Job} required/>
      <FormItem label="联系电话" name="phone" component={SysField.Phone} required/>
      <FormItem label="部门编号" name="deptId" component={SysField.DeptId} required/>
    </Form>
  );
};

export default Index;
