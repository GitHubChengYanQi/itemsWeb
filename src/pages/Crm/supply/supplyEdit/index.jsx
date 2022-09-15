/**
 * 供应商供应物料编辑页
 *
 * @author song
 * @Date 2021-12-20 10:08:44
 */

import React, {useRef} from 'react';
import Form from '@/components/Form';
import {supplyDetail, supplyAdd, supplyEdit} from '../supplyUrl';
import * as SysField from '../supplyField';
import {isArray} from '@/util/Tools';

const {FormItem} = Form;

const ApiConfig = {
  view: supplyDetail,
  add: supplyAdd,
  save: supplyEdit
};

const SupplyEdit = ({...props}) => {

  const {customerId, brandIds, value, ...other} = props;

  const formRef = useRef();

  return (
    <Form
      value={value ? value.supplyId : false}
      {...other}
      ref={formRef}
      api={ApiConfig}
      fieldKey="supplyId"
      onSubmit={(values) => {
        return {...values, customerId, brandIds: isArray(values.brandIds).length > 0 ? values.brandIds : [0]};
      }}
    >
      <FormItem
        initialValue={value && value.skuId}
        label="物料"
        name="skuId"
        component={SysField.SkuId}
        required
        skuDetail={async (res) => {
          const model = await formRef.current.getFieldValue('supplierModel');
          if (!model && res) {
            formRef.current.setFieldValue('supplierModel', res.skuName);
          }
        }}
      />
      <FormItem
        initialValue={(value && value.brandId) ? [value.brandId] : []}
        label="品牌"
        name="brandIds"
        component={SysField.BrandId}
        required
      />
      <FormItem label="供应商型号" name="supplierModel" component={SysField.Model} />
    </Form>
  );
};

export default SupplyEdit;
