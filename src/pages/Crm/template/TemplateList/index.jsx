/**
 * 合同模板列表页
 *
 * @author
 * @Date 2021-07-21 08:22:02
 */

import React, {useRef, useState} from 'react';
import {Button, Space, Table as AntTable} from 'antd';
import {createFormActions} from '@formily/antd';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {templateDelete, templateList} from '../TemplateUrl';
import TemplateEdit from '../TemplateEdit';
import * as SysField from '../TemplateField';
import Breadcrumb from '@/components/Breadcrumb';
import Modal from '@/components/Modal';

const {Column} = AntTable;
const {FormItem} = Form;
const formActions = createFormActions();

const TemplateList = ({module}) => {
  const ref = useRef(null);
  const compoentRef = useRef(null);
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
        <FormItem label="合同模板" name="name" component={SysField.Name} />
      </>
    );
  };


  const [ids, setIds] = useState([]);

  const footer = () => {
    /**
     * 批量删除例子，根据实际情况修改接口地址
     */
    return (<DelButton api={{
      // ...customerBatchDelete
    }} onSuccess={() => {
      tableRef.current.refresh();
    }} value={ids}>批量删除</DelButton>);
  };

  return (
    <>
      <Table
        selectedRowKeys={ids}
        formSubmit={(values) => {
          return {...values, module};
        }}
        footer={footer}
        contentHeight
        listHeader={false}
        cardHeaderStyle={{display: 'none'}}
        onChange={(keys) => {
          setIds(keys);
        }}
        api={templateList}
        rowKey="templateId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
        formActions={formActions}
      >
        <Column title="合同模板" dataIndex="name" />
        <Column title="合同分类" dataIndex="classResult" render={(value) => {
          return <>{value && value.name}</>;
        }} />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.templateId);
              }} />
              <DelButton api={templateDelete} value={record.templateId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={100} />
      </Table>
      <Modal
        width="100vw"
        title="合同模板"
        compoentRef={compoentRef}
        module={module}
        component={TemplateEdit}
        footer={<Space>
          <Button type="primary" onClick={() => {
            compoentRef.current.submit();
          }}>保存</Button>
          <Button onClick={() => {
            ref.current.close();
          }}>取消</Button>
        </Space>}
        onSuccess={() => {
          tableRef.current.refresh();
          ref.current.close();
        }} ref={ref} />
    </>
  );
};

export default TemplateList;
