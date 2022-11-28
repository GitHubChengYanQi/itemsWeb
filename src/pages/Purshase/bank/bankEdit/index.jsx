/**
 * 编辑页
 *
 * @author song
 * @Date 2022-02-24 14:55:10
 */

import React, {useImperativeHandle, useRef} from 'react';
import {createFormActions} from '@formily/antd';
import Form from '@/components/Form';
import {bankDetail, bankAdd, bankEdit} from '../bankUrl';
import * as SysField from '../bankField';

const {FormItem} = Form;

const formActionsPublic = createFormActions();

const ApiConfig = {
  view: bankDetail,
  add: bankAdd,
  save: bankEdit
};

const BankEdit = ({NoButton,...props}, ref) => {

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    submit: formRef.current.submit,
  }));

  return (
    <Form
      {...props}
      ref={formRef}
      formActions={formActionsPublic}
      noButton={!NoButton}
      api={ApiConfig}
      fieldKey="bankId"
    >
      <FormItem label="银行名称" name="bankName" component={SysField.BankName} required />
    </Form>
  );
};

export default React.forwardRef(BankEdit);
