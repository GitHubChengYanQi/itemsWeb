import React from 'react';
import {createFormActions} from '@formily/antd';
import {Button, Table as AntTable} from 'antd';
import Table from '@/components/Table';
import {stockDetail} from '@/pages/Erp/stock/StockUrl';
import Render from '@/components/Render';


const formActionsPublic = createFormActions();

const {Column} = AntTable;

const OutStock = () => {


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
      <Column title="时间" dataIndex="customerResult" render={(value) => {
        return value && value.customerName;
      }} sorter />
      <Column title="原库存" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
      <Column title="出库数量" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
      <Column title="结余" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
      <Column title="人员" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
      <Column title="品牌" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
      <Column title="供应商" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
      <Column title="关联任务" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
      <Column title="关联单据" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
    </Table>
  </>;
};

export default OutStock;
