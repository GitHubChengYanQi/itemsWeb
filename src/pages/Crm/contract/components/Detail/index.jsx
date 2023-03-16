import React, {useState} from 'react';
import {Button, Card, Descriptions, Space, Tabs} from 'antd';
import {config, useHistory, useParams} from 'ice';
import cookie from 'js-cookie';
import ProSkeleton from '@ant-design/pro-skeleton';
import {useRequest} from '@/util/Request';
import Icon from '@/components/Icon';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './index.module.scss';
import {contractDetail} from '@/pages/Crm/contract/ContractUrl';
import OrderDetailTable from '@/pages/Crm/contract/components/OrderDetailTable';
import {orderDetail} from '@/pages/Erp/order/OrderUrl';
import Empty from '@/components/Empty';
import {isArray} from '@/util/Tools';
import PaymentList from '@/pages/Purshase/Payment/PaymentList';
import InvoiceList from '@/pages/Purshase/Invoice/InvoiceList';

const {baseURI} = config;

const Detail = ({id}) => {

  const token = cookie.get('tianpeng-token');

  const params = useParams();

  const history = useHistory();

  const [loading, setLoading] = useState(true);

  const {data: contract, run} = useRequest(contractDetail,
    {
      manual: true,
      onSuccess: () => setLoading(false)
    });

  const {data} = useRequest(orderDetail, {
    defaultParams: {
      data: {
        orderId: id || params.id,
      }
    },
    onSuccess: (res) => {
      if (res && res.contractId) {
        setLoading(false);
        run({
          data: {contractId: res.contractId}
        });
        return;
      }
      setLoading(false);
    }
  });


  if (loading) {
    return (<ProSkeleton type="descriptions" />);
  }

  if (!data) {
    return <Empty />;
  }

  return <div className={styles.detail}>
    <Card title={<Breadcrumb />} bodyStyle={{padding: 0}} />
    <div className={styles.main}>
      <Card title="基本信息" extra={<Space>
        <Button type="link" onClick={() => {
          const paymentResult = data.paymentResult || {};
          history.push({
            pathname: '/purchase/order/createOrder',
            search: `?module=${data.type === 1 ? 'PO' : 'SO'}`,
            state: {
              ...paymentResult,
              ...data,
              money: data.money / 100,
              floatingAmount: data.floatingAmount / 100,
              totalAmount: data.totalAmount / 100,
              detailParams: isArray(data.detailResults).length > 0 ? isArray(data.detailResults).map(item => ({
                ...item,
                totalPrice: item.totalPrice / 100,
                onePrice: item.onePrice / 100
              })) : null,
              paymentDetail: isArray(paymentResult.detailResults).length > 0 ? isArray(paymentResult.detailResults).map(item => ({
                ...item,
                money: item.money / 100,
              })) : 0,
              templateId: contract?.templateId,
              contractCoding: contract?.coding,

            }
          });
        }}>再来一单</Button>
        {contract &&
        <a
          href={`${baseURI}Excel/exportContractWord?id=${contract.contractId}&authorization=${token}`}
          target="_blank"
          rel="noreferrer">
          合同导出word
        </a>
        }
        <Button
          onClick={() => {
            history.goBack();
          }}><Icon type="icon-back" />返回</Button>
      </Space>}>
        <Descriptions>
          <Descriptions.Item label="订单编码">
            {data.coding}
          </Descriptions.Item>
          <Descriptions.Item label="主题">{data.theme || '--'}</Descriptions.Item>
          <Descriptions.Item label="创建人">--</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {data.createTime}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>

    <div className={styles.main}>
      <Card title="卖方信息">
        <Descriptions>
          <Descriptions.Item label="公司名称">
            <Button type="link" style={{padding: 0, height: 'fit-content'}} onClick={() => {
              history.push(`/CRM/customer/${data.partyA}`);
            }}>{data.acustomer ? data.acustomer.customerName : null}
            </Button>
          </Descriptions.Item>
          <Descriptions.Item label="联系人">{data.acontacts?.contactsName || '--'}</Descriptions.Item>
          <Descriptions.Item label="联系人电话">{data.aphone?.phoneNumber || '--'}</Descriptions.Item>
          <Descriptions.Item label="公司地址">
            {data.aadress ? (data.aadress.detailLocation || data.aadress.location) : '---'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>

    <div className={styles.main}>
      <Card title="买方信息">
        <Descriptions>
          <Descriptions.Item label="公司名称">
            <Button type="link" style={{padding: 0, height: 'fit-content'}} onClick={() => {
              history.push(`/CRM/customer/${data.partyBA}`);
            }}>{data.bcustomer ? data.bcustomer.customerName : null}
            </Button>
          </Descriptions.Item>
          <Descriptions.Item label="联系人">{data.bcontacts?.contactsName || '--'}</Descriptions.Item>
          <Descriptions.Item label="联系人电话">{data.bphone?.phoneNumber || '--'}</Descriptions.Item>
          <Descriptions.Item label="公司地址">
            {data.badress ? (data.badress.detailLocation || data.badress.location) : '---'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>


    <div className={styles.main}>
      <Card>
        <Tabs destroyInactiveTabPane defaultActiveKey="1" items={[
          {key: '1', label: '产品明细', children: <OrderDetailTable orderId={data.orderId} />},
          {key: '2', label: '付款记录', children: <PaymentList orderId={data.orderId} />},
          {key: '3', label: '发票信息', children: <InvoiceList orderId={data.orderId} />},
          ...(contract ? [{key: '3', label: '合同内容', children: <Empty description="开发中..." />}] : []),
        ]} />
      </Card>
    </div>
  </div>;

};

export default Detail;
