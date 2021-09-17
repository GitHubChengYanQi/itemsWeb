/**
 * 项目表编辑页
 *
 * @author cheng
 * @Date 2021-07-19 15:13:58
 */

import React, { useRef, useState} from 'react';
import {Button,} from 'antd';
import Form from '@/components/Form';
import {useRequest} from '@/util/Request';
import {
  businessDetail,
  businessAdd,
  businessEdit,
} from '../BusinessUrl';

import * as SysField from '../BusinessField';


const {FormItem} = Form;

const ApiConfig = {
  view: businessDetail,
  add: businessAdd,
  save: businessEdit
};

const BusinessEdit = (props) => {

  const tableRef = useRef(null);
  const [result, setResult] = useState(props.value);

  const {run} = useRequest({url: '/customer/detail', method: 'POST'}, {manual: true,
    onSuccess: (response) => {
    }});

  return (

    <Form
      {...props}
      value={result}
      ref={tableRef}
      api={ApiConfig}
      fieldKey="businessId"
      onSuccess={(result) => {
        if (!props.value) {
          setResult(result.data);
          props.onChange(result);
        }else{
          props.onSuccess();
        }
      }}

    >
      <FormItem
        label="项目名称"
        name="businessName"
        rules={[{required: true, message: '请输入项目名称!'}]}
        component={SysField.BusinessNameListSelect}
        required />
      {props.value ? <FormItem
        label="客户名称"
        name="customerId"
        show={props.value}
        component={SysField.CustomerNameSelect}
        rules={[{required: true, message: '请输入已存在的客户!'}]}
      /> : <FormItem
        label="客户名称"
        name="customerId"
        show={props.value}
        component={SysField.CustomerNameListSelect}
        user={(value) => {
          if (value) {
            run({data: {customerId: value}});
          }
        }}
        // value={customerId}
        rules={[{required: true, message: '请输入已存在的客户!'}]}
      /> }
      <FormItem
        label="负责人"
        name="person"
        rules={[{required: true, message: '请输入负责人!'}]}
        component={SysField.PersonListSelect}
        required />
      <FormItem label="机会来源" name="originId" component={SysField.OrgNameListSelect} />
      <FormItem label="商机金额" name="opportunityAmount" component={SysField.OpportunityAmountListSelect3} />
      <FormItem label="立项日期" name="time" component={SysField.TimeListSelect2} />
      <FormItem
        style={{display : 'none'}}
        name="salesId"
        rules={[{required: true, message: '请输入销售流程!'}]}
        component={SysField.SalesIdListSelect} value={props.stage !== null ? props.stage : 1} />
      <div style={{textAlign: 'Right', marginRight: 50}}>
        <Button type="primary" htmlType="submit" onSubmit={()=>{}}  >
          完成创建
        </Button>
      </div>
    </Form>
  );
};

export default BusinessEdit;
