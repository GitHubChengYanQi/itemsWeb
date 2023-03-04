/**
 * 编码规则和模块的对应关系编辑页
 *
 * @author song
 * @Date 2021-10-25 14:05:08
 */

import React, {useRef} from 'react';
import {Input} from 'antd';
import Form from '@/components/Form';
import {rulesRelationDetail, rulesRelationAdd, rulesRelationEdit} from '../rulesRelationUrl';
import * as SysField from '../rulesRelationField';

const {FormItem} = Form;

const ApiConfig = {
  view: rulesRelationDetail,
  add: rulesRelationAdd,
  save: rulesRelationEdit
};

const RulesRelationEdit = ({...props}) => {

  const formRef = useRef();

  return (
    <Form
      {...props}
      ref={formRef}
      api={ApiConfig}
      fieldKey="rulesRelationId"
    >
      <FormItem label="编码规则id" name="codingRulesId" component={SysField.CodingRulesId} required/>
      <FormItem label="模块id" name="moduleId" component={SysField.ModuleId} required/>
    </Form>
  );
};

export default RulesRelationEdit;
