import React from 'react';
import {createFormActions} from '@formily/antd';
import {Button, Table as AntTable} from 'antd';
import Table from '@/components/Table';
import {stockDetail} from '@/pages/Erp/stock/StockUrl';
import Render from '@/components/Render';


const formActionsPublic = createFormActions();

const {Column} = AntTable;

const Maintenance = () => {


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
      <Column title="养护数量" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
      <Column title="养护内容" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
      <Column width={70} title="养护人员" dataIndex="brandResult" render={(value) => {
        return <></>;
      }} />
      <Column width={70} title="操作" dataIndex="brandResult" render={(value) => {
        return <Render><Button type='link'>详情</Button></Render>;
      }} />
    </Table>
  </>;
};

export default Maintenance;
