/**
 * 报修编辑页
 *
 * @author siqiang
 * @Date 2021-08-20 17:16:16
 */

import React, {useEffect, useRef} from 'react';
import {Button, Input} from 'antd';
import Form from '@/components/Form';
import {companyAddressDetail, companyAddressAdd, companyAddressEdit, companyAddressList} from '../companyAddressUrl';
import * as SysField from '../companyAddressField';
import {useRequest} from '@/util/Request';
import ProSkeleton from '@ant-design/pro-skeleton';

const {FormItem} = Form;

const ApiConfig = {
  view: companyAddressDetail,
  add: companyAddressAdd,
  save: companyAddressEdit
};

const CompanyAddressEdit = ({...props}) => {

  const {result, onSuccess, prev, done} = props;


  const {loading, data, run} = useRequest({
    url: '/companyAddress/list',
    method: 'POST',
    rowKey: 'companyId',
    data: {
      repairId: result,
      identify: done ? 2 : 1
    }
  });

  useEffect(() => {
    run();
  }, [done]);

  const formRef = useRef();

  if (loading) {
    return <ProSkeleton type="descriptions" />;
  }


  return (
    <Form
      {...props}
      noButton
      value={data.length === 0 ? false : data[0].companyId}
      ref={formRef}
      api={ApiConfig}
      fieldKey="companyId"
    >
      <FormItem label="报修公司" name="customerId" component={SysField.CustomerId} required />
      <FormItem label="省" name="province" component={SysField.Province} required />
      <FormItem label="市" name="city" component={SysField.City} required />
      <FormItem label="区" name="area" component={SysField.Area} required />
      <FormItem label="详细地址" name="address" component={SysField.Address} required />
      <FormItem label="姓名" name="people" component={SysField.People} required />
      <FormItem label="职务" name="position" component={SysField.Position} required />
      <FormItem label="电话" name="telephone" component={SysField.Telephone} required />
      <FormItem hidden name="repairId" component={SysField.RepairId} result={result || null} />
      <FormItem hidden name="identify" component={SysField.Identify} result={done ? 2 : 1 || null} />
      <div style={{textAlign: 'center'}}>
        <Button type="primary" htmlType="submit">
          {done ? '完成' : '下一步'}
        </Button>
        <Button onClick={() => prev()}>
          返回
        </Button>
      </div>

    </Form>
  );
};

export default CompanyAddressEdit;
