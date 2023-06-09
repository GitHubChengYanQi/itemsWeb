/**
 * 行业表编辑页
 *
 * @author
 * @Date 2021-08-02 08:25:03
 */

import React, {useRef} from 'react';
import {createFormActions} from '@formily/antd';
import Form from '@/components/Form';
import {crmIndustryDetail, crmIndustryAdd, crmIndustryEdit} from '../crmIndustryUrl';
import * as SysField from '../crmIndustryField';

const {FormItem} = Form;

const formActionsPublic = createFormActions();

const ApiConfig = {
  view: crmIndustryDetail,
  add: crmIndustryAdd,
  save: crmIndustryEdit
};

const CrmIndustryEdit = ({...props}) => {

  const formRef = useRef();

  return (
    <Form
      {...props}
      ref={formRef}
      formActions={formActionsPublic}
      api={ApiConfig}
      fieldKey="industryId"
    >
      <FormItem label="上级" name="parentId" component={SysField.ParentId} />
      <FormItem label="行业名称" name="industryName" component={SysField.IndustryName} required/>
      <FormItem label="排序" name="sotr" component={SysField.Sort}/>
    </Form>
  );
};

export default CrmIndustryEdit;
