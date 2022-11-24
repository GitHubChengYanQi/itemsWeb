/**
 * 列表页
 *
 * @author song
 * @Date 2022-02-24 14:55:10
 */

import React, {useRef} from 'react';
import {createFormActions} from '@formily/antd';
import Table from '@/components/Table';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import {invoiceList,invoiceDelete} from '@/pages/Purshase/Invoice/InvoiceUrl';
import InvoiceEdit from '@/pages/Purshase/Invoice/InvoiceEdit';
import EditButton from '@/components/EditButton';
import DelButton from '@/components/DelButton';

const formActionsPublic = createFormActions();

const InvoiceList = () => {

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

  const columns = [
    {dataIndex: 'name', title: '发票名称'},
    {dataIndex: 'InvoiceDate', title: '发票日期'},
    {dataIndex: 'money', title: '金额'},
    {dataIndex: 'enclosureId', title: '附件'},
    {dataIndex: 'orderId', title: '关联订单'},
    {
      dataIndex: 'orderId', title: '操作', render: (value, record) => {
        return <>
          <EditButton onClick={() => {
            ref.current.open(record.invoiceBillId);
          }} />
          <DelButton api={invoiceDelete} value={record.invoiceBillId} onSuccess={() => {
            tableRef.current.refresh();
          }} />
        </>;
      }
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        listHeader={false}
        cardHeaderStyle={{display: 'none'}}
        SearchButton
        searchForm
        formActions={formActionsPublic}
        api={invoiceList}
        rowKey="invoiceBillId"
        noRowSelection
        contentHeight
        actions={actions()}
        ref={tableRef}
      />
      <Drawer width={800} title="发票" component={InvoiceEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default InvoiceList;
