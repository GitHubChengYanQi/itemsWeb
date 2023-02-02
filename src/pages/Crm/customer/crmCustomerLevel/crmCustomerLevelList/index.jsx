/**
 * 客户级别表列表页
 *
 * @author
 * @Date 2021-07-30 13:00:02
 */

import React, {useRef, useState} from 'react';
import {Table as AntTable} from 'antd';
import {createFormActions} from '@formily/antd';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import {crmCustomerLevelDelete, crmCustomerLevelList} from '../crmCustomerLevelUrl';
import CrmCustomerLevelEdit from '../crmCustomerLevelEdit';
import Breadcrumb from '@/components/Breadcrumb';
import store from '@/store';

const {Column} = AntTable;
const formActions = createFormActions();
const CrmCustomerLevelList = () => {
  const ref = useRef(null);
  const tableRef = useRef(null);

  const [data, action] = store.useModel('dataSource');

  const actions = () => {
    return (
      <>
        <AddButton onClick={() => {
          ref.current.open(false);
        }} />
      </>
    );
  };

  const [ids, setIds] = useState([]);

  const footer = () => {
    /**
     * 批量删除例子，根据实际情况修改接口地址
     */
    return (<DelButton api={{
      // ...customerBatchDelete
    }} onSuccess={() => {
      tableRef.current.refresh();
    }} value={ids}>批量删除</DelButton>);
  };

  return (
    <>
      <Table
        contentHeight
        listHeader={false}
        searchForm
        SearchButton
        cardHeaderStyle={{display:'none'}}
        footer={footer}
        onChange={(keys) => {
          setIds(keys);
        }}
        api={crmCustomerLevelList}
        rowKey="customerLevelId"
        actions={actions()}
        ref={tableRef}
        formActions={formActions}
      >
        <Column title="级别名称" dataIndex="level" />
        <Column title="数字级别" dataIndex="rank" />
        <Column title="级别描述" dataIndex="remake" />
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.customerLevelId);
              }} />
              <DelButton api={crmCustomerLevelDelete} value={record.customerLevelId} onSuccess={() => {
                action.getCustomerLevel();
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={300} />
      </Table>
      <Drawer width={800} title="客户级别" component={CrmCustomerLevelEdit} onSuccess={() => {
        action.getCustomerLevel();
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default CrmCustomerLevelList;
