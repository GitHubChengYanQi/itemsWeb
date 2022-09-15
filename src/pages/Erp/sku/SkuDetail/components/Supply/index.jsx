import React from 'react';
import {createFormActions} from '@formily/antd';
import {Table as AntTable} from 'antd';
import {supplyList} from '@/pages/Crm/supply/supplyUrl';
import Table from '@/components/Table';

const formActionsPublic = createFormActions();

const {Column} = AntTable;

const Supply = ({skuId}) => {


  return <>
    <Table
      noRowSelection
      formActions={formActionsPublic}
      bodyStyle={{padding: 0}}
      bordered={false}
      headStyle={{display: 'none'}}
      api={supplyList}
      rowKey="supplyId"
      formSubmit={(values)=>({...values,skuId,})}
    >
      <Column title="供应商名称" dataIndex="customerResult" render={(value) => {
        return value && value.customerName;
      }} sorter />
      <Column title="供应品牌" dataIndex="brandResult" render={(value) => {
        return <>{value && value.brandName || '无品牌'}</>;
      }} />
    </Table>
  </>;
};

export default Supply;
