import React, {useRef} from 'react';
import {Select} from 'antd';
import Form from '@/components/Form';
import {formAdd} from '@/pages/Form/url';

const Add = (props) => {

  const formRef = useRef();

  const options = [
    {label: '采购单', value: 'PO'},
  ];

  return (
    <Form
      {...props}
      ref={formRef}
      api={{
        view: {},
        add: formAdd,
        save: {}
      }}
      fieldKey="styleId"
    >
      <Form.FormItem label="模块" name="formType" component={Select} options={options} required />
    </Form>
  );
};

export default Add;
