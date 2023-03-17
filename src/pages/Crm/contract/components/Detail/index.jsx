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

    <div id="付款记录">
      <Card bordered={false} title="付款记录">
        <InvoiceList PaymentList={data.orderId} />
      </Card>
    </div>

    <div id="发票信息">
      <Card bordered={false} title="发票信息">
        <InvoiceList orderId={data.orderId} />
      </Card>
    </div>

    <div id="合同内容">
      <Card bordered={false} title="合同内容">
        <Empty description="开发中..." />
      </Card>
    </div>
  </DetailLayout>;

};

export default Detail;
