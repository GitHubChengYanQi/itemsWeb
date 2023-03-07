/**
 * 采购单列表页
 *
 * @author song
 * @Date 2022-01-13 13:09:54
 */

import React, {useRef, useState} from 'react';
import {Button, Input, message, Space} from 'antd';
import {useHistory} from 'ice';
import Table from '@/components/Table';
import Form from '@/components/Form';
import Breadcrumb from '@/components/Breadcrumb';
import {orderDetail, orderList} from '@/pages/Erp/order/OrderUrl';
import Modal from '@/components/Modal';
import CreateContract from '@/pages/Order/CreateContract';
import Render from '@/components/Render';
import {Customer} from '@/pages/Order/CreateOrder/components/CustomerAll';
import {request} from '@/util/Request';
import {contractDetail} from '@/pages/Crm/contract/ContractUrl';
import {isArray} from '@/util/Tools';

const {FormItem} = Form;

const OrderTable = (props) => {

  const history = useHistory(null);
  const tableRef = useRef(null);

  const createContractRef = useRef();

  const compoentRef = useRef();

  const [loading, setLoading] = useState(false);

  let module = {};
  switch (props.location.pathname) {
    case '/CRM/order':
      module = {
        createTitle: '创建销售单',
        createRoute: '/CRM/order/createOrder?module=SO',
        module: 'SO',
        type: 2,
      };
      break;
    case '/purchase/order':
      module = {
        createTitle: '创建采购单',
        createRoute: '/purchase/order/createOrder?module=PO',
        module: 'PO',
        type: 1,
      };
      break;
    default:
      break;
  }

  const actions = () => {
    return (
      <>
        <Button type="primary" onClick={() => {
          history.push(module.createRoute || '/');
        }}>{module.createTitle || '创建'}</Button>
      </>
    );
  };

  const searchForm = () => {
    return (
      <>
        <FormItem label="主题" name="theme" placeholder="请输入主题" component={Input} />
        <FormItem label="编号" name="coding" placeholder="请输入编号" component={Input} />
        <FormItem
          hidden={module.type !== 1}
          label="供应商"
          name="sellerId"
          placeholder="请选择供应商"
          supply={1}
          component={Customer}
          width={200}
        />
        <FormItem hidden name="type" value={module.type} component={Input} />
      </>
    );
  };

  const columns = [
    {title: '采购单编号', dataIndex: 'coding'},
    {title: '主题', dataIndex: 'theme', render: (value) => <Render text={value || '-'} />},
    {
      title: '甲方',
      dataIndex: 'acustomer',
      hidden: module.type === 1,
      render: (value) => <Render text={value?.customerName || '-'} />
    },
    {
      title: '乙方',
      dataIndex: 'bcustomer',
      hidden: module.type === 2,
      render: (value) => <Render text={value?.customerName || '-'} />
    },
    {
      title: '采购进度',
      hidden: module.type === 2,
      render: (value) => <Render text={value?.customerName || '-'} />
    },
    {title: '创建人', dataIndex: 'user', render: (value) => <Render text={value?.name || '-'} />},
    {title: '创建时间', dataIndex: 'createTime'},
    {
      title: '操作', width: 300, align: 'center', dataIndex: 'theme', render: (value, record) => {
        return <>
          <Button type="link" onClick={async () => {
            message.loading({content: '正在获取数据，请稍后...', duration: 0});
            let contract = {};
            const data = await request({
              ...orderDetail,
              data: {
                orderId: record.orderId,
              }
            });

            if (data && data.contractId) {
              setLoading(false);
              contract = await request({...contractDetail, data: {contractId: data.contractId}});
            }
            message.destroy();
            const paymentResult = data.paymentResult || {};

            history.push({
              pathname: '/purchase/order/createOrder',
              search: `?module=${data.type === 1 ? 'PO' : 'SO'}`,
              state: {
                ...paymentResult,
                ...data,
                detailParams: isArray(data.detailResults).length > 0 ? data.detailResults : null,
                paymentDetail: isArray(paymentResult.detailResults).length > 0 ? paymentResult.detailResults : null,
                templateId: contract?.templateId,
                contractCoding: contract?.coding,
              }
            });
          }}>再来一单</Button>
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
