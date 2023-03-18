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
      render: (value) => <Render
        text={value && (`${value.skuName} ${value.specifications ? `/${value.specifications}` : ''}`)} />
    },
    {title: '品牌', dataIndex: 'brandResult', render: (value) => <Render text={value && value.brandName} />},
    {title: '数量', dataIndex: 'purchaseNumber'},
    {title: '单位', dataIndex: 'unit', render: (value) => <Render text={value && value.unitName} />},
    {
      title: '单价',
      dataIndex: 'onePrice',
      align: 'right',
      render: (value, record) => <ThousandsSeparator prefix={record.sign} value={value} />
    },
    {
      title: '总价',
      dataIndex: 'totalPrice',
      align: 'right',
      render: (value, record) => <ThousandsSeparator prefix={record.sign} value={value} />
    },
    {
      title: '已到货',
      align: 'center',
      dataIndex: 'arrivalNumber',
    },
    {
      title: '已入库',
      align: 'center',
      dataIndex: 'inStockNumber',
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        bordered={false}
        noRowSelection
        contentHeight={orderId && 'auto'}
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
