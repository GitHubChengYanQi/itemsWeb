/**
 * 项目表编辑页
 *
 * @author cheng
 * @Date 2021-07-19 15:13:58
 */

import React, {useImperativeHandle, useRef, useState} from 'react';
import Form from '@/components/Form';
import {
  businessDetail,
  businessAdd,
  businessEdit,
} from '../../../BusinessUrl';

import * as SysField from '../../../BusinessField';
import {Button, Col, Divider, Row} from 'antd';
import ProCard from '@ant-design/pro-card';
import Title from '@/components/Title';
import {InternalFieldList as FieldList} from '@formily/antd';
import {Switch} from '@alifd/next';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';


const {FormItem} = Form;

const ApiConfig = {
  view: businessDetail,
  add: businessAdd,
  save: businessEdit
};

const TableDetailEdit = (props,ref) => {

  const formRef = useRef(null);
  const [result, setResult] = useState(props.value);

  const [user,setUser] = useState();

  const height = () => {
    if (window.document.body.clientHeight < 1088) {
      return 'calc(100vh - 206px)';
    }
    return 450;
  };


  useImperativeHandle(ref, () => ({
    formRef,
  }));

  return (

    <Form
      noButton
      {...props}
      value={result}
      ref={formRef}
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
      <div style={{paddingRight: 10, height: height(), overflow: 'auto'}}>
        <ProCard style={{marginTop: 8}} title={<Title title="基本信息" level={4} />} headerBordered>
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
            user={(value)=>{
              setUser(value);
            }}
            rules={[{required: true, message: '请输入已存在的客户!'}]}
          /> }
          <FormItem
            label="负责人"
            name="person"
            rules={[{required: true, message: '请输入负责人!'}]}
            component={SysField.PersonListSelect}
            user={user || null}
            required />
          <FormItem label="机会来源" name="originId" component={SysField.OrgNameListSelect} />
          <FormItem label="商机金额" name="opportunityAmount" component={SysField.OpportunityAmountListSelect3} />
          <FormItem label="立项日期" name="time" component={SysField.TimeListSelect2} />
          <FormItem
            display={false}
            name="salesId"
            rules={[{required: true, message: '请输入销售流程!'}]}
            component={SysField.SalesIdListSelect} value={props.stage !== null ? props.stage : 1} />

        </ProCard>
      </div>
    </Form>
  );
};

export default React.forwardRef(TableDetailEdit);
