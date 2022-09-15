/**
 * 供应商供应物料列表页
 *
 * @author song
 * @Date 2021-12-20 10:08:44
 */

import React, {useRef} from 'react';
import {Button, Divider, Space, Table as AntTable} from 'antd';
import {createFormActions} from '@formily/antd';
import {SearchOutlined} from '@ant-design/icons';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import Form from '@/components/Form';
import {supplyDelete, supplyList} from '../supplyUrl';
import SupplyEdit from '../supplyEdit';
import * as SysField from '../supplyField';
import Modal from '@/components/Modal';
import SkuDetail from '@/pages/Erp/sku/SkuDetail';
import EditButton from '@/components/EditButton';
import Render from '@/components/Render';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const SupplyList = ({customer}) => {
  const ref = useRef(null);
  const detailRef = useRef(null);
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
        <FormItem
          label="供应商"
          name="customerId"
          value={customer && customer.customerId}
          component={SysField.CustomerId} />
      </>
    );
  };

  return (
    <>
      {customer && <Divider orientation="right">
        <AddButton ghost onClick={() => {
          ref.current.open(false);
        }} />
      </Divider>}
      <Table
        formActions={formActionsPublic}
        bodyStyle={{padding: customer && 0}}
        bordered={!customer}
        headStyle={{display: 'none'}}
        api={supplyList}
        rowKey="supplyId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="物资编码 / 物资名称" dataIndex="skuId" render={(value, record) => {
          return <Render width={200}>{record.skuResult && (`${record.skuResult.standard} / ${record.skuResult.spuResult.name}`)}</Render>;
        }} />
        <Column title="型号 / 规格" dataIndex="skuId" render={(value, record) => {
          return <Render>{record.skuResult && (`${record.skuResult.skuName} / ${record.skuResult.specifications || '无'}`)}</Render>;
        }} />
        <Column title="供应商型号" dataIndex="supplierModel" render={(value) => {
          return <Render>{value}</Render>;
        }} />
        <Column title="品牌" dataIndex="brandResult" render={(value) => {
          return <Render>{value && value.brandName || '无品牌'}</Render>;
        }} />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <Space>
              <EditButton onClick={() => ref.current.open(record)} />
              <Button type="link" onClick={() => {
                detailRef.current.open(record.skuId);
              }}><SearchOutlined /></Button>
              <DelButton api={supplyDelete} value={record.supplyId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </Space>
          );
        }} width={120} />
      </Table>

      <Modal ref={detailRef} width={1000} component={SkuDetail} />

      <Drawer
        width={800}
        title="物料"
        customerId={customer && customer.customerId}
        component={SupplyEdit}
        onSuccess={() => {
          tableRef.current.refresh();
          ref.current.close();
        }} ref={ref} />
    </>
  );
};

export default SupplyList;
