/**
 * 操作日志列表页
 *
 * @author
 * @Date 2021-11-05 11:42:40
 */

import React, {useRef} from 'react';
import {Table as AntTable} from 'antd';
import Table from '@/components/Table';
import Drawer from '@/components/Drawer';
import Form from '@/components/Form';
import {operationLogList} from '../operationLogUrl';
import OperationLogEdit from '../operationLogEdit';
import * as SysField from '../operationLogField';

const {Column} = AntTable;
const {FormItem} = Form;

const OperationLogList = () => {
  const ref = useRef(null);
  const tableRef = useRef(null);

  const searchForm = () => {
    return (
      <>
        <FormItem label="日志名称" name="logName" component={SysField.LogName} />
        <FormItem label="用户" name="userId" style={{width:200}} component={SysField.UserId} />
      </>
    );
  };

  return (
    <>
      <Table
        title={<h2>列表</h2>}
        api={operationLogList}
        rowKey="operationLogId"
        searchForm={searchForm}
        cardHeaderStyle={{display:'none'}}
        // actions={actions()}
        ref={tableRef}
      >
        <Column title="日志类型" dataIndex="logType" />
        <Column title="用户" dataIndex="userName" width={100} />
        <Column title="类名称" dataIndex="className" />
        <Column title="方法名称" dataIndex="method" />
        <Column title="创建时间" dataIndex="createTime" />
        <Column title="是否成功" dataIndex="succeed" />
        <Column title="备注" dataIndex="message" />
        <Column />
      </Table>
      <Drawer width={800} title="编辑" component={OperationLogEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default OperationLogList;
