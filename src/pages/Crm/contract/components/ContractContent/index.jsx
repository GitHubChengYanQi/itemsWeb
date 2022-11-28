import React, {useImperativeHandle, useRef} from 'react';
import Form from '@/components/Form';
import * as SysField from '@/pages/Crm/contract/ContractField';
import {contractAdd, contractDetail, contractEdit} from '@/pages/Crm/contract/ContractUrl';
import {createFormActions} from '@formily/antd';

const ApiConfig = {
  view: contractDetail,
  add: contractAdd,
  save: contractEdit
};

const {FormItem} = Form;

const formActionsPublic = createFormActions();

const ContractContent = ({value,...props},ref) => {

  const formRef = useRef();

  useImperativeHandle(ref,()=>({
    submit:formRef.current.submit,
  }));

  return <>
    <Form
      {...props}
      value={value.contractId }
      formActions={formActionsPublic}
      ref={formRef}
      api={ApiConfig}
      noButton
      fieldKey="contractId"
      onSuccess={() => {
        props.onSuccess();
      }}
    >
      <FormItem name="content" component={SysField.Content} result={value} required />
    </Form>
  </>;
};

export default React.forwardRef(ContractContent);
