/**
 * 单位表编辑页
 *
 * @author cheng
 * @Date 2021-08-11 15:37:57
 */

import React, {useRef} from 'react';
import {createFormActions} from '@formily/antd';
import Form from '@/components/Form';
import {unitDetail, unitAdd, unitEdit} from '../unitUrl';
import * as SysField from '../unitField';

const {FormItem} = Form;

const ApiConfig = {
  view: unitDetail,
  add: unitAdd,
  save: unitEdit
};

const formActionsPublic = createFormActions();

const UnitEdit = ({...props}) => {

  const formRef = useRef();

  return (
    <Form
      {...props}
      ref={formRef}
      formActions={formActionsPublic}
      api={ApiConfig}
      fieldKey="unitId"
    >
      <FormItem label="单位名称" name="unitName" component={SysField.UnitName}
        rules= {[{ required: true, message: '请输入单位名称!' },{message:'不能输入数字!',pattern:'^[\u0391-\uFFE5A-Za-z]+$'}]}
        required/>
    </Form>
  );
};

export default UnitEdit;
