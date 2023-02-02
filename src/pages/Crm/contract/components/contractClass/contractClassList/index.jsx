/**
 * 合同分类列表页
 *
 * @author song
 * @Date 2021-12-09 14:11:38
 */

import React, {useRef} from 'react';
import {Table as AntTable} from 'antd';
import {createFormActions} from '@formily/antd';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {contractClassDelete, contractClassList} from '../contractClassUrl';
import ContractClassEdit from '../contractClassEdit';
import * as SysField from '../contractClassField';
import Breadcrumb from '@/components/Breadcrumb';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const ContractClassList = () => {
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

  const searchForm = () => {
    return (
      <>
        <FormItem label="名称" name="name" component={SysField.Name} />
      </>
    );
  };

  return (
    <>
      <Table
        listHeader={false}
        cardHeaderStyle={{display:'none'}}
        contentHeight
        api={contractClassList}
        rowKey="contractClassId"
        formActions={formActionsPublic}
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="名称" dataIndex="name" />
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.contractClassId);
              }} />
              <DelButton api={contractClassDelete} value={record.contractClassId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={300} />
      </Table>
      <Drawer width={800} title="编辑" component={ContractClassEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default ContractClassList;
