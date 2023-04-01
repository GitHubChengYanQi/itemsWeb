/**
 * 列表页
 *
 * @author song
 * @Date 2022-02-24 14:55:10
 */

import React, {useImperativeHandle, useRef, useState} from 'react';
import {createFormActions} from '@formily/antd';
import {Button, Input, message, Space, Modal as AntModal} from 'antd';
import {useHistory} from 'ice';
import {FileOutlined} from '@ant-design/icons';
import Table from '@/components/Table';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import PaymentEdit from '@/pages/Purshase/Payment/PaymentEdit';
import {paymentList} from '@/pages/Purshase/Payment/PaymentUrl';
import {useRequest} from '@/util/Request';
import Form from '@/components/Form';
import {Money, Status} from '@/pages/Purshase/Payment/PaymentField';
import ThousandsSeparator from '@/components/ThousandsSeparator';
import Modal from '@/components/Modal';
import {isArray} from '@/util/Tools';
import FileUpload from '@/components/FileUpload';

const formActionsPublic = createFormActions();
const {FormItem} = Form;

const PaymentList = (
  {
    orderId,
    onClose = () => {
    }
  }, ref) => {

  const editRef = useRef(null);
  const tableRef = useRef(null);

  const showFileRef = useRef(null);

  const [item, setItem] = useState({});

  const compoentRef = useRef();

  const history = useHistory();

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

  useImperativeHandle(ref, () => ({
    refresh: tableRef.current.submit
  }));

  const searchForm = () => {
    return <>
      <FormItem label="金额" name="money" component={Money} />
      <FormItem hidden={orderId} name="orderId" value={orderId} component={Input} />
      <FormItem label="订单状态" name="status" component={Status} />
    </>;
  };

  const actions = () => {
    return (
      <>
        <AddButton onClick={() => {
          editRef.current.open(false);
        }} />
      </>
    );
  };

  let columns = [
    {
      dataIndex: 'paymentAmount', width: 120, title: '金额(人民币)', align: 'right', render: (value) => {
        return <ThousandsSeparator prefix="￥" value={value} />;
      }
    },
  ];

  if (!orderId) {
    columns = [...columns, {
      dataIndex: 'coding', title: '关联订单', render: (value, record) => {
        return <>
          <Button type="link" onClick={() => {
            onClose();
            history.push(`/purchase/order/detail?id=${record.orderId}`);
          }}>{value}</Button>
        </>;
      }
    }];
  }

  columns = [
    ...columns,
    {
      dataIndex: 'enclosureId', title: '附件', width: 120, align: 'center', render: (value, record) => {
        return <Button type="link" onClick={() => {
          showFileRef.current.open(true);
          setItem(record);
        }}><FileOutlined /> x {isArray(record.mediaUrlResults).length}</Button>;
      }
    },
    {dataIndex: 'paymentDate', title: '付款时间', width: 200, align: 'center'},
    {dataIndex: 'remark', title: '备注'},
    {},
    {
      dataIndex: 'orderId', title: '操作', width: 150, align: 'center', render: (value, record) => {
        return <>
          <EditButton onClick={() => {
            editRef.current.open(record.recordId);
          }} />
          <Button
            disabled={record.status === 50}
            loading={fetches[record.recordId]?.loading}
            type="link"
            danger
            onClick={() => {
              AntModal.confirm({
                centered: true,
                title: '作废之后不可恢复！',
                content: '是否进行作废操作？',
                okText: '作废',
                okButtonProps: {danger: true},
                cancelText: '取消',
                onOk() {
                  return run({data: {recordId: record.recordId}});
                },
              });
            }}
          >
            {record.status === 50 ? '已作废' : '作废'}
          </Button>
        </>;
      }
    },
  ];

  return (
    <>
      <Table
        emptyAdd={<Button type="link" onClick={() => editRef.current.open(false)}>暂无数据，请添加</Button>}
        searchStyle={{padding: orderId && 0}}
        maxHeight="auto"
        unsetOverflow
        noTableColumnSet
        columns={columns}
        listHeader={false}
        cardHeaderStyle={{display: 'none'}}
        formActions={formActionsPublic}
        api={paymentList}
        rowKey="recordId"
        searchForm={searchForm}
        noRowSelection
        contentHeight
        actions={actions()}
        ref={tableRef}
      />


      {orderId
        ?
        <Modal
          compoentRef={compoentRef}
          title="付款记录"
          noButton
          orderId={orderId}
          component={PaymentEdit}
          onSuccess={() => {
            tableRef.current.refresh();
            editRef.current.close();
          }}
          footer={<Space>
            <Button onClick={() => {
              editRef.current.close();
            }}>
              取消
            </Button>
            <Button type="primary" onClick={() => {
              compoentRef.current.submit();
            }}>
              确定
            </Button>
          </Space>}
          ref={editRef}
        />
        :
        <Drawer width={800} title="付款记录" orderId={orderId} component={PaymentEdit} onSuccess={() => {
          tableRef.current.refresh();
          editRef.current.close();
        }} ref={editRef} />}

      <Modal
        headTitle="查看附件"
        ref={showFileRef}
      >
        <div style={{padding: 16}}>
          <FileUpload privateUpload show value={item.field} />
        </div>
      </Modal>
    </>
  );
};

export default React.forwardRef(PaymentList);
