/**
 * sop主表列表页
 *
 * @author song
 * @Date 2022-02-10 09:21:35
 */

import React, {useRef, useState} from 'react';
import {Button, Table as AntTable} from 'antd';
import {useHistory} from 'ice';
import Table from '@/components/Table';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {sopDelete, sopList} from '../sopUrl';
import SopEdit from '../sopEdit';
import * as SysField from '../sopField';
import Modal from '@/components/Modal';
import Breadcrumb from '@/components/Breadcrumb';
import DelButton from '@/components/DelButton';


const {Column} = AntTable;
const {FormItem} = Form;

const SopList = () => {
  const ref = useRef(null);
  const addRef = useRef(null);
  const history = useHistory();
  const tableRef = useRef(null);

  const [loading, setLoading] = useState();

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
        <FormItem label="编号" name="coding" component={SysField.Name} />
        <FormItem label="名称" name="name" component={SysField.Name} />
      </>
    );
  };

  return (
    <>
      <Table
        title={<Breadcrumb />}
        api={sopList}
        rowKey="sopId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="编号" dataIndex="coding" />
        <Column title="关联工序" dataIndex="shipSetpResults" render={(value) => {
          return '暂无';
        }} />
        <Column title="名称" dataIndex="name" />
        <Column title="版本号" dataIndex="versionNumber" />
        <Column title="创建人" dataIndex="user" render={(value) => {
          return <>{value && value.name}</>;
        }} />
        <Column title="创建时间" dataIndex="createTime" />
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <Button type="link" onClick={() => {
                history.push(`/SPU/sop/${record.sopId}`);
              }}>详情</Button>
              <EditButton onClick={() => {
                ref.current.open(record.sopId);
              }} />
              <DelButton api={sopDelete} value={record.shipSetpId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={300} />
      </Table>
      <Modal
        width={700}
        title="作业指导"
        component={SopEdit}
        loading={setLoading}
        compoentRef={addRef}
        footer={<Button loading={loading} type="primary" onClick={() => {
          addRef.current.submit();
        }}>
          保存
        </Button>}
        onSuccess={() => {
          tableRef.current.refresh();
          ref.current.close();
        }} ref={ref} />
    </>
  );
};

export default SopList;
