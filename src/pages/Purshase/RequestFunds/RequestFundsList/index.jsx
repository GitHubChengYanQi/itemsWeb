import React, {useImperativeHandle, useRef, useState} from 'react';
import {Avatar, Badge, Button, Input, Modal as AntModal, Space, Tag} from 'antd';
import {createFormActions} from '@formily/antd';
import {Order} from 'MES-Apis/lib/Order/promise';
import {UserOutlined} from '@ant-design/icons';
import {RequestFundStatus} from '@/pages/Purshase/Payment/PaymentField';
import ThousandsSeparator from '@/components/ThousandsSeparator';
import Table from '@/components/Table';
import Form from '@/components/Form';
import PaymentEdit from '@/pages/Purshase/Payment/PaymentEdit';
import Modal from '@/components/Modal';
import RequestFundsDetail from '@/pages/Purshase/RequestFunds/RequestFundsDetail';
import styles from './index.module.less';
import RequestFundsAdd from '@/pages/Purshase/RequestFunds/RequestFundsAdd';

const {FormItem} = Form;

const formActionsPublic = createFormActions();

export const statusData = (status) => {
  let text = '';
  let color = '';
  switch (status) {
    case 'AUDITING':
    case 0:
    case 1:
      text = '审批中';
      color = '#1677ff';
      break;
    case 'PASSED':
    case 2:
      text = '已同意';
      color = '#52c41a';
      break;
    case 3:
    case 'REJECTED':
      text = '已驳回';
      color = '#ff4d4f';
      break;
    case 4:
    case 'UNDONE':
      text = '已撤销';
      color = 'rgba(0,0,0,.25)';
      break;
    case 6:
    case 'PASS_UNDONE':
      text = '通过后撤销';
      color = '#faad14';
      break;
    case 7:
    case 'DELETED':
      text = '已删除';
      color = '#faad14';
      break;
    case 10:
    case 'ALREADY_PAY':
      text = '已支付';
      color = '#52c41a';
      break;
    default:
      text = '已完成';
      color = '#52c41a';
      break;
  }
  return {
    text,
    color
  };
};

