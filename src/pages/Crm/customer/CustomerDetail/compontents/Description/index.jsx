import React from 'react';
import {Descriptions,} from 'antd';
import moment from 'moment';
import InputEdit from '@/pages/Crm/customer/components/Edit/InputEdit';
import {useRequest} from '@/util/Request';
import {crmIndustryTreeView, customerEdit, OriginIdSelect} from '@/pages/Crm/customer/CustomerUrl';
import SelectEdit from '@/pages/Crm/customer/components/Edit/SelectEdit';
import DateEdit from '@/pages/Crm/customer/components/Edit/DateEdit';
import TextEdit from '@/pages/Crm/customer/components/Edit/TextEdit';
import ThousandsSeparator from '@/components/ThousandsSeparator';


const Description = (props) => {
  const {data,enterprise} = props;

  const {data: OriginData} = useRequest(OriginIdSelect);

  const {run} = useRequest(customerEdit, {manual: true});

  const edit = (params = {}) => {
    run({data: {customerId: data.customerId,...params}});
  };

  if (data) {
    return (
      <>
        <Descriptions column={2} bordered labelStyle={{width: 200}}>
          <Descriptions.Item label="公司类型">
            <SelectEdit val={data.companyType} value={data.companyType} onChange={async (value) => {
              edit({companyType: value});
            }} data={[{value: '有限责任公司（自然人独资）', label: '有限责任公司（自然人独资）'}, {value: '股份有限公司', label: '股份有限公司'}, {
              value: '有限合伙企业',
              label: '有限合伙企业'
            }, {value: '外商独资企业', label: '外商独资企业'}, {value: '个人独资企业', label: '个人独资企业'}, {
              value: '国有独资公司',
              label: '国有独资公司'
            }, {value: '其他类型', label: '其他类型'}]} />
          </Descriptions.Item>
          <Descriptions.Item label="成立日期">
            <DateEdit
              value={data.setup}
              onChange={async (value) => {
                edit({setup: value});
              }}
              disabledDate={(current) => {
                return current && current > moment().endOf('day');
              }} />
          </Descriptions.Item>
          <Descriptions.Item label="营业期限">
            <DateEdit
              value={data.businessTerm}
              onChange={async (value) => {
                edit({businessTerm: value});
              }}
              disabledDate={(current) => {
                return current && current < moment().endOf('day');
              }} />
          </Descriptions.Item>
          {!enterprise && <Descriptions.Item label="客户来源">
            <SelectEdit
              data={OriginData}
              value={data.originId}
              val={data.originResult && data.originResult.originName}
              onChange={async (value) => {
                edit({originId: value});
              }} />
          </Descriptions.Item>}
          <Descriptions.Item label="注册资本">
            <InputEdit
              num
              format={(value) => {
                if (!value) {
                  return '未填写';
                }
                return <><ThousandsSeparator value={value} />&nbsp;&nbsp;万元</>;
              }}
              value={data.registeredCapital}
              onChange={async (value) => {
                edit({registeredCapital: value});
              }} />
          </Descriptions.Item>
          <Descriptions.Item label="所属行业">
            <SelectEdit
              tree
              api={crmIndustryTreeView}
              value={data.industryId}
              val={data.crmIndustryResult && data.crmIndustryResult.industryName}
              onChange={async (value) => {
                edit({industryId: value});
              }} />
          </Descriptions.Item>
          <Descriptions.Item label="网址">
            <InputEdit
              value={data.url}
              patter={/^(http(s)?:\/\/)?(www\.)?[\w-]+\.(com|net|cn)$/}
              message="网址格式不正确!"
              onChange={async (value) => {
                edit({url: value});
              }} />
          </Descriptions.Item>
          <Descriptions.Item label="企业电话">
            <InputEdit
              value={data.telephone}
              onChange={async (value) => {
                edit({telephone: value});
              }} />
          </Descriptions.Item>
          <Descriptions.Item label="企业传真">
            <InputEdit
              value={data.fax}
              onChange={async (value) => {
                edit({fax: value});
              }} />
          </Descriptions.Item>
          <Descriptions.Item label="邮政编码">
            <InputEdit
              value={data.zipCode}
              onChange={async (value) => {
                edit({zipCode: value});
              }} />
          </Descriptions.Item>
          <Descriptions.Item label="企业邮箱">
            <InputEdit
              value={data.emall}
              patter={/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/}
              message="邮箱格式不正确!"
              onChange={async (value) => {
                edit({emall: value});
              }} />
          </Descriptions.Item>
          <Descriptions.Item label="注册地址">
            <InputEdit
              value={data.signIn}
              onChange={async (value) => {
                edit({signIn: value});
              }} />
          </Descriptions.Item>
          <Descriptions.Item label="统一社会信用代码">
            <InputEdit value={data.utscc} onChange={async (value) => {
              edit({utscc: value});
            }} /></Descriptions.Item>
          <Descriptions.Item label="公司简介">
            <TextEdit value={data.introduction} onChange={async (value) => {
              edit({introduction: value});
            }} /></Descriptions.Item>
          <Descriptions.Item label="备注">
            <TextEdit
              value={data.note}
              onChange={async (value) => {
                edit({note: value});
              }} /></Descriptions.Item>
        </Descriptions>
      </>
    );
  } else {
    return null;
  }

};
export default Description;
