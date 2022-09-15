/**
 * 供应商开票列表页
 *
 * @author song
 * @Date 2021-12-20 11:29:00
 */

import React, {useEffect, useRef, useState} from 'react';
import {Button, Divider, Modal as AntModal, Table as AntTable} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import ProSkeleton from '@ant-design/pro-skeleton';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {invoiceDelete, invoiceList} from '../invoiceUrl';
import InvoiceEdit from '../invoiceEdit';
import * as SysField from '../invoiceField';
import {useRequest} from '@/util/Request';
import {customerEdit} from '@/pages/Crm/customer/CustomerUrl';

const {FormItem} = Form;
const {Column} = AntTable;

const InvoiceList = ({customer, refresh}) => {

  const [loading, setLoading] = useState(false);

  const ref = useRef(null);
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
          hidden
          value={customer && customer.customerId || ' '}
          name="customerId"
          component={SysField.CustomerId} />
      </>
    );
  };

  const {run: editCustomer} = useRequest(customerEdit,
    {
      manual: true,
      onSuccess: () => {
        if (typeof refresh === 'function')
          refresh();
      }
    });

  const defaultInvoice = (name, invoiceId) => {
    AntModal.confirm({
      title: `是否将[${name}]设为默认开票信息?`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        await editCustomer({
          data: {
            customerId: customer.customerId,
            invoice_id: invoiceId
          }
        });
      },
    });
  };

  useEffect(() => {
    if (customer.invoiceId) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1);
    }
  }, [customer.invoiceId]);

  if (loading) {
    return <ProSkeleton />;
  }

  return (
    <>
      {customer && <Divider orientation="right">
        <AddButton ghost onClick={() => {
          ref.current.open(false);
        }} />
      </Divider>}
      <Table
        bodyStyle={{padding: customer && 0}}
        bordered={!customer}
        headStyle={{display: 'none'}}
        api={invoiceList}
        rowKey="invoiceId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="开户银行" dataIndex="bankResult" render={(value) => {
          return value && value.bankName;
        }} />
        <Column title="开户行号" dataIndex="bankNo" />
        <Column title="开户账号" dataIndex="bankAccount" />
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          const isDefaultInvoiceId = customer && (record.invoiceId === customer.invoiceId);
          return (
            <>
              {customer && <Button disabled={isDefaultInvoiceId} type="link" onClick={() => {
                defaultInvoice(record.bank, record.invoiceId);
              }}>{isDefaultInvoiceId ? '已设为默认' : '设为默认'}</Button>}
              <EditButton onClick={() => {
                ref.current.open(record.invoiceId);
              }} />
              <DelButton api={invoiceDelete} value={record.invoiceId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={300} />
      </Table>
      <Drawer
        width={800}
        title="开票信息"
        customerId={customer && customer.customerId}
        component={InvoiceEdit}
        onSuccess={() => {
          tableRef.current.refresh();
          ref.current.close();
        }} ref={ref} />
    </>
  );
};

export default InvoiceList;
