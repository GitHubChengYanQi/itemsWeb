/**
 * 编码规则分类编辑页
 *
 * @author song
 * @Date 2021-10-22 17:20:05
 */

import React, {useRef} from 'react';
import {Input} from 'antd';
import Form from '@/components/Form';
import {codingRulesClassificationDetail, codingRulesClassificationAdd, codingRulesClassificationEdit} from '../codingRulesClassificationUrl';
import * as SysField from '../codingRulesClassificationField';

const {FormItem} = Form;

const ApiConfig = {
  view: codingRulesClassificationDetail,
  add: codingRulesClassificationAdd,
  save: codingRulesClassificationEdit
};

const CodingRulesClassificationEdit = ({...props}) => {

  const formRef = useRef();

  return (
    <Form
      {...props}
      ref={formRef}
      api={ApiConfig}
      fieldKey="codingRulesClassificationId"
    >
      <FormItem label="分类名称" name="name" component={SysField.Name} required/>
      <FormItem label="排序" name="sort" component={SysField.Sort} required/>
    </Form>
  );
};

export default CodingRulesClassificationEdit;
