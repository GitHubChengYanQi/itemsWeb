/**
 * SPU分类列表页
 *
 * @author song
 * @Date 2021-10-25 17:52:03
 */

import React, {useRef, useState} from 'react';
import {Table as AntTable} from 'antd';
import {createFormActions} from '@formily/antd';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {
  spuClassificationDelete,
  spuClassificationdeleteBatch,
  spuClassificationTreeVrew
} from '../spuClassificationUrl';
import SpuClassificationEdit from '../spuClassificationEdit';
import * as SysField from '../spuClassificationField';
import Breadcrumb from '@/components/Breadcrumb';
import Table from '@/components/Table';
import store from '@/store';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const SpuClassificationList = ({type}) => {
  const ref = useRef(null);
  const tableRef = useRef(null);

  const [ids, setIds] = useState([]);

  const dispatchers = store.useModel('dataSource')[1];

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

  const footer = () => {

    return <DelButton value={ids} disabled={ids.length === 0} api={spuClassificationdeleteBatch} onSuccess={() => {
      tableRef.current.submit();
    }}>批量删除</DelButton>;
  };

  return (
    <div style={{padding: 16}}>
      <Table
        noPagination
        title={<Breadcrumb title="物料分类管理" />}
        api={spuClassificationTreeVrew}
        rowKey="key"
        listHeader={false}
        searchForm={searchForm}
        noSort
        contentHeight
        formActions={formActionsPublic}
        actions={actions()}
        ref={tableRef}
        onChange={(value) => {
          setIds(value);
        }}
        footer={footer}
      >
        <Column title="分类名称" dataIndex="label" render={(value) => {
          return (
            <>
              {
                value
              }
            </>
          );
        }} />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.key);
              }} />
              <DelButton api={spuClassificationDelete} value={record.key} onSuccess={() => {
                dispatchers.getSkuClass();
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={100} />
      </Table>
      <Drawer width={1200} title="分类" type={type} component={SpuClassificationEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </div>
  );
};

export default SpuClassificationList;
