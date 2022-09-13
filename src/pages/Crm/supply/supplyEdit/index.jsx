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
      value={false}
      {...other}
      ref={formRef}
      api={ApiConfig}
      fieldKey="supplyId"
      onSubmit={(value) => {
        const brandIds = value.brandIds || [];
        return {...value, customerId, brandIds: brandIds.length > 0 ? brandIds : [0]};
      }}
    >
      <FormItem initialValue={value && value.skuId} label="物料" name="skuId" component={SysField.SkuId} required />
      <FormItem initialValue={(value && value.brandId) ? [value.brandId] : []} label="品牌" name="brandIds" component={SysField.BrandId} />
    </Form>
  );
};

export default SupplyEdit;
