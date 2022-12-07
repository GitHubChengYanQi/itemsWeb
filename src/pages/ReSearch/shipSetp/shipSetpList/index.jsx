/**
 * 工序表列表页
 *
 * @author Captain_Jazz
 * @Date 2022-02-10 15:06:02
 */

import React, {useRef, useState} from 'react';
import {Button, Table as AntTable} from 'antd';
import {useHistory} from 'ice';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {shipSetpDelete, shipSetpList} from '../shipSetpUrl';
import ShipSetpEdit from '../shipSetpEdit';
import * as SysField from '../shipSetpField';
import Breadcrumb from '@/components/Breadcrumb';
import Modal from '@/components/Modal';
import ShipSetpBindList from '@/pages/ReSearch/shipSetp/shipSetpBind/shipSetpBindList';

const {Column} = AntTable;
const {FormItem} = Form;

const ShipSetpList = () => {
  const ref = useRef(null);
  const seeRef = useRef(null);
  const history = useHistory(null);
  const addRef = useRef(null);
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

  const [loading, setLoading] = useState();

  const searchForm = () => {
    return (
      <>
        <FormItem label="工序名称" name="shipSetpName" component={SysField.ShipSetpName} />
      </>
    );
  };

  return (
    <>
      <Table
        title={<Breadcrumb />}
        api={shipSetpList}
        rowKey="shipSetpId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="工序编码" dataIndex="coding" />
        <Column title="工序名称" dataIndex="shipSetpName" />
        <Column title="工序分类" dataIndex="shipSetpClassResult" render={(value) => {
          return <>{value && value.shipSetpClassName}</>;
        }} />
        <Column title="SOP作业指导" dataIndex="sopResult" render={(value, record) => {
          return <Button type="link" onClick={() => {
            history.push(`/SPU/sop/${record.sopId}`);
          }}>{value && value.name}</Button>;
        }} />
        <Column title="创建者" dataIndex="userResult" render={(value) => {
          return <>{value && value.name}</>;
        }} />
        <Column title="创建时间" dataIndex="createTime" width={200} />
        <Column title="备注" dataIndex="remark" />
        <Column />
        <Column title="操作" align="right" dataIndex='shipSetpId' render={(value, record) => {
          return (
            <>
              <Button type="link" onClick={() => {
                seeRef.current.open(value);
              }}>查看工具</Button>
              <EditButton onClick={() => {
                ref.current.open(record.shipSetpId);
              }} />
              <DelButton api={shipSetpDelete} value={record.shipSetpId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={300} />
      </Table>
      <Modal
        width={600}
        title="工序"
        loading={setLoading}
        compoentRef={addRef}
        footer={<Button loading={loading} type="primary" onClick={() => {
          addRef.current.submit();
        }}>确点</Button>}
        component={ShipSetpEdit}
        onSuccess={() => {
          tableRef.current.refresh();
          ref.current.close();
        }} ref={ref} />

      <Modal
        width={600}
        title="使用工具"
        component={ShipSetpBindList}
        onSuccess={() => {
          seeRef.current.close();
        }}
        ref={seeRef}
      />
    </>
  );
};

export default ShipSetpList;
