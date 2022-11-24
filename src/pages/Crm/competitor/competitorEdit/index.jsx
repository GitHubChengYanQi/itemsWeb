/**
 * 编辑页
 *
 * @author
 * @Date 2021-09-07 09:50:09
 */

import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import ProCard from '@ant-design/pro-card';
import {createFormActions} from '@formily/antd';
import Form from '@/components/Form';
import {competitorDetail, competitorAdd, competitorEdit} from '../competitorUrl';
import * as SysField from '../competitorField';
import store from '@/store';

const {FormItem} = Form;

const ApiConfig = {
  view: competitorDetail,
  add: competitorAdd,
  save: competitorEdit
};

const formActionsPublic = createFormActions();

const CompetitorEdit = ({onChange, ...props}, ref) => {

  const {value} = props;
  const {position} = props;
  const formRef = useRef();

  const [data] = store.useModel('dataSource');

  useImperativeHandle(ref, () => ({
    formRef,
  }));

  return (
    <div style={{height: '100%'}}>
      <Form
        {...props}
        value={value ? value.competitorId : false}
        ref={formRef}
        noButton
        api={ApiConfig}
        formActions={formActionsPublic}
        onSuccess={(res) => {
          position && typeof position === 'function' && position(res);
          onChange && typeof onChange === 'function' && onChange(res);
          props.onSuccess();
        }}
        fieldKey="competitorId"
      >
        <div style={{height: '100%', overflow: 'auto'}}>
          <ProCard
            title="详细信息"
            headerBordered
          >
            <FormItem label="竞争对手企业名称" name="name" dis={props.value || null} component={SysField.Name} required />
            <FormItem
              label="竞争项目名称"
              name="businessId"
              component={SysField.BusinessId}
              required
              value={value && value.crmBusinessList && value.crmBusinessList.length > 0 && value.crmBusinessList[0].businessId} />
            <FormItem label="地区" name="region" options={data && data.area} component={SysField.Region} />
            <FormItem label="创立日期" name="creationDate" component={SysField.CreationDate} />
            <FormItem label="联系电话" name="phone" component={SysField.Phone} rules={[{
              message: '请输入正确的手机号码!',
              pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
            }]} />
            <FormItem label="网址 " name="url" component={SysField.Url} rules={[{
              message: '请输入正确的网址',
              pattern: '^(http(s)?:\\/\\/)?(www\\.)?[\\w-]+\\.(com|net|cn)$'
            }]} />
            <FormItem label="邮箱" name="email" component={SysField.Email} rules={[{
              message: '请输入正确的邮箱',
              pattern: '^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z0-9]{2,6}$'
            }]} />

            <FormItem label="竞争级别" name="competitionLevel" component={SysField.CompetitionLevel} required />
            <FormItem label="年销售" name="annualSales" component={SysField.AnnualSales} />
            <FormItem label="备注" name="companyProfile" component={SysField.CompanyProfile} />
          </ProCard>
        </div>
      </Form>
    </div>
  );
};

export default forwardRef(CompetitorEdit);
