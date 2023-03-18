import React, {useState} from 'react';
import {Button, Card, Descriptions, Space} from 'antd';
import {config, useHistory, useParams} from 'ice';
import cookie from 'js-cookie';
import ProSkeleton from '@ant-design/pro-skeleton';
import {useRequest} from '@/util/Request';
import Icon from '@/components/Icon';
import {contractDetail} from '@/pages/Crm/contract/ContractUrl';
import OrderDetailTable from '@/pages/Crm/contract/components/OrderDetailTable';
import {orderDetail} from '@/pages/Erp/order/OrderUrl';
import Empty from '@/components/Empty';
import {isArray} from '@/util/Tools';
import InvoiceList from '@/pages/Purshase/Invoice/InvoiceList';
import DetailLayout from '@/components/DetailLayout';
import PaymentList from '@/pages/Purshase/Payment/PaymentList';
import ThousandsSeparator from '@/components/ThousandsSeparator';

const {baseURI} = config;

const Detail = ({id}) => {

  const token = cookie.get('tianpeng-token');

  const params = useParams();

  const history = useHistory();

  const [loading, setLoading] = useState(true);

  const {data: contract, run} = useRequest(contractDetail,
    {
      manual: true,
      onSuccess: () => setLoading(false),
      onError: () => setLoading(false)
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
    },
    onError: () => setLoading(false)
  });
  console.log(data);

  if (loading) {
    return (<ProSkeleton type="descriptions" />);
  }

  if (!data) {
    return <Empty />;
  }

  return <DetailLayout
    extra={<Space>
      <Button type="link" onClick={() => {
        const paymentResult = data.paymentResult || {};
        history.push({
          pathname: '/purchase/order/createOrder',
          search: `?module=${data.type === 1 ? 'PO' : 'SO'}`,
          state: {
            ...paymentResult,
            ...data,
            detailParams: isArray(data.detailResults).length > 0 ? isArray(data.detailResults).map(item => ({
              ...item,
              totalPrice: item.totalPrice,
              onePrice: item.onePrice
            })) : null,
            paymentDetail: paymentResult.detailResults,
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
    </Space>}
  >
    <div id="基本信息">
      <Card bordered={false} title="基本信息">
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

    <div id="卖方信息">
      <Card bordered={false} title="卖方信息">
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

    <div id="买方信息">
      <Card bordered={false} title="买方信息">
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

    <div id="产品明细">
      <Card bordered={false} title="产品明细">
        <OrderDetailTable orderId={data.orderId} />
      </Card>
    </div>

    <div id="财务信息">
      <Card bordered={false} title="财务信息">
        <Descriptions>
          <Descriptions.Item label="总金额">
            <ThousandsSeparator prefix="￥" value={data.paymentResult?.totalAmount || 0} />
          </Descriptions.Item>
          <Descriptions.Item label="币种">{data.currency || '--'}</Descriptions.Item>
          <Descriptions.Item label="票据类型">{data.paymentResult?.paperType ? '专票' : '普票'}</Descriptions.Item>
          <Descriptions.Item label="浮动金额">
            <ThousandsSeparator prefix="￥" value={data.paymentResult?.floatingAmount || 0} />
          </Descriptions.Item>
          <Descriptions.Item label="是否含运费" span={2}>
            {data.paymentResult?.freight ? '是' : '否'}
          </Descriptions.Item>
          <Descriptions.Item label="采购总价">
            <ThousandsSeparator prefix="￥" value={data.paymentResult?.money || 0} />
          </Descriptions.Item>
          <Descriptions.Item label="结算方式">
            {data.payMethod || '---'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>

    <div id="付款记录">
      <Card bordered={false} title="付款记录">
        <PaymentList orderId={data.orderId} />
      </Card>
    </div>

    <div id="发票信息">
      <Card bordered={false} title="发票信息">
        <InvoiceList orderId={data.orderId} />
      </Card>
    </div>
  </DetailLayout>;

};

export default Detail;
