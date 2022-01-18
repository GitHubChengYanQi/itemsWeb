import React, {useRef} from 'react';
import {Avatar, Button, Card, Descriptions, Empty, Space} from 'antd';
import {EditOutlined, EllipsisOutlined} from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import {useHistory} from 'ice';
import Quote from '@/pages/Purshase/Quote';
import Modal from '@/components/Modal';
import PurchaseQuotationList from '@/pages/Purshase/purchaseQuotation/purchaseQuotationList';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';

const Supply = ({data, skuIds, id, levelId, supplySku}) => {

  const history = useHistory();

  const quoteRef = useRef(null);

  const quotationRef = useRef();

  if (!data && !Array.isArray(data)) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return <>
    <Card bordered={false}>
      {
        data.map((item, index) => {
          return <Card.Grid
            key={index}
            style={{
              padding: '16px 16px 0px 16px',
              width: '18%',
              margin: 8
            }}
          >
            <Card
              key={index}
              bordered={false}
              actions={[
                <Button
                  type="link"
                  onClick={() => {
                    let skus = skuIds;
                    if (supplySku !== 1) {
                      const supplySkus = item.skuResultList && item.skuResultList.map((item, index) => {
                        return item.skuId;
                      });
                      skus = skuIds.filter((item) => {
                        return supplySkus.includes(item);
                      });
                    }

                    quoteRef.current.open({
                      skus,
                      sourceId: id,
                      source: 'inquiryTask',
                      customerId: item.customerId,
                      supplySku,
                      levelId,
                    });
                  }}><EditOutlined key="edit" title="添加报价" /></Button>,
                <Button
                  type="link"
                  onClick={() => {
                    quotationRef.current.open({
                      name: item.customerName,
                      check: true,
                      source: 'inquiryTask',
                      sourceId: id,
                      customerId: item.customerId
                    });
                  }}>查看报价</Button>,
                <Button
                  type="link"
                  onClick={() => {
                    history.push(`/purchase/supply/${item.customerId}`);
                  }}><EllipsisOutlined key="ellipsis" title="详细信息" /></Button>
              ]}
            >
              <Meta
                style={{
                  height: 250,
                  overflowY: 'auto',
                }}
                avatar={<Avatar src={item.avatar}>{!item.avatar && item.customerName.substring(0, 1)}</Avatar>}
                title={item.customerName}
                description={
                  <Descriptions column={1}>
                    <Descriptions.Item label="联系人">1</Descriptions.Item>
                    <Descriptions.Item label="电话">1</Descriptions.Item>
                    <Descriptions.Item label="地址">1</Descriptions.Item>
                    <Descriptions.Item label="物料">
                      <Space direction="vertical">
                        {
                          item.skuResultList && item.skuResultList.map((item, index) => {
                            return <div key={index}><SkuResultSkuJsons skuResult={item} /></div>;
                          })
                        }
                      </Space>
                    </Descriptions.Item>
                  </Descriptions>
                }
              />
            </Card>
          </Card.Grid>;
        })
      }
    </Card>

    <Modal
      width={1600}
      ref={quotationRef}
      component={PurchaseQuotationList}
      onSuccess={() => {
        quotationRef.current.close();
      }} />

    <Modal headTitle="添加报价信息" width={1870} ref={quoteRef} component={Quote} onSuccess={() => {
      quoteRef.current.close();
    }} />
  </>;
};

export default Supply;
