import React, {useRef} from 'react';
import {Table as AntTable} from 'antd';
import {createFormActions} from '@formily/antd';
import Form from '@/components/Form';
import * as SysField from '@/pages/Crm/business/crmBusinessSalesProcess/crmBusinessSalesProcessField';
import Table from '@/components/Table';
import Empty from '@/components/Empty';
import Render from '@/components/Render';
import ThousandsSeparator from '@/components/ThousandsSeparator';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const PayTable = ({payment}) => {

  const tableRef = useRef(null);

  if (!payment) {
    return <Empty />;
  }

  const searchForm = () => {
    return (
      <>
        <FormItem hidden value={payment.paymentId} name="paymentId" component={SysField.SalesId} />
      </>
    );
  };

  const columns = payment.payPlan === 2 ? [
    {title: '日期', dataIndex: 'payTime'},
  ] : [
    {
      title: '付款类型', dataIndex: 'payType', render: (value) => {
        let text = '';
        switch (value) {
          case 0:
            text = '订单创建后';
            break;
          case 1:
            text = '合同签订后';
            break;
          case 2:
            text = '订单发货前';
            break;
          case 3:
            text = '订单发货后';
            break;
          case 4:
            text = '入库后';
            break;
          default:
            break;
        }
        return <Render text={text} />;
      }
    },
    {title: '日期', dataIndex: 'dateNumber'},
    {
      title: '日期方式', dataIndex: 'dateWay', render: (value) => {
        let text = '';
        switch (value) {
          case 0:
            text = '天';
            break;
          case 1:
            text = '月';
            break;
          case 2:
            text = '年';
            break;
          default:
            return '';
        }
        return <Render text={text} />;
      }
    }
  ];

  return (
    <>
      <Table
        columns={[
          ...columns,
          {title: '百分比', dataIndex: 'percentum', render: (value) => <Render text={`${value}%`} />},
          {title: '付款金额', dataIndex: 'money', render: (value) => <ThousandsSeparator value={value} />}
        ]}
        bordered={false}
        noRowSelection
        bodyStyle={{padding: 0}}
        headStyle={{display: 'none'}}
        api={{
          url: '/paymentDetail/list',
          method: 'POST'
        }}
        formActions={formActionsPublic}
        rowKey="detailId"
        showSearchButton={false}
        searchForm={searchForm}
        ref={tableRef}
      />
    </>
  );
};

export default PayTable;
