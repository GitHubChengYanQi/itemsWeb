import React from 'react';
import {createFormActions} from '@formily/antd';
import {Button, Table as AntTable} from 'antd';
import Table from '@/components/Table';
import {stockDetailsSkuDetailView} from '@/pages/Erp/stock/StockUrl';
import Render from '@/components/Render';


const formActionsPublic = createFormActions();

const {Column} = AntTable;

const StockDetail = ({skuId}) => {


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
      api={stockDetailsSkuDetailView}
      rowKey="stockItemId"
    >
      <Column title="库位" dataIndex="storehousePositionsResult" render={(value) => {
        return value?.name || '-';
      }} sorter />
      <Column title="库存数" dataIndex="number" render={(value) => {
        return <>{value || 0}</>;
      }} />
      <Column width={70} title="操作" dataIndex="brandResult" render={(value) => {
        return <Render><Button type="link">查看实物</Button></Render>;
      }} />
    </Table>
  </>;
};

export default StockDetail;
