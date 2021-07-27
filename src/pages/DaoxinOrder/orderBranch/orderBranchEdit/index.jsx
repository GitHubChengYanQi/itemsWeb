/**
 * 订单分表编辑页
 *
 * @author ta
 * @Date 2021-07-20 16:22:28
 */

import React, {useRef} from 'react';
import {Input} from 'antd';
import Form from '@/components/Form';
import {orderBranchDetail, orderBranchAdd, orderBranchEdit} from '../orderBranchUrl';
import * as SysField from '../orderBranchField';

const {FormItem} = Form;

const ApiConfig = {
  view: orderBranchDetail,
  add: orderBranchAdd,
  save: orderBranchEdit
};

const OrderBranchEdit = ({...props}) => {

  const formRef = useRef();

  return (
    <Form
      {...props}
      ref={formRef}
      api={ApiConfig}
      fieldKey="id"
    >

      <FormItem label="物品id" name="itemId" component={SysField.ItemId} required/>
      <FormItem label="物品名称" name="name" component={SysField.Name} required/>
      <FormItem label="物品单价" name="price" component={SysField.Price} required/>
    </Form>
  );
};

export default OrderBranchEdit;