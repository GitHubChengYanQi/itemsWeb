/**
 * 单位表列表页
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
import UnitEdit from '../unitEdit';
import Breadcrumb from "@/components/Breadcrumb";
import {batchDelete, unitDelete, unitList} from '../unitUrl';

import * as SysField from '../unitField';
import {createFormActions} from '@formily/antd';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const UnitList = () => {
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
        <FormItem label="单位名称" name="unitName" component={SysField.UnitName}/>
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
    <div style={{padding:16}}>
      <Table
        contentHeight
        formActions={formActionsPublic}
        api={unitList}
        rowKey="unitId"
        searchForm={searchForm}
        listHeader={false}
        actions={actions()}
        ref={tableRef}
        footer={footer}
        onChange={(value)=>{
          setIds(value);
        }}
      >
        <Column title="单位名称" dataIndex="unitName" sorter />
        <Column/>
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.unitId);
              }}/>
              <DelButton api={unitDelete} value={record.unitId} onSuccess={()=>{
                tableRef.current.refresh();
              }}/>
            </>
          );
        }} width={100}/>
      </Table>
      <Drawer width={800} title="单位" component={UnitEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref}/>
    </div>
  );
};

export default UnitList;
