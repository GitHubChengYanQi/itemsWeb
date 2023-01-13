/**
 * 提醒表列表页
 *
 * @author cheng
 * @Date 2021-08-26 15:50:39
 */

import React, {useRef} from 'react';
import Table from '@/components/Table';
import {Button, Table as AntTable, Tag} from 'antd';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import Modal from '@/components/Modal';
import TemplateTable from '@/pages/Portal/remind/components/TemplateTable';
import Breadcrumb from '@/components/Breadcrumb';
import {remindDelete, remindList} from '../remindUrl';
import RemindEdit from '../remindEdit';
import * as SysField from '../remindField';

const {Column} = AntTable;
const {FormItem} = Form;

const RemindList = () => {
  const ref = useRef(null);
  const refTemplateTable = useRef(null);
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
        <FormItem label="提醒类型" name="type" component={SysField.Type} />
      </>
    );
  };


  return (
    <>
      <Table
        api={remindList}
        rowKey="remindId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="提醒类型" fixed dataIndex="type" render={(value, record) => {
          switch (record.type) {
            case 0:
              return <>新的报修</>;
            case 1:
              return <>派工提醒</>;
            case 2:
              return <>到达提醒</>;
            case 3:
              return <>完成提醒</>;
            case 4:
              return <>评价提醒</>;
            default:
              return <></>;
          }
        }} />
        <Column title="提醒人" dataIndex="userId" render={(value, record) => {
          return (
            <>
              {
                record.users && record.users.map((value, index) => {
                  return (
                    <Tag
                      key={index}
                      color="green"
                      style={{marginRight: 3}}
                    >
                      {value.name}
                    </Tag>
                  );
                })
              }
            </>
          );
        }} />
        <Column title="操作" fixed='right' align="right" render={(value, record) => {
          return (
            <>
              <Button type='link' onClick={()=>{
                refTemplateTable.current.open(record.remindId);
              }}>
                编辑模板消息
              </Button>
              <EditButton onClick={() => {
                ref.current.open(record);
              }} />
              <DelButton api={remindDelete} value={record.remindId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={210} />
      </Table>
      <Drawer width={800} title="编辑" component={RemindEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
      <Modal width={800} component={TemplateTable} onSuccess={() => {
        tableRef.current.refresh();
        refTemplateTable.current.close();
      }} ref={refTemplateTable} />
    </>
  );
};

export default RemindList;
