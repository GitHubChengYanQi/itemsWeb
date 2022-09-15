import React from 'react';
import {Button, Card, Descriptions, Space, Tabs} from 'antd';
import {config, useParams} from 'ice';
import ProSkeleton from '@ant-design/pro-skeleton';
import cookie from 'js-cookie';
import {useRequest} from '@/util/Request';
import Icon from '@/components/Icon';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './index.module.scss';
import {contractDetail} from '@/pages/Crm/contract/ContractUrl';
import OrderDetailTable from '@/pages/Crm/contract/components/OrderDetailTable';
import PayTable from '@/pages/Crm/contract/components/PayTable';
import {orderDetail} from '@/pages/Erp/order/OrderUrl';
import Empty from '@/components/Empty';

const {TabPane} = Tabs;

const {baseURI} = config;

const Detail = ({id}) => {

  const token = cookie.get('tianpeng-token');

  const params = useParams();

  const {loading: contractLoading, data: contract, run} = useRequest(contractDetail, {manual: true});

  const {loading, data} = useRequest(orderDetail, {
    defaultParams: {
      data: {
        orderId: id || params.id,
      }
    },
    onSuccess: (res) => {
      if (res && res.contractId) {
        run({
          data: {contractId: res.contractId}
        });
      }
    }
  });


  if (loading || contractLoading) {
    return (<ProSkeleton type="descriptions" />);
  }

  if (!data) {
    return <Empty />;
  }

  return <div className={styles.detail}>
    <Card title={<Breadcrumb />} bodyStyle={{padding: 0}} />
    <div className={styles.main}>
      <Card title="基本信息" extra={<Space>
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
            history.back();
          }}><Icon type="icon-back" />返回</Button>
      </Space>}>
        <Descriptions column={2}>
          <Descriptions.Item label="甲方信息">
            <div style={{cursor: 'pointer'}} onClick={() => {
              history.push(`/CRM/customer/${data.partyA}`);
            }}>
              <strong>{data.acustomer ? data.acustomer.customerName : null}</strong>
              <div>
                <em>联系人：{data.acontacts ? data.acontacts.contactsName : '--'}</em>&nbsp;&nbsp;/&nbsp;&nbsp;
                <em>电话：{data.aphone ? data.aphone.phoneNumber : '--'}</em></div>
              <div>
                <em>{data.aadress ? (data.aadress.detailLocation || data.aadress.location) : '---'}</em>
              </div>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="乙方信息">
            <div style={{cursor: 'pointer'}} onClick={() => {
              history.push(`/CRM/customer/${data.partyB}`);
            }}>
              <strong>{data.bcustomer ? data.bcustomer.customerName : null}</strong>
              <div>
                <em>联系人：{data.bcontacts ? data.bcontacts.contactsName : '--'}</em>&nbsp;&nbsp;/&nbsp;&nbsp;
                <em>电话：{data.bphone ? data.bphone.phoneNumber : '--'}</em></div>
              <div>
                <em>{data.badress ? (data.badress.detailLocation || data.badress.location) : '---'}</em>
              </div>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>

    <div
      className={styles.main}
    >
      <Card>
        <Tabs defaultActiveKey="1" items={[
          ...(contract ? [{key: '1', label: '合同内容', children: <Empty description="开发中..." />}] : []),
          {key: '2', label: '产品明细', children: <OrderDetailTable orderId={data.orderId} />},
          {key: '3', label: '付款信息', children: <PayTable payment={data.paymentResult} />},
        ]} />
      </Card>
    </div>
  </div>;

};

export default Detail;
