/**
 * 列表页
 *
 * @author song
 * @Date 2022-02-24 14:55:10
 */

import React, {useRef, useState} from 'react';
import {createFormActions} from '@formily/antd';
import {Button, Image, Input, message, Space} from 'antd';
import {useHistory} from 'ice';
import {FileImageOutlined} from '@ant-design/icons';
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

const formActionsPublic = createFormActions();
const {FormItem} = Form;

const PaymentList = (
  {
    orderId,
    onClose = () => {
    }
  }) => {

  const [preview, setPreview] = useState([]);

  const ref = useRef(null);
  const tableRef = useRef(null);

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
          ref.current.open(false);
        }} />
      </>
    );
  };

  let columns = [
    {
      dataIndex: 'paymentAmount', title: '金额(人民币)', align: 'right', render: (value) => {
        return <ThousandsSeparator prefix='￥' value={value} />;
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
      dataIndex: 'enclosureId', title: '附件', align: 'center', render: (value, record) => {
        return <Button type="link" onClick={() => {
          setPreview(isArray(record.mediaUrlResults).map(item => item.url));
        }}><FileImageOutlined /> x {isArray(record.mediaUrlResults).length}</Button>;
      }
    },
    {dataIndex: 'remark', title: '备注'},
    {dataIndex: 'paymentDate', title: '付款时间', width: 200, align: 'center'},
    {},
    {
      dataIndex: 'orderId', title: '操作', width: 150, align: 'center', render: (value, record) => {
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
            ref.current.close();
          }}
          footer={<Space>
            <Button onClick={() => {
              ref.current.close();
            }}>
              取消
            </Button>
            <Button type="primary" onClick={() => {
              compoentRef.current.submit();
            }}>
              确定
            </Button>
          </Space>}
          ref={ref}
        />
        :
        <Drawer width={800} title="付款记录" orderId={orderId} component={PaymentEdit} onSuccess={() => {
          tableRef.current.refresh();
          ref.current.close();
        }} ref={ref} />}

      <Image.PreviewGroup
        preview={{visible: preview.length > 0, onVisibleChange: (vis) => setPreview(vis ? preview : [])}}>
        {
          preview.map((item, index) => {
            return <Image
              key={index}
              src={item}
            />;
          })
        }
      </Image.PreviewGroup>
    </>
  );
};

export default PaymentList;
