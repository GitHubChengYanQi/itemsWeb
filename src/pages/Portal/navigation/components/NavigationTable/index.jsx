/**
 * 导航表列表页
 *
 * @author
 * @Date 2021-08-18 08:40:30
 */

import React, {useEffect, useRef, useState} from 'react';
import Table from '@/components/Table';
import {Image, Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import Breadcrumb from '@/components/Breadcrumb';
import {batchDelete, navigationDelete, navigationList} from '../../navigationUrl';
import NavigationEdit from '../../navigationEdit';
import * as SysField from '../../navigationField';

const {Column} = AntTable;
const {FormItem} = Form;

const NavigationTable = (props) => {
  const {state} = props;
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

  useEffect(() => {
    if (state) {
      tableRef.current.formActions.setFieldValue('difference', state[0]);
      tableRef.current.submit();
    }
  }, [state]);

  const searchForm = () => {
    return (
      <>
        <FormItem label="标题" name="title" component={SysField.Title} />
        <FormItem hidden name="difference" component={SysField.Difference} />
      </>
    );
  };

  const [ids, setIds] = useState([]);


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
        title={<Breadcrumb />}
        api={navigationList}
        isModal={false}
        rowKey="navigationId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
        footer={footer}
        selectedRowKeys={ids}
        onChange={(value) => {
          setIds(value);
        }}
      >
        <Column title="标题" dataIndex="title" />
        <Column title="图标" dataIndex="icon" render={(value, record) => {
          return (
            <>
              <Image width={100} height={50} src={value} />
            </>
          );
        }} />
        <Column title="排序" dataIndex="sort" sorter />
        <Column title="链接" dataIndex="link" />
        <Column title="分类" dataIndex="difference" render={(value,record)=>{
          return (
            <>
              {record.differenceResult ? record.differenceResult.difference : null}
            </>
          );
        }} />
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.navigationId);
              }} />
              <DelButton api={navigationDelete} value={record.navigationId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={300} />
      </Table>
      <Drawer width={800} title="编辑" component={NavigationEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default NavigationTable;
