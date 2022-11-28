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
import EditButton from '@/components/EditButton';
import DelButton from '@/components/DelButton';
import PaymentEdit from '@/pages/Purshase/Payment/PaymentEdit';
import {paymentDelete, paymentList} from '@/pages/Purshase/Payment/PaymentUrl';

const formActionsPublic = createFormActions();

const PaymentList = () => {

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
    {dataIndex: 'paymentAmount', title: '金额(人民币)'},
    {dataIndex: 'coding', title: '关联订单'},
    {dataIndex: 'createTime', title: '创建时间'},
    {dataIndex: 'remark', title: '备注'},
    {
      dataIndex: 'orderId', title: '操作', render: (value, record) => {
        return <>
          <EditButton onClick={() => {
            ref.current.open(record.recordId);
          }} />
          <DelButton api={paymentDelete} value={record.recordId} onSuccess={() => {
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
        api={paymentList}
        rowKey="recordId"
        noRowSelection
        contentHeight
        actions={actions()}
        ref={tableRef}
      />
      <Drawer width={800} title="付款记录" component={PaymentEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default PaymentList;
