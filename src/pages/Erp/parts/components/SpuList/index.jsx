import * as SysField from '@/pages/Erp/parts/PartsField';
import React from 'react';
import Form from '@/components/Form';

const {FormItem} = Form;

const SpuList = ({spuLabel,style, skuLabel, spuName, skusName}) => {

  return (
    <>
      <div style={style || {display:'inline-block'}}>
        <FormItem
          labelCol={7}
          label={spuLabel}
          name={spuName}
          component={SysField.SpuId}
          required
        />
      </div>
      <div style={style || {display:'inline-block'}}>
        <FormItem
          labelCol={7}
          label={skuLabel}
          name={skusName}
          component={SysField.Remake}
        />
      </div>
    </>
  );
};

export default SpuList;
