import React, {useImperativeHandle, useRef, useState} from 'react';
import {Spin} from 'antd';
import {FormEffectHooks} from '@formily/antd';
import Form from '@/components/Form';
import Coding from '@/pages/Erp/tool/components/Coding';
import {AllField, TemplateId} from '@/pages/Order/CreateOrder/components/Field';
import {useRequest} from '@/util/Request';
import {templateGetLabel} from '@/pages/Crm/template/TemplateUrl';

const ApiConfig = {
  view: {},
  add: {url: '/order/updateContract', method: 'POST'},
  save: {}
};

const {FormItem} = Form;

const CreateContract = ({
  value,
  onSuccess = () => {
  }
}, ref) => {

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    submit: formRef.current.submit,
  }));

  const {loading, data, run} = useRequest(templateGetLabel, {manual: true});

  const [allField, setAllField] = useState([]);

  return <div style={{padding: 24,minWidth:500}}>
    <Form
      NoButton={false}
      value={false}
      ref={formRef}
      api={ApiConfig}
      fieldKey="deliveryId"
      effects={() => {
        FormEffectHooks.onFieldValueChange$('templateId').subscribe(({value}) => {
          if (value) {
            run({
              params: {templateId: value}
            });
          }
        });
      }}
      onSubmit={(values) => {
        return {
          orderId: value,
          contractParam: {
            templateId: values.templateId,
            coding: values.contractCoding,
            labelResults: allField,
          }
        };
      }}
      onSuccess={onSuccess}
    >
      <FormItem label="合同编码" name="contractCoding" component={Coding} />
      <FormItem label="合同模板" name="templateId" component={TemplateId} required />
      <Spin spinning={loading} tip="正在加载合同变量，请稍后...">
        <AllField array={loading ? [] : data} onChange={setAllField} value={allField} />
      </Spin>
    </Form>
  </div>;
};

export default React.forwardRef(CreateContract);
