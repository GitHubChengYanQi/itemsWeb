import React, {useRef, useState} from 'react';
import {Button, Card, Descriptions, Progress, Space} from 'antd';
import {config, useHistory, useParams} from 'ice';
import cookie from 'js-cookie';
import ProSkeleton from '@ant-design/pro-skeleton';
import {useRequest} from '@/util/Request';
import {contractDetail} from '@/pages/Crm/contract/ContractUrl';
import OrderDetailTable from '@/pages/Crm/contract/components/OrderDetailTable';
import {orderDetail} from '@/pages/Erp/order/OrderUrl';
import Empty from '@/components/Empty';
import {isArray} from '@/util/Tools';
import InvoiceList from '@/pages/Purshase/Invoice/InvoiceList';
import DetailLayout from '@/components/DetailLayout';
import PaymentList from '@/pages/Purshase/Payment/PaymentList';
import ThousandsSeparator from '@/components/ThousandsSeparator';
import RequestFundsList from '@/pages/Purshase/RequestFunds/RequestFundsList';
import Modal from '@/components/Modal';
import RelevanceTasks from '@/pages/Crm/contract/components/Detail/components/RelevanceTasks';
import styles from './index.module.scss';
import FileUpload from '@/components/FileUpload';

const {baseURI} = config;

const addFiles = {url: '/order/addFile', method: 'POST'};

