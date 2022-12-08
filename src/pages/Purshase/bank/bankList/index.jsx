/**
 * 列表页
 *
 * @author song
 * @Date 2022-02-24 14:55:10
 */

import React, {useRef} from 'react';
import {Table as AntTable} from 'antd';
import {createFormActions} from '@formily/antd';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import {bankDelete, bankList} from '../bankUrl';
import BankEdit from '../bankEdit';

const {Column} = AntTable;

const formActionsPublic = createFormActions();

const BankList = () => {
  const ref = useRef(null);
  const tableRef = useRef(null);
  const actions = () => {
    return (
      <>
        <AddButton onClick={() => {
          ref.current.open(false);
        }} />
      </>
    );
  };


  return (
    <>
      <Table
        listHeader={false}
        cardHeaderStyle={{display:'none'}}
        SearchButton
        searchForm
        formActions={formActionsPublic}
        api={bankList}
        rowKey="bankId"
        noRowSelection
        contentHeight
        actions={actions()}
        ref={tableRef}
      >
        <Column title="银行名称" dataIndex="bankName" />
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.bankId);
              }} />
              <DelButton api={bankDelete} value={record.bankId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={300} />
      </Table>
      <Drawer width={800} title="编辑" component={BankEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default BankList;
