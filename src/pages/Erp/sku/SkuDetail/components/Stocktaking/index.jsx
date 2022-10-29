import React from 'react';
import {createFormActions} from '@formily/antd';
import {Button, Table as AntTable} from 'antd';
import Table from '@/components/Table';
import {skuHandleRecord} from '@/pages/Erp/stock/StockUrl';
import Render from '@/components/Render';
import {DocumentEnums} from '@/pages/BaseSystem/Documents/Enums';


const formActionsPublic = createFormActions();

const {Column} = AntTable;

const Stocktaking = ({skuId}) => {


  return <>
    <Table
      formSubmit={(value) => {
        return {...value, skuId, types: [DocumentEnums.instockOrder]};
      }}
      noRowSelection
      formActions={formActionsPublic}
      bodyStyle={{padding: 0}}
      bordered={false}
      headStyle={{display: 'none'}}
      api={skuHandleRecord}
      rowKey="recordId"
    >
      <Column title="盘点时间" dataIndex="operationTime" sorter />
      <Column title="库位" dataIndex="positionsResult" render={(value) => {
        return <>{value?.name || '-'}</>;
      }} />
      <Column title="品牌" dataIndex="brandResult" render={(value) => {
        return <>{value?.brandName || '无品牌'}</>;
      }} />
      <Column width={100} title="盘点结果" dataIndex="brandResult" render={(value) => {
        return <>-</>;
      }} />
      <Column title="盘点人员" dataIndex="user" render={(value) => {
        return <Render text={value?.name || '-'} />;
      }} />
      <Column width={70} title="操作" dataIndex="brandResult" render={(value) => {
        return <Render><Button type="link">查看异常</Button></Render>;
      }} />
    </Table>
  </>;
};

export default Stocktaking;