const RequestFundsList = (
  {
    orderId,
    order,
    complete = () => {
    }
  }, ref) => {

  const tableRef = useRef(null);

  const requestFundsRef = useRef();

  const addRequestFundsRef = useRef();

  const compoentRef = useRef();

  const detailRef = useRef();

  const addRecordRef = useRef(null);

  const [addRequestFundsLoading, setAddRequestFundsLoading] = useState(false);

  const [record, setRecord] = useState({});

  const [status, setStatus] = useState({});
  const [processName, setProcessName] = useState('');

  useImperativeHandle(ref, () => ({
    refresh: tableRef.current.submit
  }));

  const searchForm = () => {
    return <>
      <FormItem hidden={orderId} name="orderId" value={orderId} component={Input} />
      <FormItem label="请款状态" name="status" component={RequestFundStatus} />
    </>;
  };

  const columns = [
    {
      dataIndex: 'userResult', title: '申请人', width: 200, align: 'right', render: (userResult) => {
        return <div>{userResult?.name || '无'}</div>;
      }
    },
    {
      dataIndex: 'newMoney', width: 120, title: '付款金额', align: 'right', render: (value) => {
        return <ThousandsSeparator prefix="￥" value={value} />;
      }
    },
    {
      dataIndex: 'status', width: 100, title: '状态', align: 'center', render: (value) => {
        let badgeStatus = '';
        switch (value) {
          case 0:
          case 1:
            badgeStatus = 'processing';
            break;
          case 2:
          case 10:
            badgeStatus = 'success';
            break;
          case 3:
            badgeStatus = 'error';
            break;
          case 4:
            badgeStatus = 'default';
            break;
          case 6:
          case 7:
            badgeStatus = 'warning';
            break;
          default:
            badgeStatus = 'success';
            break;
        }
        return <Badge
          status={badgeStatus}
          text={<span style={{color: statusData(value).color}}>{statusData(value).text}</span>}
        />;
      }
    },
    {dataIndex: 'createTime', width: 200, title: '申请时间', align: 'center'},
    {dataIndex: 'doneTime', width: 200, title: '最后审批时间', align: 'center'},
    {},
    {
      dataIndex: 'orderId', title: '操作', width: 150, align: 'center', render: (value, record) => {
        const {color, text} = statusData(record.status);
        return <Space>
          <Button
            type="link"
            onClick={() => {
              detailRef.current.open(true);
              setRecord({...record, statusName: record.status === 2 ? '已通过' : text, statusColor: color});
            }}
          >
            详情
          </Button>
          <Button
            disabled={record.status !== 2}
            type="link"
            onClick={() => {
              AntModal.confirm({
                centered: true,
                title: '此操作会增加对应付款记录',
                content: '请选择是否同步',
                okText: '同步',
                cancelText: '取消',
                onOk: () => {
                  setRecord(record);
                  addRecordRef.current.open(false);
                },
              });
            }}
          >
            {record.status === 2 ? '同步到付款记录' : text}
          </Button>
        </Space>;
      }
    },
  ];

  return (
    <>
      <Table
        emptyAdd={<Button type="link" onClick={() => requestFundsRef.current.open(false)}>暂无数据，请添加</Button>}
        actions={<Button type="primary" onClick={() => {
          requestFundsRef.current.open(true);
        }}>请款申请</Button>}
        searchStyle={{padding: orderId && 0}}
        maxHeight="auto"
        unsetOverflow
        noTableColumnSet
        columns={columns}
        listHeader={false}
        cardHeaderStyle={{display: 'none'}}
        formActions={formActionsPublic}
        service={Order.requestFundsList}
        rowKey="spNo"
        searchForm={searchForm}
        noRowSelection
        contentHeight
        ref={tableRef}
      />

      <Modal
        compoentRef={compoentRef}
        title="付款记录"
        noButton
        requestFunds={record}
        orderId={orderId}
        component={PaymentEdit}
        onSuccess={() => {
          tableRef.current.refresh();
          addRecordRef.current.close();
          complete();
        }}
        footer={<Space>
          <Button onClick={() => {
            addRecordRef.current.close();
          }}>
            取消
          </Button>
          <Button type="primary" onClick={() => {
            compoentRef.current.submit();
          }}>
            确定
          </Button>
        </Space>}
        ref={addRecordRef}
      />

      <Modal
        width={800}
        headTitle={<div className={styles.detailHeader}>
          <Avatar
            style={{borderRadius: 4}}
            src={record.userResult?.avatar}
            shape="square"
            icon={<UserOutlined />}
          />
          <div>{record.userResult?.name}</div>
          <div>的{processName}</div>
          <Tag color={status.color}>{status.text}</Tag>
        </div>}
        ref={detailRef}
        footer={<div>
          <Button onClick={() => {
            detailRef.current.close();
          }}>取消</Button>
          <Button type="primary" onClick={() => {
            const newWindow = window.open('');
            newWindow.document.body.innerHTML = document.getElementById('printTemplate').innerHTML;
            newWindow.print();
            newWindow.close();
          }}>打印</Button>
        </div>}
      >
        <RequestFundsDetail record={record} onDetail={(info) => {
          setStatus(statusData(info?.spStatus));
          setProcessName(info?.spName);
        }} />
      </Modal>


      <Modal
        mask={false}
        width={820}
        headTitle="请款申请"
        ref={requestFundsRef}
        footer={<Space>
          <Button onClick={() => {
            requestFundsRef.current.close();
          }}>
            取消
          </Button>
          <Button onClick={() => {
            addRequestFundsRef.current.reset();
          }}>
            重置
          </Button>
          <Button
            type="primary"
            loading={addRequestFundsLoading}
            onClick={() => {
              addRequestFundsRef.current.submit();
            }}>
            保存
          </Button>
        </Space>}
      >
        <RequestFundsAdd
          onLoading={setAddRequestFundsLoading}
          remark={order.paymentResult?.remark}
          contactsName={order.bcustomer?.customerName}
          bankAccount={order.partyBBankAccount}
          bankName={order.bbank?.bankName}
          money={order.paymentResult?.totalAmount}
          orderId={orderId}
          ref={addRequestFundsRef}
          onSuccess={() => {
            tableRef.current.refresh();
            requestFundsRef.current.close();
          }}
        />
      </Modal>
    </>
  );
};

export default React.forwardRef(RequestFundsList);
