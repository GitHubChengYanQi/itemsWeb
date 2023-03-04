/**
 * 编码规则分类列表页
 *
 * @author song
 * @Date 2021-10-22 17:20:05
 */

import React, {useRef} from 'react';
import Table from '@/components/Table';
import {Button, Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {codingRulesClassificationDelete, codingRulesClassificationList} from '../codingRulesClassificationUrl';
import CodingRulesClassificationEdit from '../codingRulesClassificationEdit';
import * as SysField from '../codingRulesClassificationField';
import Breadcrumb from '@/components/Breadcrumb';
import {createFormActions} from '@formily/antd';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const CodingRulesClassificationList = ({toggle}) => {
  const ref = useRef(null);
  const tableRef = useRef(null);
  const actions = () => {
    return (
      <>
        <Button onClick={() => {
          typeof toggle === 'function' && toggle();
        }}>编码规则管理</Button>
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
    <>
      <Table
        title={<Breadcrumb title='编码分类管理' />}
        api={codingRulesClassificationList}
        noRowSelection
        rowKey="codingRulesClassificationId"
        searchForm={searchForm}
        formActions={formActionsPublic}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="分类名称" dataIndex="name" />
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.codingRulesClassificationId);
              }} />
              <DelButton
                api={codingRulesClassificationDelete}
                value={record.codingRulesClassificationId}
                onSuccess={() => {
                  tableRef.current.refresh();
                }} />
            </>
          );
        }} width={300} />
      </Table>
      <Drawer width={800} title="编辑" component={CodingRulesClassificationEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default CodingRulesClassificationList;
