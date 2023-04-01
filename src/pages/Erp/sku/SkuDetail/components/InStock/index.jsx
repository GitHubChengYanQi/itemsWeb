import React from 'react';
import {createFormActions} from '@formily/antd';
import {Table as AntTable} from 'antd';
import Table from '@/components/Table';
import {skuHandleRecord} from '@/pages/Erp/stock/StockUrl';
import Render from '@/components/Render';
import {ReceiptsEnums} from '@/pages/BaseSystem/Documents/Enums';


const formActionsPublic = createFormActions();

const {Column} = AntTable;

const InStock = ({skuId}) => {


  return <>
    <Table
      formSubmit={(value) => {
        return {...value, skuId, types: [ReceiptsEnums.instockOrder, ReceiptsEnums.outstockOrder]};
      }}
      noRowSelection
      formActions={formActionsPublic}
      bodyStyle={{padding: 0}}
      bordered={false}
      headStyle={{display: 'none'}}
      api={skuHandleRecord}
      rowKey="recordId"
    >
      <Column title="类型" dataIndex="source" render={(value) => {
        switch (value) {
          case ReceiptsEnums.instockOrder:
            return '入库';
          case ReceiptsEnums.outstockOrder:
            return '出库';
          default:
            break;
        }
      }} />
      <Column title="时间" dataIndex="operationTime" sorter />
      <Column title="原库存" dataIndex="nowStockNumber" render={(value) => {
        return <Render>{value || 0}</Render>;
      }} />
      <Column title="数量" dataIndex="operationNumber" render={(value) => {
        return <Render>{value || 0}</Render>;
      }} />
      <Column title="结余" dataIndex="balanceNumber" render={(value) => {
        return <Render>{value || 0}</Render>;
      }} />
      <Column title="人员" dataIndex="user" render={(value) => {
        return <Render text={value?.name || '-'} />;
      }} />
      <Column title="品牌" dataIndex="brandResult" render={(value) => {
        return <Render text={value?.brandName || '无品牌'} />;
      }} />
      <Column title="供应商" dataIndex="customerResult" render={(value) => {
        return <Render text={value?.customerName || '-'} />;
      }} />
      <Column title="关联任务" dataIndex="theme" render={(value) => {
        return <Render text={value || '-'} />;
      }} />
      <Column title="关联单据" dataIndex="instockOrderResult" render={(value) => {
        return <Render text={value?.coding || '-'} />;
      }} />
    </Table>
  </>;
};

export default InStock;