const Detail = ({id}) => {

  const token = cookie.get('tianpeng-token');

  const uploadRef = useRef();

  const params = useParams();

  const orderId = id || params.id;

  const history = useHistory();

  const requestFundsListRef = useRef();

  const paymentListRef = useRef();

  const relevanceTasksRef = useRef();

  const [loading, setLoading] = useState(true);

  const {loading: addFilesLoading, run: addFilesRun} = useRequest(addFiles, {
    manual: true,
  });

  const {data: contract, run} = useRequest(contractDetail,
    {
      manual: true,
      onSuccess: () => setLoading(false),
      onError: () => setLoading(false)
    });

  const {data} = useRequest(orderDetail, {
    defaultParams: {
      data: {
        orderId,
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

  if (loading) {
    return (<ProSkeleton type="descriptions" />);
  }

  if (!data) {
    return <Empty />;
  }

  const cardProps = {
    bordered: false,
    bodyStyle: {padding: 16},
    headStyle: {fontWeight: 'bold'}
  };

  return <div>
    <DetailLayout
      title="采购单详情"
      extra={<Space>
        <Button type="primary" ghost onClick={() => {
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
              paymentDetail: isArray(paymentResult.detailResults).length > 0 ? paymentResult.detailResults : null,
              templateId: contract?.templateId,
              contractCoding: contract?.coding,
            }
          });
        }}>再来一单</Button>
        {
          contract &&
          <Button type="primary" ghost onClick={() => {
            window.open(`${baseURI}Excel/exportContractWord?id=${contract.contractId}&authorization=${token}`);
          }}> 合同导出word</Button>
        }
        <Button
          onClick={() => {
            history.goBack();
          }}>返回</Button>
      </Space>}
    >
      <div id="基本信息">
        <Card {...cardProps} title="基本信息">
          <Descriptions>
            <Descriptions.Item label="订单编码">
              {data.coding}
            </Descriptions.Item>
            <Descriptions.Item label="主题">
              <div style={{paddingRight: 24}}>{data.theme || '--'}</div>
            </Descriptions.Item>
            <Descriptions.Item label="创建人">{data?.user?.name || ''}</Descriptions.Item>
            <Descriptions.Item label="创建时间" span={3}>
              {data.createTime}
            </Descriptions.Item>
            <Descriptions.Item label="附件" span={3}>
              <div style={{width: 500}}>
                <a onClick={() => {
                  uploadRef.current.upload();
                }}>上传</a>
                <div style={{height: 8}} />
                <FileUpload
                  value={data.fileId}
                  ref={uploadRef}
                  privateUpload
                  show
                  removeIcon={false}
                  fileUploadId="orderDetailFileId"
                  onChange={(value) => {
                    addFilesRun({
                      data: {
                        orderId,
                        mediaIds: value.split(',')
                      }
                    });
                  }}
                />
              </div>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      <div id="买方信息">
        <Card {...cardProps} title="买方信息">
          <Descriptions>
            <Descriptions.Item label="公司名称">
              <Button type="link" style={{padding: 0, height: 'fit-content'}} onClick={() => {
                history.push('/BASE_SYSTEM/enterprise');
              }}>{data.acustomer ? data.acustomer.customerName : null}
              </Button>
            </Descriptions.Item>
            <Descriptions.Item label="联系人">{data.acontacts?.contactsName || '--'}</Descriptions.Item>
            <Descriptions.Item label="联系人电话">{data.aphone?.phoneNumber || '--'}</Descriptions.Item>
            <Descriptions.Item label="公司地址">
              {data.aadress ? (data.aadress.detailLocation || data.aadress.location) : '--'}
            </Descriptions.Item>
            <Descriptions.Item label="开户银行">
              {data.abank?.bankName || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="开户行账号">
              {data.partyABankAccount || '--'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      <div id="卖方信息">
        <Card {...cardProps} title="卖方信息">
          <Descriptions>
            <Descriptions.Item label="公司名称">
              <Button type="link" style={{padding: 0, height: 'fit-content'}} onClick={() => {
                history.push(`/purchase/supply/detail/${data.sellerId}`);
              }}>{data.bcustomer ? data.bcustomer.customerName : null}
              </Button>
            </Descriptions.Item>
            <Descriptions.Item label="联系人">{data.bcontacts?.contactsName || '--'}</Descriptions.Item>
            <Descriptions.Item label="联系人电话">{data.bphone?.phoneNumber || '--'}</Descriptions.Item>
            <Descriptions.Item label="公司地址">
              {data.badress ? (data.badress.detailLocation || data.badress.location) : '--'}
            </Descriptions.Item>
            <Descriptions.Item label="开户银行">
              {data.bbank?.bankName || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="开户行账号">
              {data.partyBBankAccount || '--'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      <div id="产品明细">
        <Card
          {...cardProps}
          title="产品明细"
          extra={<Button type="primary" ghost onClick={() => {
            relevanceTasksRef.current.open(true);
          }}>查看入库任务</Button>}
        >
          <div className={styles.process}>
            <div className={styles.label}>入库进度：</div>
            <Progress style={{}} percent={data.inStockRate || 0} />
          </div>

          <OrderDetailTable orderId={data.orderId} />
        </Card>
      </div>

      <div id="财务信息">
        <Card {...cardProps} title="财务信息">
          <Descriptions column={2}>
            <Descriptions.Item label="总金额（采购总价 + 浮动金额）">
              {(data.paymentResult?.floatingAmount || 0) ? <Space>
                <ThousandsSeparator
                  prefix="￥"
                  value={data.paymentResult?.money || 0}
                  shopNumber
                  style={{marginTop: -12}}
                />
                +
                <ThousandsSeparator
                  prefix="￥"
                  value={data.paymentResult?.floatingAmount || 0}
                  shopNumber
                  style={{marginTop: -12}}
                />
                =
                <ThousandsSeparator
                  valueStyle={{color: 'red'}}
                  prefix="￥"
                  value={data.paymentResult?.totalAmount || 0}
                  shopNumber
                  style={{marginTop: -12}}
                />
              </Space> : <ThousandsSeparator
                valueStyle={{color: 'red'}}
                prefix="￥"
                value={data.paymentResult?.totalAmount || 0}
                shopNumber
                style={{marginTop: -12}}
              />}
            </Descriptions.Item>
            <Descriptions.Item label="币种">{data.currency || '--'}</Descriptions.Item>
            <Descriptions.Item label="票据类型">{data.paymentResult?.paperType ? '专票' : '普票'}</Descriptions.Item>
            <Descriptions.Item label="是否含运费">
              {data.paymentResult?.freight ? '是' : '否'}
            </Descriptions.Item>
            <Descriptions.Item label="结算方式" span={2}>
              {data.payMethod || '---'}
            </Descriptions.Item>
            <Descriptions.Item label="付款进度" span={1}>
              <Progress style={{}} percent={data.paymentRate || 0} />
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      <div id="请款记录">
        <Card {...cardProps} title="请款记录">
          <RequestFundsList
            order={data || {}}
            orderId={data.orderId}
            ref={requestFundsListRef}
            complete={() => {
              paymentListRef.current.refresh();
            }}
          />
        </Card>
      </div>

      <div id="付款记录">
        <Card {...cardProps} title="付款记录">
          <PaymentList
            ref={paymentListRef}
            orderId={data.orderId}
          />
        </Card>
      </div>

      <div id="发票信息">
        <Card {...cardProps} title="发票信息">
          <InvoiceList orderId={data.orderId} />
        </Card>
      </div>
    </DetailLayout>

    <Modal
      headTitle="入库任务"
      ref={relevanceTasksRef}
    >
      <RelevanceTasks orderId={orderId} />
    </Modal>
  </div>;
};

export default Detail;
