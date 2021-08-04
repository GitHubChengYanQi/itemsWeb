/**
 * 商机表编辑页
 *
 * @author cheng
 * @Date 2021-07-19 15:13:58
 */

import React, {useRef, useState, useEffect} from 'react';
import {Button, Input, Steps, Row, Col, Table as AntTable} from 'antd';
import Form from '@/components/Form';
import FormIndex from '@/components/Form/FormIndex';
import {
  businessDetail,
  businessAdd,
  businessEdit,
} from '../BusinessUrl';
import * as SysField from '../BusinessField';
import Drawer from "@/components/Drawer";
import Index from "@/pages/Crm/customer/CustomerEdit/components/ContactsEdit";
import TableDetail from "@/pages/Crm/business/BusinessEdit/components/TableDetail";

const {FormItem} = Form;

const ApiConfig = {
  view: businessDetail,
  add: businessAdd,
  save: businessEdit
};

const BusinessEdit = ({...props}) => {


  const {Step} = Steps;
  const [result, setResult] = useState(props.value);
  const [current, setCurrent] = React.useState(0);
  const tableRef = useRef(null);
  const ref = useRef(null);
  const formRef = useRef();

  const steps = [
    {
    {
      title: '商机详细信息',
      content:
        <>
          <div style={{margin: '50px 150px'}}>
            <FormIndex
              {...props}
              value={result}
              ref={formRef}
              api={ApiConfig}
              fieldKey="businessId"
              success={(result) => {
                if(!props.value){
                  setResult(result.data);
                }
                next();
              }}
            >
              <FormItem label="商机名称" name="businessName"
              <FormItem label="机会来源" name="originId" component={SysField.OrgNameListSelect} />
              <FormItem label="销售流程" name="salesId"
                rules={[{ required: true, message: '请输入销售流程!' }]}
                component={SysField.SalesIdListSelect} required/>
              <FormItem label="立项日期" name="time" component={SysField.TimeListSelect2} />
              <FormItem label="商机阶段" name="stage"
                rules={[{ required: true, message: '请输入商机阶段!' }]}
                component={SysField.StageListSelect13} required/>
              <FormItem label="商机金额" name="opportunityAmount" component={SysField.OpportunityAmountListSelect3} />
              <FormItem label="商机跟踪" name="opportunityAmount" component={SysField.OpportunityAmountListSelect3} />
              <FormItem label="结单日期" name="opportunityAmount" component={SysField.OpportunityAmountListSelect3} />
              <FormItem label="阶段变更时间" name="opportunityAmount" component={SysField.OpportunityAmountListSelect3} />
              <FormItem label="阶段状态" name="opportunityAmount" component={SysField.OpportunityAmountListSelect3} />
              <FormItem label="产品合计" name="opportunityAmount" component={SysField.OpportunityAmountListSelect3} />
              <FormItem label="立项日期" name="opportunityAmount" component={SysField.OpportunityAmountListSelect3} />
              <FormItem label="产品合计" name="opportunityAmount" component={SysField.OpportunityAmountListSelect3} />


              <div style={{textAlign:'center'}}>
                <Button type="primary" htmlType="submit">
                  下一步
                </Button>
              </div>
            </FormIndex>
          </div>

        </>
    },
    {
      title: '商机明细',
      content:
        <>
          <div style={{margin: '5px 150px'}}>
            <TableDetail value={result}/>
            <Drawer width={800} title="编辑" component={Index} onSuccess={() => {
              tableRef.current.refresh();
              ref.current.close();
            }} ref={ref} />
            <div style={{textAlign:'center'}}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={()=> prev()}>
                返回
              </Button>
            </div>
          </div>
        </>
    }
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <>
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
    </>
  );
};

export default BusinessEdit;
