/**
 * 供应商供应物料列表页
 *
 * @author song
 * @Date 2021-12-20 10:08:44
 */

import React, {useRef, useState} from 'react';
import {Button, Divider, Space, Table as AntTable} from 'antd';
import {createFormActions} from '@formily/antd';
import {SearchOutlined} from '@ant-design/icons';
import ProSkeleton from '@ant-design/pro-skeleton';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import Form from '@/components/Form';
import {supplyDelete} from '../supplyUrl';
import SupplyEdit from '../supplyEdit';
import * as SysField from '../supplyField';
import Modal from '@/components/Modal';
import SkuDetail from '@/pages/Erp/sku/SkuDetail';
import EditButton from '@/components/EditButton';
import Render from '@/components/Render';
import {useRequest} from '@/util/Request';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

export const supplyList = {url: '/supply/bindList', method: 'POST'};

const SupplyList = ({customer = {}}) => {

  const ref = useRef(null);
  const detailRef = useRef(null);

  const actions = () => {
    return (
      <>
        <AddButton onClick={() => {
          ref.current.open(false);
        }} />
      </>
    );
  };

  const [dataSource, setDataSource] = useState();

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

  const {loading, refresh} = useRequest(
    {
      ...supplyList,
      data: {customerId: customer.customerId}
    }, {
      onSuccess: (data = []) => {
        const newDataSource = [];
        data.forEach(item => {
          const skuIds = newDataSource.map(item => item.skuId);
          const skuIndex = skuIds.indexOf(item.skuId);
          const brandResult = item.brandResult || {};
          if (skuIndex === -1) {
            newDataSource.push({...item, supplyIds: [item.supplyId], brands: [brandResult]});
          } else {
            const sku = newDataSource[skuIndex];
            newDataSource[skuIndex] = {
              ...sku,
              brands: [...sku.brands, brandResult],
              supplyIds: [...sku.supplyIds, item.supplyId]
            };
          }
        });
        setDataSource(newDataSource);
      }
    });

  return (
    <>
      {customer && <Divider orientation="right">
        <AddButton ghost onClick={() => {
          ref.current.open(false);
        }} />
      </Divider>}
      <Table
        noPagination
        noRowSelection
        loading={loading}
        formActions={formActionsPublic}
        bodyStyle={{padding: customer && 0}}
        bordered={!customer}
        headStyle={{display: 'none'}}
        dataSource={dataSource}
        rowKey="supplyId"
        searchForm={searchForm}
        actions={actions()}
      >
        <Column title="物资编码 / 物资名称" dataIndex="skuId" render={(value, record) => {
          return <Render
            width={200}>{record.skuResult && (`${record.skuResult.standard} / ${record.skuResult.spuResult.name}`)}</Render>;
        }} />
        <Column title="型号 / 规格" dataIndex="skuId" render={(value, record) => {
          return <Render>{record.skuResult && (`${record.skuResult.skuName} / ${record.skuResult.specifications || '无'}`)}</Render>;
        }} />
        <Column title="供应商型号" dataIndex="supplierModel" render={(value) => {
          return <Render>{value}</Render>;
        }} />
        <Column title="品牌" dataIndex="brands" render={(value = []) => {
          return <Render>{value.map(item => item.brandName || '无品牌').toString()}</Render>;
        }} />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <Space>
              <EditButton onClick={() => ref.current.open(record)} />
              <Button type="link" onClick={() => {
                detailRef.current.open(record.skuId);
              }}><SearchOutlined /></Button>
              <DelButton api={supplyDelete} value={record.supplyId} onSuccess={() => {
                refresh();
              }} />
            </Space>
          );
        }} width={120} />
      </Table>

      <Modal ref={detailRef} width={1000} component={SkuDetail} />

      <Drawer
        brandName={customer.abbreviation}
        width={800}
        title="绑定物料"
        customerId={customer && customer.customerId}
        component={SupplyEdit}
        onSuccess={() => {
          refresh();
          ref.current.close();
        }} ref={ref} />
    </>
  );
};

export default SupplyList;
