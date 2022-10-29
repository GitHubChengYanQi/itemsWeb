import React from 'react';
import {createFormActions} from '@formily/antd';
import {Table as AntTable} from 'antd';
import Table from '@/components/Table';
import {allocationLogList} from '@/pages/Erp/stock/StockUrl';
import Render from '@/components/Render';


const formActionsPublic = createFormActions();

const {Column} = AntTable;

const Allocation = ({skuId}) => {


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
      api={allocationLogList}
      rowKey="allocationLogId"
    >
      <Column title="类型" dataIndex="customerResult" render={(value) => {
        return <Render text="-" />;;
      }} sorter />
      <Column title="调拨数量" dataIndex="brandResult" render={(value) => {
        return <Render text="-" />;
      }} />
      <Column title="负责人" dataIndex="brandResult" render={(value) => {
        return <Render text="-" />;
      }} />
      <Column width={70} title="调出库（位）" dataIndex="brandResult" render={(value) => {
        return <Render text="-" />;
      }} />
      <Column title="调出时间" dataIndex="createTime" />
      <Column title="发货人" dataIndex="brandResult" render={(value) => {
        return <Render text="-" />;
      }} />
      <Column title="调入库（位）" dataIndex="brandResult" render={(value) => {
        return <Render text="-" />;
      }} />
      <Column title="调入时间" dataIndex="createTime" />
      <Column title="收货人" dataIndex="brandResult" render={(value) => {
        return <Render text="-" />;
      }} />
    </Table>
  </>;
};

export default Allocation;
