/**
 * 工具分类表列表页
 *
 * @author song
 * @Date 2021-10-23 10:40:17
 */

import React, {useRef} from 'react';
import Table from '@/components/Table';
import {Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {toolClassificationDelete, toolClassificationList} from '../toolClassificationUrl';
import ToolClassificationEdit from '../toolClassificationEdit';
import * as SysField from '../toolClassificationField';
import {createFormActions} from '@formily/antd';
import Breadcrumb from '@/components/Breadcrumb';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const ToolClassificationList = () => {
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
        <FormItem label="分类名称" name="name" component={SysField.Name} />
      </>
    );
  };

  return (
    <div style={{padding:16}}>
      <Table
        api={toolClassificationList}
        rowKey="toolClassificationId"
        formActions={formActionsPublic}
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="分类名称" dataIndex="name" />
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.toolClassificationId);
              }} />
              <DelButton api={toolClassificationDelete} value={record.toolClassificationId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={300} />
      </Table>
      <Drawer width={800} title="编辑" component={ToolClassificationEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </div>
  );
};

export default ToolClassificationList;
