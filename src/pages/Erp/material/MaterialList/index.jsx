/**
 * 材质列表页
 *
 * @author cheng
 * @Date 2021-07-14 15:56:05
 */

import React, {useRef, useState} from 'react';
import Table from '@/components/Table';
import {Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import Breadcrumb from '@/components/Breadcrumb';
import Modal2 from '@/components/Modal';
import MaterialEdit from '../MaterialEdit';
import * as SysField from '../MaterialField';
import {batchDelete, materialDelete, materialList} from '../MaterialUrl';
import {createFormActions} from '@formily/antd';
import Drawer from '@/components/Drawer';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const MaterialList = () => {
  const ref = useRef(null);
  const tableRef = useRef(null);
  const actions = () => {
    return (
      <>
        <AddButton onClick={() => {
          ref.current.open(false);
        }}/>
      </>
    );
  };

  const searchForm = () => {
    return (
      <>
        <FormItem label="材质名字" name="name" component={SysField.Name}/>
      </>
    );
  };

  const [ids,setIds] = useState([]);

  const footer = () => {
    /**
     * 批量删除例子，根据实际情况修改接口地址
     */
    return (<DelButton api={{
      ...batchDelete
    }} onSuccess={() => {
      tableRef.current.refresh();
    }} value={ids}>批量删除</DelButton>);
  };

  return (
    <>
      <Table
        formActions={formActionsPublic}
        contentHeight
        api={materialList}
        rowKey="materialId"
        searchForm={searchForm}
        actions={actions()}
        listHeader={false}
        ref={tableRef}
        footer={footer}
        selectedRowKeys={ids}
        onChange={(value)=>{
          setIds(value);
        }}
      >
        <Column title="材质名字" dataIndex="name" sorter/>
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.materialId);
              }}/>
              <DelButton api={materialDelete} value={record.materialId} onSuccess={()=>{
                tableRef.current.refresh();
              }}/>
            </>
          );
        }} width={100}/>
      </Table>
      <Drawer width={800} title="材质" component={MaterialEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref}/>
    </>
  );
};

export default MaterialList;
