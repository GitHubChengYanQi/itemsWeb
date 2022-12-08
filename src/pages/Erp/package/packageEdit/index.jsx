import React, {useRef, useState} from 'react';
import {Button, Col, Input, Row, Steps} from 'antd';
import Form from '@/components/Form';
import ErpPackageTableList from '@/pages/Erp/packageTable/packageTableList';
import {erpPackageDetail, erpPackageAdd, erpPackageEdit} from '../packageUrl';
import * as SysField from '../packageField';

const {FormItem} = Form;
const ApiConfig = {
  save: erpPackageEdit,
  add: erpPackageAdd,
  view: erpPackageDetail
};

const ErpPackageEdit = ({...props}) => {

  const {Step} = Steps;
  const formRef = useRef();
  const [result, setResult] = useState(props.value);
  const [current, setCurrent] = React.useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);

  };

  const steps = [
    {
      title: '套餐名称',
      content:
        <>
          <Form
            noButton
            {...props}
            value={result}
            ref={formRef}
            api={ApiConfig}
            fieldKey="packageId"
            onSuccess={(result) => {
              if (result.data !== '') {
                setResult(result.data);
              }
              next();
            }}
          >
            <FormItem
              label="套餐名称"
              name="productName"
              component={SysField.productName}
              rules={[{required: true, message: '请输入套餐名称!'}]} required />
            <FormItem
              label="总金额"
              name="money"
              component={SysField.Money} />
            <div style={{textAlign: 'center', marginBottom: 20}}>
              <Button type="primary" htmlType="submit">
                下一步
              </Button>
            </div>
          </Form>
        </>
    },
    {
      title: '套餐明细',
      content:
        <>
          <div style={{padding: '10px 50px'}}>
            <ErpPackageTableList value={result} />
            <div style={{textAlign: 'center'}}>
              <Button type="primary" onClick={() => {
                props.onSuccess();
              }
              }>
                保存
              </Button>
              <Button onClick={() => prev()}>
                返回
              </Button>
            </div>
          </div>
        </>
    },
  ];

  return (
    <>
      <Steps current={current} style={{padding: '10px 50px '}}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
    </>
  );
};

export default ErpPackageEdit;

