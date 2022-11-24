/**
 * 采购单列表页
 *
 * @author song
 * @Date 2022-01-13 13:09:54
 */

import React, {useRef, useState} from 'react';
import {Button, message, Space, Table as AntTable} from 'antd';
import {useHistory} from 'ice';
import Table from '@/components/Table';
import Form from '@/components/Form';
import Breadcrumb from '@/components/Breadcrumb';
import {orderList} from '@/pages/Erp/order/OrderUrl';
import * as SysField from '../SysField/index';
import Modal from '@/components/Modal';
import CreateContract from '@/pages/Order/CreateContract';
import Render from '@/components/Render';

const {Column} = AntTable;
const {FormItem} = Form;

const OrderTable = (props) => {

  const history = useHistory(null);
  const tableRef = useRef(null);

  const createContractRef = useRef();

  const compoentRef = useRef();

  const [loading, setLoading] = useState(false);

  const module = () => {
    switch (props.location.pathname) {
      case '/CRM/order':
        return {
          createTitle: '创建销售单',
          createRoute: '/CRM/order/createOrder?module=SO',
          module: 'SO',
          type: 2,
        };
      case '/purchase/order':
        return {
          createTitle: '创建采购单',
          createRoute: '/purchase/order/createOrder?module=PO',
          module: 'PO',
          type: 1,
        };
      default:
        break;
    }
  };

  const actions = () => {
    return (
      <>
        <Button type="primary" onClick={() => {
          history.push(module().createRoute || '/');
        }}>{module().createTitle || '创建'}</Button>
      </>
    );
  };

  const searchForm = () => {
    return (
      <>
        <FormItem label="单号" name="coding" component={SysField.Coding} />
        <FormItem hidden name="type" value={module().type} component={SysField.Coding} />
      </>
    );
  };

  const columns = [
    {title: '采购单编号', dataIndex: 'coding'},
    {title: '主题', dataIndex: 'theme', render: (value) => <Render text={value || '-'} />},
    {title: '甲方', dataIndex: 'acustomer', render: (value) => <Render text={value?.customerName || '-'} />},
    {title: '乙方', dataIndex: 'bcustomer', render: (value) => <Render text={value?.customerName || '-'} />},
    {title: '创建人', dataIndex: 'user', render: (value) => <Render text={value?.name || '-'} />},
    {title: '创建时间', dataIndex: 'createTime'},
    {
      title: '操作',width:200,align:'center', dataIndex: 'theme', render: (value, record) => {
        return <>
          <Button disabled={record.contractId || record.fileId} type="link" onClick={() => {
            createContractRef.current.open(record.orderId);
          }}>创建合同</Button>
          <Button type="link" onClick={() => {
            switch (props.location.pathname) {
              case '/CRM/order':
                history.push(`/CRM/order/detail?id=${record.orderId}`);
                break;
              case '/purchase/order':
                history.push(`/purchase/order/detail?id=${record.orderId}`);
                break;
              default:
                break;
            }
          }}>详情</Button>
        </>;
      }
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        noRowSelection
        title={<Breadcrumb />}
        api={orderList}
        rowKey="orderId"
        tableKey="order"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      />

      <Modal
        headTitle="创建合同"
        width="auto"
        loading={setLoading}
        ref={createContractRef}
        compoentRef={compoentRef}
        component={CreateContract}
        onSuccess={() => {
          message.success('创建合同成功！');
          createContractRef.current.close();
          tableRef.current.submit();
        }}
        footer={<Space>
          <Button loading={loading} type="primary" onClick={() => {
            compoentRef.current.submit();
          }}>保存</Button>
          <Button onClick={() => {
            createContractRef.current.close();
          }}>取消</Button>
        </Space>}
      />

    </>
  );
};

export default OrderTable;
