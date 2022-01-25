import React from 'react';
import {Descriptions,} from 'antd';
import InputEdit from '@/pages/Crm/customer/components/Edit/InputEdit';
import {useRequest} from '@/util/Request';
import {customerEdit, CustomerLevelIdSelect, OriginIdSelect} from '@/pages/Crm/customer/CustomerUrl';
import SelectEdit from '@/pages/Crm/customer/components/Edit/SelectEdit';
import DateEdit from '@/pages/Crm/customer/components/Edit/DateEdit';
import moment from 'moment';
import TextEdit from '@/pages/Crm/customer/components/Edit/TextEdit';


const Description = (props) => {
  const {data} = props;

  const {data: OriginData} = useRequest(OriginIdSelect);

  const {run} = useRequest(customerEdit, {manual: true});
  if (data) {
    return (
      <>
        <Descriptions column={2} bordered labelStyle={{width: 120}}>
          <Descriptions.Item label="统一社会信用代码">{data.utscc || <InputEdit value={data.utscc} onChange={async (value) => {
            await run({
              data: {
                customerId: data.customerId,
                utscc: value
              }
            });
          }} />}</Descriptions.Item>
          <Descriptions.Item label="公司类型">{data.companyType ||
          <SelectEdit value={data.companyType} onChange={async (value) => {
            await run({
              data: {
                customerId: data.customerId,
                companyType: value
              }
            });
          }} data={[{value: '有限责任公司（自然人独资）', label: '有限责任公司（自然人独资）'}, {value: '股份有限公司', label: '股份有限公司'}, {
            value: '有限合伙企业',
            label: '有限合伙企业'
          }, {value: '外商独资企业', label: '外商独资企业'}, {value: '个人独资企业', label: '个人独资企业'}, {
            value: '国有独资公司',
            label: '国有独资公司'
          }, {value: '其他类型', label: '其他类型'}]} />}</Descriptions.Item>
          <Descriptions.Item label="成立时间">{data.setup ||
          <DateEdit
            value={data.setup}
            onChange={async (value) => {
              await run({
                data: {
                  customerId: data.customerId,
                  setup: value
                }
              });
            }}
            disabledDate={(current) => {
              return current && current > moment().endOf('day');
            }} />}</Descriptions.Item>
          <Descriptions.Item label="营业期限">{data.businessTerm ||
          <DateEdit
            value={data.businessTerm}
            onChange={async (value) => {
              await run({
                data: {
                  customerId: data.customerId,
                  businessTerm: value
                }
              });
            }}
            disabledDate={(current) => {
              return current && current < moment().endOf('day');
            }} />}</Descriptions.Item>
          <Descriptions.Item label="客户来源">
            <SelectEdit
              data={OriginData}
              value={data.originId}
              val={data.originResult && data.originResult.originName}
              onChange={async (value) => {
                await run({
                  data: {
                    customerId: data.customerId,
                    originId: value
                  }
                });
              }} /></Descriptions.Item>
          <Descriptions.Item label="邮箱">
            <InputEdit
              value={data.emall}
              patter={/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/}
              message="邮箱格式不正确!"
              onChange={async (value) => {
                await run({
                  data: {
                    customerId: data.customerId,
                    emall: value
                  }
                });
              }} />
          </Descriptions.Item>
          <Descriptions.Item span={2} label="网址">
            <InputEdit
              value={data.url}
              patter={/^(http(s)?:\/\/)?(www\.)?[\w-]+\.(com|net|cn)$/}
              message="网址格式不正确!"
              onChange={async (value) => {
                await run({
                  data: {
                    customerId: data.customerId,
                    url: value
                  }
                });
              }} />
          </Descriptions.Item>
          <Descriptions.Item span={2} label="公司简介">
            <TextEdit value={data.introduction} onChange={async (value) => {
              run({
                data: {
                  customerId: data.customerId,
                  introduction: value
                }
              });
            }} /></Descriptions.Item>
          <Descriptions.Item span={2} label="备注">
            <TextEdit
              value={data.note}
              onChange={async (value) => {
                run({
                  data: {
                    customerId: data.customerId,
                    note: `${value}`
                  }
                });
              }} /></Descriptions.Item>
        </Descriptions>
      </>
    );
  } else {
    return null;
  }

};
export default Description;
