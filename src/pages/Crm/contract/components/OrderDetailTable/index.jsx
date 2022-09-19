import React, {useRef} from 'react';
import {createFormActions} from '@formily/antd';
import Form from '@/components/Form';
import * as SysField from '@/pages/Crm/business/crmBusinessSalesProcess/crmBusinessSalesProcessField';
import Table from '@/components/Table';
import ThousandsSeparator from '@/components/ThousandsSeparator';
import Render from '@/components/Render';

const {FormItem} = Form;

const formActionsPublic = createFormActions();

const OrderDetailTable = ({orderId}) => {
  const tableRef = useRef(null);

  const searchForm = () => {
    return (
      <>
        <FormItem hidden value={orderId} name="orderId" component={SysField.SalesId} />
      </>
    );
  };

  const columns = [
    {title: '物料编码', dataIndex: 'skuResult', render: (value) => <Render text={value && value.standard} />},
    {
      title: '物料名称',
      dataIndex: 'skuResult',
      render: (value) => <Render text={value && value.spuResult && value.spuResult.name} />
    },
    {
      title: '型号 / 规格',
      dataIndex: 'skuResult',
      render: (value) => <Render text={value && (`${value.skuName} / ${value.specifications}`)} />
    },
    {title: '品牌', dataIndex: 'brandResult', render: (value) => <Render text={value && value.brandName} />},
    {title: '数量', dataIndex: 'purchaseNumber'},
    {title: '单位', dataIndex: 'unit', render: (value) => <Render text={value && value.unitName} />},
    {title: '单价', dataIndex: 'onePrice', render: (value) => <ThousandsSeparator value={value} />},
    {title: '总价', dataIndex: 'totalPrice', render: (value) => <ThousandsSeparator value={value} />},
    {title: '票据类型', dataIndex: 'paperType', render: (value) => <Render text={value ? '专票' : '普票'} />},
    {title: '税率', dataIndex: 'taxRate',render:(taxRate)=><Render text={`${taxRate.taxRateValue || 0}%`} />},
    {title: '交货期', dataIndex: 'deliveryDate'},
  ];

  return (
    <>
      <Table
        columns={columns}
        bordered={false}
        noRowSelection
        bodyStyle={{padding: 0}}
        headStyle={{display: 'none'}}
        api={{
          url: '/orderDetail/list',
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

export default OrderDetailTable;
