import React from 'react';
import {createFormActions} from '@formily/antd';
import {Button, Table as AntTable} from 'antd';
import Table from '@/components/Table';
import {stockDetail} from '@/pages/Erp/stock/StockUrl';
import Render from '@/components/Render';


const formActionsPublic = createFormActions();

const {Column} = AntTable;

const StockDetail = () => {


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
      <Column title="库位" dataIndex="customerResult" render={(value) => {
        return value && value.customerName;
      }} sorter />
      <Column title="库存数" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
      <Column title="单位" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
      <Column width={70} title="操作" dataIndex="brandResult" render={(value) => {
        return <Render><Button type='link'>查看实物</Button></Render>;
      }} />
    </Table>
  </>;
};

export default StockDetail;
