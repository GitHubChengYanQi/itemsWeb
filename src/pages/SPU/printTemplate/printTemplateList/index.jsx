/**
 * 编辑模板列表页
 *
 * @author Captain_Jazz
 * @Date 2021-12-28 13:24:55
 */

import React, {useRef} from 'react';
import Table from '@/components/Table';
import {Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {printTemplateDelete, printTemplateList} from '../printTemplateUrl';
import PrintTemplateEdit from '../printTemplateEdit';
import * as SysField from '../printTemplateField';
import Breadcrumb from '@/components/Breadcrumb';
import {createFormActions} from '@formily/antd';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const PrintTemplateList = () => {
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
        <FormItem label="名称" name="name" component={SysField.Name} />
        <FormItem label="类型" name="type" component={SysField.Type} />
      </>
    );
  };

  return (
    <>
      <Table
        contentHeight
        title={<Breadcrumb title="模板" />}
        api={printTemplateList}
        rowKey="printTemplateId"
        listHeader={false}
        searchForm={searchForm}
        noRowSelection
        formActions={formActionsPublic}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="类型" dataIndex="type" render={(value) => {
          switch (value) {
            case 'POSITIONS':
              return '库位详情';
            case 'PHYSICALDETAIL':
              return '实物详情';
            default:
              return '';
          }
        }} />
        <Column title="名称" dataIndex="name" />
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.printTemplateId);
              }} />
              <DelButton api={printTemplateDelete} value={record.printTemplateId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={300} />
      </Table>
      <Drawer width={800} title="编辑" component={PrintTemplateEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default PrintTemplateList;
