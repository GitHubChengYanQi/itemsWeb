import React, {useRef} from 'react';
import {positionAdd, positionSave, positionView} from '@/Config/ApiUrl/system/position';
import Form from '@/components/Form';
import * as SysField from '../PositionField';

const {FormItem} = Form;


const ApiConfig = {
  view: positionView,
  add: positionAdd,
  save: positionSave
};

const PositionForm = (props) => {

  const formRef = useRef();

  return (
    <Form
      {...props}
      ref={formRef}
      api={ApiConfig}
      fieldKey="positionId"
    >
      <FormItem component={SysField.Name} name='name' required label='职位名称'  />
      <FormItem component={SysField.Code} name='code' label="职位编码" required />
      <FormItem component={SysField.Governor} name='governor' label="部门主管" required />
      <FormItem component={SysField.Remark} name='remark' label="备注" />
      <FormItem component={SysField.Sort} name='sort' label="排序" />
    </Form>
  );
};

export default PositionForm;
