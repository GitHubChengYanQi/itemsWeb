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

const {Column} = AntTable;
const {FormItem} = Form;

const OrderTable = (props) => {

  const history = useHistory(null);
  const tableRef = useRef(null);

  const createContractRef = useRef();

  const compoentRef = useRef();

  const [loading,setLoading] = useState(false);

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

  return (
    <>
      <Table
        noRowSelection
        title={<Breadcrumb />}
        api={orderList}
        rowKey="orderId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="采购单编号" dataIndex="coding" render={(value, record) => {
          return <Button type="link" onClick={() => {
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
          }}>{value}</Button>;
        }} />
        <Column title="甲方" dataIndex="acustomer" render={(value) => {
          return value && value.customerName;
        }} />
        <Column title="乙方" dataIndex="bcustomer" render={(value) => {
          return value && value.customerName;
        }} />
        <Column title="类型" dataIndex="type" render={(value) => {
          switch (value) {
            case 1:
              return '采购订单';
            case 2:
              return '销售订单';
            default:
              return '';
          }
        }} />
        <Column title="创建人" dataIndex="user" render={(value) => {
          return value && value.name;
        }} />
        <Column title="创建时间" dataIndex="createTime" />
        <Column />
        <Column
          title={<div style={{textAlign: 'center'}}>操作</div>}
          width={200}
          align="right"
          render={(value, record) => {
            return <>
              {!record.contractId && !record.fileId && <Button type="link" onClick={() => {
                createContractRef.current.open(record.orderId);
              }}>创建合同</Button>}
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
          }} />
      </Table>

      <Modal
        headTitle="创建合同"
        width='auto'
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
