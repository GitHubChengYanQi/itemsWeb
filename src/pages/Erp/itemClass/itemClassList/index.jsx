/**
 * 产品分类表列表页
 *
 * @author cheng
 * @Date 2021-08-11 15:37:57
 */

import React, {useRef, useState} from 'react';
import Table from '@/components/Table';
import {Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import Breadcrumb from "@/components/Breadcrumb";
import {itemClassDelete, itemClassList} from '../itemClassUrl';
import ItemClassEdit from '../itemClassEdit';
import * as SysField from '../itemClassField';
import {batchDelete} from '@/pages/Erp/material/MaterialUrl';


const {Column} = AntTable;
const {FormItem} = Form;

const ItemClassList = () => {
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
        <FormItem label="产品分类名称" name="className" component={SysField.ClassName}/>
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
        contentHeight
        title={<Breadcrumb title='产品分类'/>}
        api={itemClassList}
        rowKey="classId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
        footer={footer}
        selectedRowKeys={ids}
        onChange={(value)=>{
          setIds(value);
        }}
      >
        <Column title="产品分类名称" dataIndex="className" sorter/>
        <Column/>
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.classId);
              }}/>
              <DelButton api={itemClassDelete} value={record.classId} onSuccess={()=>{
                tableRef.current.refresh();
              }}/>
            </>
          );
        }} width={100}/>
      </Table>
      <Drawer width={800} title="编辑" component={ItemClassEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref}/>
    </>
  );
};

export default ItemClassList;
