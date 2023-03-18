/**
 * 采购单列表页
 *
 * @author song
 * @Date 2022-01-13 13:09:54
 */

import React, {useRef, useState} from 'react';
import {
  Badge,
  Button,
  Divider,
  Dropdown,
  Input,
  message,
  Popover,
  Progress,
  Select,
  Space,
  Spin,
  Tag,
  Modal as AntModal
} from 'antd';
import {useHistory, useLocation} from 'ice';
import moment from 'moment';
import {CheckCircleOutlined, ExclamationCircleOutlined, QuestionCircleOutlined, SyncOutlined} from '@ant-design/icons';
import Table from '@/components/Table';
import Form from '@/components/Form';
import Breadcrumb from '@/components/Breadcrumb';
import {orderDetail, orderList} from '@/pages/Erp/order/OrderUrl';
import Modal from '@/components/Modal';
import CreateContract from '@/pages/Order/CreateContract';
import Render from '@/components/Render';
import {Customer} from '@/pages/Order/CreateOrder/components/CustomerAll';
import {request, useRequest} from '@/util/Request';
import {contractDetail} from '@/pages/Crm/contract/ContractUrl';
import {isArray} from '@/util/Tools';
import ThousandsSeparator from '@/components/ThousandsSeparator';
import styles from '@/pages/Order/Statistics/index.module.less';
import {orderDoneOrder, orderListView} from '@/pages/Order/url';
import DatePicker from '@/components/DatePicker';
import Message from '@/components/Message';

const {FormItem} = Form;

