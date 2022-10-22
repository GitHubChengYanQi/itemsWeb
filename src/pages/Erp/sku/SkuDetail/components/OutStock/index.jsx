import React from 'react';
import {createFormActions} from '@formily/antd';
import {Table as AntTable} from 'antd';
import Table from '@/components/Table';
import {outstockOrderList} from '@/pages/Erp/stock/StockUrl';
import Render from '@/components/Render';


const formActionsPublic = createFormActions();

const {Column} = AntTable;

const OutStock = ({skuId}) => {


  return <>
    <Table
      formSubmit={(value) => {
        return {...value, skuId};
      }}
      noRowSelection
      formActions={formActionsPublic}
      bodyStyle={{padding: 0}}
      bordered={false}
      headStyle={{display: 'none'}}
      api={outstockOrderList}
      rowKey="outstockOrderId"
    >
      <Column title="时间" dataIndex="createTime" sorter />
      <Column title="原库存" dataIndex="brandResult" render={(value) => {
        return <Render text="-" />;
      }} />
      <Column title="出库数量" dataIndex="brandResult" render={(value) => {
        return <Render text="-" />;
      }} />
      <Column title="结余" dataIndex="brandResult" render={(value) => {
        return <Render text="-" />;
      }} />
      <Column title="人员" dataIndex="userResult" render={(value) => {
        return <>{value?.name || '-'}</>;
      }} />
      <Column title="品牌" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
      <Column title="供应商" dataIndex="brandResult" render={(value) => {
        return <Render text="-" />;
      }} />
      <Column title="关联任务" dataIndex="brandResult" render={(value) => {
        return <Render text="-" />;
      }} />
      <Column title="关联单据" dataIndex="brandResult" render={(value) => {
        return <Render text="-" />;
      }} />
    </Table>
  </>;
};

export default OutStock;
