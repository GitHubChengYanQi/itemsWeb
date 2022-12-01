/**
 * 列表页
 *
 * @author song
 * @Date 2022-02-24 14:55:10
 */

import React, {useRef, useState} from 'react';
import {createFormActions} from '@formily/antd';
import {Button, message} from 'antd';
import Table from '@/components/Table';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import PaymentEdit from '@/pages/Purshase/Payment/PaymentEdit';
import {paymentList} from '@/pages/Purshase/Payment/PaymentUrl';
import {useRequest} from '@/util/Request';

const formActionsPublic = createFormActions();

const PaymentList = () => {
  const ref = useRef(null);
  const tableRef = useRef(null);

  const {run, fetches} = useRequest({
    url: '/paymentRecord/obsolete',
    method: 'POST',
  }, {
    manual: true,
    fetchKey: ({data: {recordId}}) => recordId,
    onSuccess: () => {
      message.success('作废成功');
      tableRef.current.refresh();
    },
    onError: () => {

    }
  });

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
          <Button
            disabled={record.status === 50}
            loading={fetches[record.recordId]?.loading}
            type="link"
            danger
            onClick={() => {
              run({data: {recordId: record.recordId}});
            }}
          >
            作废
          </Button>
        </>;
      }
    },
  ];

  return (
    <>
      <Table
        noTableColumnSet
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