const OrderTable = (props) => {

  const history = useHistory(null);
  const tableRef = useRef(null);

  const {state} = useLocation();

  const initialData = state || {};

  const createContractRef = useRef();

  const compoentRef = useRef();

  const [loading, setLoading] = useState(false);

  const {loading: viewLoading, run: viewRun, data: viewData = {}} = useRequest(orderListView, {
    manual: true
  });

  const {run: doneRun} = useRequest(orderDoneOrder, {
    manual: true,
    onSuccess: () => {
      Message.success('操作成功！');
      tableRef.current.refresh();
    }
  });

  let module = {};
  switch (props.location.pathname) {
    case '/CRM/order':
      module = {
        title: '销售单列表',
        createTitle: '创建销售单',
        createRoute: '/CRM/order/createOrder?module=SO',
        module: 'SO',
        type: 2,
      };
      break;
    case '/purchase/order':
      module = {
        title: '采购单列表',
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
        <FormItem
          label="创建时间"
          name="time"
          component={DatePicker}
          RangePicker
          value={initialData.startTime ? [initialData.startTime, initialData.endTime] : []}
        />
        <FormItem
          label="状态"
          name="status"
          component={({value, onChange}) => {
            return <Select
              style={{width: 100}}
              defaultValue="all"
              value={typeof value === 'number' ? value : 'all'}
              options={[{label: '全部', value: 'all'}, {label: '已完成', value: 99}, {label: '进行中', value: 0}]}
              onChange={(value) => {
                onChange(value === 'all' ? null : value);
              }}
            />;
          }}
        />
        <FormItem hidden name="type" value={module.type} component={Input} />
      </>
    );
  };

  const items = (record) => [
    {
      key: '1',
      label: (
        <Button style={{padding: 0}} type="link" onClick={async () => {
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
      ),
    },
    {
      key: '2',
      label: (
        <Button style={{padding: 0}} disabled={record.contractId || record.fileId} type="link" onClick={() => {
          createContractRef.current.open(record.orderId);
        }}>创建合同</Button>
      )
    },
    {
      key: '3',
      label: (
        <Button style={{padding: 0}} disabled={record.status === 99} type="link" onClick={() => {
          AntModal.confirm({
            centered: true,
            title: '确定完成订单吗？',
            icon: <ExclamationCircleOutlined />,
            okButtonProps: {ghost: true},
            okText: '确认',
            cancelText: '取消',
            onOk() {
              return doneRun({
                data: {
                  orderId: record.orderId
                }
              });
            }
          });
        }}>完成订单</Button>
      )
    }
  ];

  const columns = [
    {
      title: '采购单编号',sorter: true, dataIndex: 'coding', render: (value, record) => {
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
      }
    },
    {title: '主题', dataIndex: 'theme', render: (value) => <Render text={value || '-'} />},
    {
      title: module.type === 1 ? '卖方' : '买方',
      dataIndex: 'acustomer',
      hidden: module.type === 1,
      render: (value) => <Render text={value?.customerName || '-'} />
    },
    {
      title: module.type === 2 ? '卖方' : '买方',
      dataIndex: 'bcustomer',
      hidden: module.type === 2,
      render: (value) => <Render text={value?.customerName || '-'} />
    },
    {
      title: '单据状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: (value) => {
        if (value !== 99) {
          return <Tag icon={<SyncOutlined />} color="processing">
            进行中
          </Tag>;
        }
        return <>
          <Tag icon={<CheckCircleOutlined />} color="success">
            完成
          </Tag>
        </>;
      }
    },
    {
      title: <Space>
        付款信息
        <Popover
          placement="top"
          content={<Space split={<Divider type="vertical" />}>
            <Badge color="#000" text="总金额" />
            <Badge color="green" text="付款金额" />
            <Badge color="red" text="未付金额" />
          </Space>}
        >
          <QuestionCircleOutlined />
        </Popover>
      </Space>,
      align: 'center',
      render: (value, record) => {
        let totalPrice = 0;
        isArray(record.detailResults).forEach(item => {
          totalPrice += item.totalPrice;
        });

        let number = 0;
        isArray(record.paymentRecordResults).forEach(item => {
          number += item.paymentAmount;
        });
        return <Render width={300}>
          <Space size={12} split={<Divider type="vertical" />}>
            <ThousandsSeparator value={totalPrice} prefix="￥" />
            <ThousandsSeparator className={styles.green} value={number} prefix="￥" />
            <ThousandsSeparator
              className={styles.red}
              value={(totalPrice - number) > 0 ? (totalPrice - number) : 0}
              prefix="￥"
            />
          </Space>

        </Render>;
      }
    },
    {
      title: '付款进度',
      align: 'center',
      sorter: true,
      dataIndex: 'paymentRate',
      hidden: module.type === 2,
      render: (value) => {
        return <Render width={200}>
          <Progress percent={value || 0} />
        </Render>;
      }
    },
    {
      title: '入库进度',
      align: 'center',
      sorter: true,
      dataIndex: 'inStockRate',
      hidden: module.type === 2,
      render: (value) => {
        return <Render width={200}>
          <Progress percent={value || 0} />
        </Render>;
      }
    },
    {
      title: '创建人',
      dataIndex: 'user',
      width: 100,
      align: 'center',
      render: (value) => <Render text={value?.name || '-'} />
    },
    {title: '创建时间', align: 'center', width: 170, dataIndex: 'createTime'},
    {
      title: '操作',
      width: 150,
      align: 'center',
      dataIndex: 'theme',
      fixed: 'right',
      render: (value, record) => {
        return <>
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
          <Dropdown
            menu={{
              items: items(record),
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                更多操作
              </Space>
            </a>
          </Dropdown>
        </>;
      }
    },
  ];

  return (
    <>
      <Table
        isModal={false}
        formSubmit={(values) => {
          if (isArray(values.time).length > 0) {
            values = {
              ...values,
              startTime: moment(values.time[0]).format('YYYY/MM/DD 00:00:00'),
              endTime: moment(values.time[1]).format('YYYY/MM/DD 23:59:59'),
            };
          } else {
            values = {
              ...values,
              startTime: null,
              endTime: null,
            };
          }
          viewRun({data: values});
          return values;
        }}
        columns={columns}
        noRowSelection
        title={<Breadcrumb title={module.title} />}
        api={orderList}
        rowKey="orderId"
        tableKey="order"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
        footerAlign="right"
        footer={() => {
          return viewLoading ? <Spin /> : <div className={styles.total}>
            总金额：
            <span className={styles.number}>
              <ThousandsSeparator
                prefix="¥"
                className={styles.money}
                value={viewData.totalPrice}
              />
            </span>

            付款金额：
            <span className={styles.number}>
              <ThousandsSeparator
                prefix="¥"
                className={styles.money}
                value={viewData.paymentPrice}
              />
            </span>

            未付金额：
            <span className={styles.number}>
              <ThousandsSeparator
                prefix="¥"
                className={styles.money}
                value={viewData.deficientPrice > 0 ? viewData.deficientPrice : 0}
              />
            </span>

            供应商总数： <span className={styles.number}>{viewData.sellerCount || 0}</span>

            物料种类： <span className={styles.number}>{viewData.skuCount || 0}</span>

            物料总数：<span className={styles.number}>{viewData.purchaseNumber || 0}</span>

            入库总数：<span className={styles.number}>{viewData.inStockCount || 0}</span>

            入库进度：<span className={styles.number}>{viewData.inStockRate || 0} %</span>
          </div>;
        }}
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
