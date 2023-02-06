/**
 * 列表页
 *
 * @author
 * @Date 2021-10-18 14:14:21
 */

import React, {useRef} from 'react';
import Table from '@/components/Table';
import {Button, Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {spuDelete, spuList} from '../spuUrl';
import SpuEdit from '../spuEdit';
import * as SysField from '../spuField';
import {useHistory} from 'ice';
import Modal from '@/components/Modal';
import Breadcrumb from '@/components/Breadcrumb';
import Code from '@/pages/Erp/spu/components/Code';
import {ScanOutlined} from '@ant-design/icons';
import SpuEdits from '@/pages/Erp/spu/SpuEdits';

const {Column} = AntTable;
const {FormItem} = Form;

const SpuList = () => {
  const ref = useRef(null);
  const tableRef = useRef(null);

  const actions = () => {
    return (
      <>
        <AddButton onClick={() => {
          // history.push('/SPU/spu/add');
          ref.current.open(false);
        }} />
      </>
    );
  };

  const searchForm = () => {
    return (
      <>
        <FormItem label="物品名字" name="name" component={SysField.Name} />
        <FormItem hidden name="type" value={0} component={SysField.Name} />
      </>
    );
  };

  return (
    <>
      <Table
        title={<Breadcrumb />}
        api={spuList}
        rowKey="spuId"
        isModal={false}
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="种类名称" dataIndex="name" render={(value, record) => {
          return (
            <>
              <Code source="spu" id={record.spuId} />
              <Button type='text'>
                {value}
              </Button>
            </>
          );
        }} />
        <Column title="单位" width={120} align="center" dataIndex="unitId" render={(value, record) => {
          return (
            <>
              {record.unitResult && record.unitResult.unitName}
            </>
          );
        }} sorter />
        <Column title="分类" width={120} render={(value, record) => {
          return (
            <>
              {
                record.spuClassificationResult && record.spuClassificationResult.name
              }
            </>
          );
        }} sorter />
        <Column title="操作" width={150} fixed="right" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                // history.push(`/SPU/spu/add?id=${record.spuId}`);
                ref.current.open(record.spuId);
              }} />
              <DelButton api={spuDelete} value={record.spuId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} />
      </Table>
      <Modal width={800} title="编辑" component={SpuEdits} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default SpuList;
