import React from 'react';
import {createFormActions} from '@formily/antd';
import {Table as AntTable} from 'antd';
import Table from '@/components/Table';
import {instockOrderList} from '@/pages/Erp/stock/StockUrl';
import Render from '@/components/Render';


const formActionsPublic = createFormActions();

const {Column} = AntTable;

const InStock = ({skuId}) => {


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
      api={instockOrderList}
      rowKey="supplyId"
    >
      <Column title="时间" dataIndex="createTime" sorter />
      <Column title="原库存" dataIndex="stockNumber" render={(value) => {
        return <Render text={value || '-'} />;
      }} />
      <Column title="入库数量" dataIndex="inStockNum" render={(value) => {
        return <Render text={value || '-'} />;
      }} />
      <Column title="应存" dataIndex="realNumber" render={(value) => {
        return <Render text={value || '-'} />;
      }} />
      <Column title="人员" dataIndex="user" render={(value) => {
        return <Render text={value || '-'} />;
      }} />
      <Column title="品牌" dataIndex="brandResult" render={(value) => {
        return <Render text={value?.brandName || '无品牌'} />;
      }} />
      <Column title="供应商" dataIndex="customerResult" render={(value) => {
        return <Render text={value?.customerName || '-'} />;
      }} />
      <Column title="关联任务" dataIndex="task" render={(value) => {
        return <Render text={value || '-'} />;
      }} />
      <Column title="关联单据" dataIndex="order" render={(value) => {
        return <Render text={value || '-'} />;
      }} />
    </Table>
  </>;
};

export default InStock;
