import React from 'react';
import {Descriptions, Radio} from 'antd';
import InputEdit from '@/pages/Crm/customer/components/Edit/InputEdit';
import {useRequest} from '@/util/Request';
import {customerEdit, CustomerLevelIdSelect} from '@/pages/Crm/customer/CustomerUrl';
import SelectEdit from '@/pages/Crm/customer/components/Edit/SelectEdit';
import UserEdit from '@/pages/Crm/customer/components/Edit/UserEdit';

const Desc = (props) => {

  const {data, supply, enterprise} = props;

  const {run} = useRequest(customerEdit, {manual: true});
  const {run: runUser} = useRequest({url: '/customer/updateChargePerson', method: 'POST'}, {manual: true});

  const {data: CustomerLevelData} = useRequest(CustomerLevelIdSelect);


  if (data) {

    return (
      <>
        <Descriptions title='基本信息'>
          <Descriptions.Item label="法定代表人"><InputEdit value={data.legal} onChange={async (value) => {
            await run({
              data: {
                customerId: data.customerId,
                legal: value
              }
            });
          }} /></Descriptions.Item>
          {!enterprise && <>
            <Descriptions.Item label={supply ? '供应商级别' : '客户级别'}>
              <SelectEdit
                data={CustomerLevelData}
                value={data.customerLevelId}
                val={data.crmCustomerLevelResult && data.crmCustomerLevelResult.level}
                onChange={async (value) => {
                  await run({
                    data: {
                      customerId: data.customerId,
                      customerLevelId: value
                    }
                  });
                }} /></Descriptions.Item>
            {!supply && <>
              <Descriptions.Item label="客户状态">
                <Radio.Group defaultValue={data.status} onChange={async (value) => {
                  await run({
                    data: {
                      customerId: data.customerId,
                      status: value.target.value
                    }
                  });
                }}>
                  <Radio value={0}>潜在客户</Radio>
                  <Radio value={1}>正式客户</Radio>
                </Radio.Group>
              </Descriptions.Item>
              <Descriptions.Item label="客户分类">
                <Radio.Group defaultValue={data.classification} onChange={async (value) => {
                  await run({
                    data: {
                      customerId: data.customerId,
                      classification: value.target.value
                    }
                  });
                }}>
                  <Radio value={0}>代理商</Radio>
                  <Radio value={1}>终端用户</Radio>
                </Radio.Group>
              </Descriptions.Item>
            </>}
            <Descriptions.Item label="负责人">
              <UserEdit
                userId={data.userId}
                value={data.userResult && data.userResult.name}
                onChange={async (value) => {
                  await runUser({
                    data: {
                      customerId: data.customerId,
                      userId: value
                    }
                  });
                }} /></Descriptions.Item>
          </>}
          <Descriptions.Item label="开户银行">
            {(data.invoiceResult && data.invoiceResult.bankResult) ? data.invoiceResult.bankResult.bankName : '暂无'}
          </Descriptions.Item>
          <Descriptions.Item label="开户行号">{data.invoiceResult ? data.invoiceResult.bankNo : '暂无'}</Descriptions.Item>
          <Descriptions.Item label="开户账号">{data.invoiceResult ? data.invoiceResult.bankAccount : '暂无'}</Descriptions.Item>
        </Descriptions>
      </>
    );
  } else {
    return null;
  }

};

export default Desc;
