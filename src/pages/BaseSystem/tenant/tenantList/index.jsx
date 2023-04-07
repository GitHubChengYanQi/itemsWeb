/**
 * 系统租户表列表页
 *
 * @author Captain_Jazz
 * @Date 2023-04-07 09:26:48
 */

import React, {useRef} from 'react';
import Table from '@/components/Table';
import {Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {tenantDelete, tenantList} from '../tenantUrl';
import TenantEdit from '../tenantEdit';
import * as SysField from '../tenantField';

const {Column} = AntTable;
const {FormItem} = Form;

const TenantList = () => {
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
       <FormItem label="租户名称" name="name" component={SysField.Name}/>
       <FormItem label="租户地址" name="address" component={SysField.Address}/>
       <FormItem label="租户邮箱" name="email" component={SysField.Email}/>
       <FormItem label="联系方式" name="telephone" component={SysField.Telephone}/>
     </>
    );
  };

  return (
    <>
      <Table
        title={<h2>列表</h2>}
        api={tenantList}
        rowKey="tenantId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="租户名称" dataIndex="name"/>
        <Column title="租户地址" dataIndex="address"/>
        <Column title="租户邮箱" dataIndex="email"/>
        <Column title="联系方式" dataIndex="telephone"/>
        <Column title="创建时间" dataIndex="createTime"/>
        <Column/>
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.tenantId);
              }}/>
              <DelButton api={tenantDelete} value={record.tenantId} onSuccess={()=>{
                tableRef.current.refresh();
              }}/>
            </>
          );
        }} width={300}/>
      </Table>
      <Drawer width={800} title="编辑" component={TenantEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref}/>
    </>
  );
};

export default TenantList;
