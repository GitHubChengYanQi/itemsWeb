/**
 * 导航分类列表页
 *
 * @author
 * @Date 2021-08-18 10:38:50
 */

import React, {useRef} from 'react';
import Table from '@/components/Table';
import {Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {navigationDifferenceDelete, navigationDifferenceList} from '../navigationDifferenceUrl';
import NavigationDifferenceEdit from '../navigationDifferenceEdit';
import * as SysField from '../navigationDifferenceField';
import Breadcrumb from '@/components/Breadcrumb';

const {Column} = AntTable;
const {FormItem} = Form;

const NavigationDifferenceList = () => {
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
        <FormItem label="分类" name="difference" component={SysField.Difference}/>
      </>
    );
  };

  return (
    <>
      <Table
        api={navigationDifferenceList}
        rowKey="classificationId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="分类id" dataIndex="difference"/>
        <Column/>
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.classificationId);
              }}/>
              {/*<DelButton api={navigationDifferenceDelete} value={record.classificationId} onSuccess={()=>{*/}
              {/*  tableRef.current.refresh();*/}
              {/*}}/>*/}
            </>
          );
        }} width={300}/>
      </Table>
      <Drawer width={800} title="编辑" component={NavigationDifferenceEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref}/>
    </>
  );
};

export default NavigationDifferenceList;
