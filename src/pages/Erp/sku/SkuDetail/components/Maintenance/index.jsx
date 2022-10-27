import React from 'react';
import {createFormActions} from '@formily/antd';
import {Button, Table as AntTable} from 'antd';
import Table from '@/components/Table';
import {maintenanceLogList} from '@/pages/Erp/stock/StockUrl';
import Render from '@/components/Render';
import {isArray} from '@/util/Tools';
import Note from '@/components/Note';


const formActionsPublic = createFormActions();

const {Column} = AntTable;

const Maintenance = ({skuId}) => {


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
      api={maintenanceLogList}
      rowKey="maintenanceLogDetailId"
    >
      <Column title="时间" dataIndex="createTime" sorter />
      <Column title="养护数量" dataIndex="number" render={(value) => {
        return <Render text={value || 0} />;
      }} />
      <Column title="养护内容" dataIndex="announcementsResults" render={(value) => {
        return <Note value={isArray(value).map(item => item.content).toString()} />;
      }} />
      <Column width={70} title="养护人员" dataIndex="userResult" render={(value) => {
        return <Render text={value?.name || '-'} />;
      }} />
      <Column width={70} title="操作" dataIndex="brandResult" render={(value) => {
        return <Render><Button type="link">详情</Button></Render>;
      }} />
    </Table>
  </>;
};

export default Maintenance;
