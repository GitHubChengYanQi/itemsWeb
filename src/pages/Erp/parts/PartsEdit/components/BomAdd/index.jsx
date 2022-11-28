import React, {useImperativeHandle, useRef} from 'react';
import Form from '@/components/Form';
import {partsAdd, partsDetail} from '@/pages/Erp/parts/PartsUrl';
import * as SysField from '@/pages/Erp/parts/PartsField';

const {FormItem} = Form;

const ApiConfig = {
  view: partsDetail,
  add: partsAdd,
  save: partsAdd
};

const BomAdd = ({...props}, ref) => {

  const formRef = useRef(null);

  useImperativeHandle(ref, () => ({
    submit: formRef.current.submit,
  }));

  return (
    <>
      <div style={{padding: 16}}>
        <Form
          {...props}
          ref={formRef}
          noButton
          api={ApiConfig}
          fieldKey="partsId"
          onError={() => {
          }}
          onSuccess={() => {
            props.onSuccess();
          }}
        >

          <FormItem label="设计BOM" name="pid" component={SysField.Pid} required />
          <FormItem label="清单名称" name="standard" component={SysField.Standard} required />
          <FormItem label="备注" name="note" component={SysField.Note} />
        </Form>
      </div>
    </>
  );
};

export default React.forwardRef(BomAdd);
