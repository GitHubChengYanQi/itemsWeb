/**
 * 出库表编辑页
 *
 * @author song
 * @Date 2021-07-17 10:46:08
 */

import React, {useRef, useState} from 'react';
import {createFormActions, FormEffectHooks} from '@formily/antd';
import {useRequest} from '@/util/Request';
import Form from '@/components/Form';
import {outstockDetail, outstockAdd, outstockEdit} from '../OutstockUrl';
import * as SysField from '../OutstockField';

const {FormItem} = Form;
const {onFieldValueChange$} = FormEffectHooks;

const ApiConfig = {
  view: outstockDetail,
  add: outstockAdd,
  save: outstockEdit
};

const OutstockEdit = ({...props}) => {

  const formRef = useRef();

  const {value,sourhouse} = props;

  const {data, run} = useRequest({url: '/stock/listAll', method: 'POST', data: {storehouseId: sourhouse}});

  const {data: itemData, run: itemRun} = useRequest({
    url: '/stock/listAll',
    method: 'POST',
    data: {storehouseId: sourhouse, itemId: value.itemId}
  });
  const {data: brandData, run: brandRun} = useRequest({
    url: '/stock/listAll',
    method: 'POST',
    data: {storehouseId: sourhouse, itemId: value.itemId, brandId: value.brandId}
  });

  const [storehouse, setStorehouse] = useState(sourhouse);
  const [item, setItem] = useState();

  const [state, setState] = useState();

  return (
    <Form
      {...props}
      value={value.outstockId || false}
      ref={formRef}
      api={ApiConfig}
      fieldKey="outstockId"
      effects={() => {
        const {setFieldState} = createFormActions();
        onFieldValueChange$('storehouseId').subscribe(({value}) => {
          setFieldState('itemId', state => {
            state.visible = value;
          });
        });
        onFieldValueChange$('itemId').subscribe(({value}) => {
          setFieldState('brandId', state => {
            state.visible = value;
          });
        });
      }}
    >
      <FormItem
        label="产品名称"
        initialValue={false}
        name="itemId"
        state={state}
        component={SysField.ItemIdSelect}
        storehouseid={data || null}
        itemid={async (value) => {
          setItem(value);
          await itemRun(
            {
              data: {
                storehouseId: storehouse,
                itemId: value,
              }
            }
          );
        }} required />
      <FormItem
        label="出库品牌"
        initialValue={false}
        name="brandId"
        component={SysField.BrandId} state={state}
        storehouseid={itemData || null}
        brandid={async (value) => {
          await brandRun(
            {
              data: {
                storehouseId: storehouse,
                itemId: item,
                brandId: value
              }
            }
          );
        }} required />
      <FormItem
        label="出库数量"
        name="number"
        component={SysField.Number}
        number={brandData || null}
        rules={[{required: true, message: '数量超出!'}]}
      />
      <div style={{height: 0}}>
        <FormItem
          hidden
          name="outstockOrderId"
          component={SysField.OutstockOrder}
          OutstockOrder={props.outstockOrderId}
          required />
      </div>
    </Form>
  );
};

export default OutstockEdit;
