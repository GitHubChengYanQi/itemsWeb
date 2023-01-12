/**
 * 资料分类表列表页
 *
 * @author
 * @Date 2021-09-13 12:51:21
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
import {dataClassificationDelete, dataClassificationList} from '../dataClassificationUrl';
import DataClassificationEdit from '../dataClassificationEdit';
import * as SysField from '../dataClassificationField';
import Breadcrumb from '@/components/Breadcrumb';
import store from '@/store';

const {Column} = AntTable;
const {FormItem} = Form;
const formActions = createFormActions();
const DataClassificationList = () => {
  const ref = useRef(null);
  const tableRef = useRef(null);

  const dataDispatchers = store.useModel('dataSource')[1];

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
        <FormItem label="分类名称" name="title" component={SysField.Title} />
        <FormItem label="排序" name="sort" component={SysField.Sort} />
      </>
    );
  };

  return (
    <>
      <Table
        contentHeight
        api={dataClassificationList}
        rowKey="dataClassificationId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
        formActions={formActions}
      >
        <Column title="分类名称" dataIndex="title" />
        <Column title="排序" dataIndex="sort" />
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.dataClassificationId);
              }} />
              <DelButton api={dataClassificationDelete} value={record.dataClassificationId} onSuccess={() => {
                dataDispatchers.getDataClass();
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={300} />
      </Table>
      <Drawer width={800} title="编辑" component={DataClassificationEdit} onSuccess={() => {
        dataDispatchers.getDataClass();
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default DataClassificationList;
