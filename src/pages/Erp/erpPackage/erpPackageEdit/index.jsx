/**
 * 套餐表编辑页
 *
 * @author qr
 * @Date 2021-08-04 11:01:43
 */

import React, {useRef, useState} from 'react';
import {Button, Col, Input, Row, Steps} from 'antd';
import Form from '@/components/Form';
import {erpPackageDetail, erpPackageAdd, erpPackageEdit} from '../erpPackageUrl';
import * as SysField from '../erpPackageField';
import TableDetail from "@/pages/Erp/erpPackage/erpPackageEdit/components/TableDetail";
import FormIndex from "@/components/Form/FormIndex";
import ErpPackageTableList from "@/pages/Erp/erpPackageTable/erpPackageTableList";

const {FormItem} = Form;

const ApiConfig = {
  view: erpPackageDetail,
  add: erpPackageAdd,
  save: erpPackageEdit
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
          <FormIndex
            {...props}
            value={result}
            ref={formRef}
            api={ApiConfig}
            fieldKey="packageId"
            success={(result) => {
              if(result.data !== ''){
                setResult(result.data);
              }
              next();
            }}
          >
            <FormItem label="套餐名称" name="productName"
              component={SysField.productName}
              rules= {[{ required: true, message: '请输入套餐名称!' }]} required/>
            <div style={{textAlign:'center'}}>
              <Button type="primary" htmlType="submit">
                下一步
              </Button>
            </div>
          </FormIndex>
        </>
    },
    {
      title: '套餐明细',
      content:
        <>
          <div style={{padding: '10px 50px'}}>
            <ErpPackageTableList value={result} />
            <div style={{textAlign:'center'}}>
              <Button type="primary" onClick={()=>{
                props.onSuccess();
              }
              }>
                保存
              </Button>
              <Button onClick={()=> prev()}>
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
