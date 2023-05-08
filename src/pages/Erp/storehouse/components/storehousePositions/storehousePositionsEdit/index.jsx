/**
 * 仓库库位表编辑页
 *
 * @author song
 * @Date 2021-10-29 09:22:25
 */

import React, {useRef} from 'react';
import Form from '@/components/Form';
import {storehousePositionsDetail, storehousePositionsAdd, storehousePositionsEdit} from '../storehousePositionsUrl';
import * as SysField from '../storehousePositionsField';

const {FormItem} = Form;

const ApiConfig = {
  view: storehousePositionsDetail,
  add: storehousePositionsAdd,
  save: storehousePositionsEdit
};

const StorehousePositionsEdit = ({...props}) => {

  const {storehouse, ...other} = props;

  const formRef = useRef();

  return (
    <Form
      {...other}
      ref={formRef}
      api={ApiConfig}
      fieldKey="storehousePositionsId"
    >
      <div style={{height:0}}>
        <FormItem name="storehouseId" hidden component={SysField.StorehouseId} value={storehouse} required />
      </div>
      <FormItem label="上级" name="pid" component={SysField.Pid} stroehouseId={storehouse} required />
      <FormItem label="库位名称" name="name" component={SysField.Name} required />
      <FormItem label="排序" name="sort" component={SysField.Sort}  />
      <FormItem label="库位说明" name="note" component={SysField.Note} />
    </Form>
  );
};

export default StorehousePositionsEdit;
