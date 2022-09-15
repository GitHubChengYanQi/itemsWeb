import React from 'react';
import {createFormActions} from '@formily/antd';
import {Button, Table as AntTable} from 'antd';
import Table from '@/components/Table';
import {stockDetail} from '@/pages/Erp/stock/StockUrl';
import Render from '@/components/Render';


const formActionsPublic = createFormActions();

const {Column} = AntTable;

const Allocation = () => {


  return <>
    <Table
      noRowSelection
      formActions={formActionsPublic}
      bodyStyle={{padding: 0}}
      bordered={false}
      headStyle={{display: 'none'}}
      api={stockDetail}
      rowKey="supplyId"
    >
      <Column title="类型" dataIndex="customerResult" render={(value) => {
        return value && value.customerName;
      }} sorter />
      <Column title="调拨数量" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
      <Column title="负责人" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
      <Column width={70} title="调出库（位）" dataIndex="brandResult" render={(value) => {
        return <></>;
      }} />
      <Column title="调出时间" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
      <Column title="发货人" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
      <Column title="调入库（位）" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
      <Column title="调入时间" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
      <Column title="收货人" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
    </Table>
  </>;
};

export default Allocation;
