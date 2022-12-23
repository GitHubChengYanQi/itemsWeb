/**
 * 供应商开票编辑页
 *
 * @author song
 * @Date 2021-12-20 11:29:00
 */

import React, {useImperativeHandle, useRef} from 'react';
import Form from '@/components/Form';
import {invoiceDetail, invoiceAdd, invoiceEdit} from '../invoiceUrl';
import * as SysField from '../invoiceField';

const {FormItem} = Form;

const ApiConfig = {
  view: invoiceDetail,
  add: invoiceAdd,
  save: invoiceEdit
};

const InvoiceEdit = ({...props}, ref) => {

  const {customerId, NoButton, bankId, ...other} = props;

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    submit: formRef.current.submit,
  }));

  return (
    <div style={{padding:16}}>
      <Form
        {...other}
        ref={formRef}
        api={ApiConfig}
        noButton={NoButton}
        fieldKey="invoiceId"
        onSubmit={(value) => {
          return {...value, customerId};
        }}
      >
        <FormItem label="开户银行" name="bankId" value={bankId} component={SysField.Bank} required />
        <FormItem label="开户账号" name="bankAccount" component={SysField.BankAccount} rules={[{
          required: true,
          message: '请输入数字!',
          pattern: '^\\d+$'
        }]} />
        <FormItem label="开户行号" name="bankNo" component={SysField.BankAccount} />
      </Form>
    </div>
  );
};

export default React.forwardRef(InvoiceEdit);
