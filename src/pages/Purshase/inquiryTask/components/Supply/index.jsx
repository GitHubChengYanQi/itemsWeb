import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Button, Card, Descriptions, Dropdown, Empty, Menu, Space} from 'antd';
import {EditOutlined, EllipsisOutlined, PlusOutlined} from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import {useHistory} from 'ice';
import ProSkeleton from '@ant-design/pro-skeleton';
import Quote from '@/pages/Purshase/Quote';
import Modal from '@/components/Modal';
import PurchaseQuotationList from '@/pages/Purshase/purchaseQuotation/purchaseQuotationList';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import {useRequest} from '@/util/Request';
import {purchaseConfigList} from '@/pages/BaseSystem/dictType/components/purchaseConfig/purchaseConfigUrl';

const Supply = ({
  skus, id, level, supplySku, source, onChange = () => {
  }
}) => {

  const [config, setConfig] = useState({
    isSupplySku: supplySku ? '是' : '否',
    level
  });

  const {loading, data, run} = useRequest(
    {
      url: '/supply/getSupplyBySku',
      method: 'POST',
    }, {
      manual: true,
    }
  );

  const {loading: configLoading, run: configRun} = useRequest(
    purchaseConfigList,
    {
      manual: true,
      onSuccess: (res) => {

        const supplys = res.filter((value) => {
          return value.type === 'supply';
        });

        const levels = res.filter((value) => {
          return value.type === 'level';
        });

        const isSupplySku = supplys && supplys.length > 0 && supplys[0].value;
        const configLevel = levels && levels.length > 0 && JSON.parse(levels[0].value);

        run({
          data: {
            skuIds: skus.map((item) => {
              return item.skuId;
            }),
            levelId: configLevel.value,
          }
        });

        setConfig({
          isSupplySku,
          level: configLevel,
        });

      }
    }
  );

  useEffect(() => {
    if (!level) {
      configRun();
    } else {
      run({
        data: {
          skuIds: skus.map((item) => {
            return item.skuId;
          }),
          levelId: level.value,
        }
      });
    }

  }, []);

  const history = useHistory();

  const quoteRef = useRef(null);

  const addQuoteRef = useRef(null);

  const quotationRef = useRef();

  if (!data && !Array.isArray(data)) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  if (loading || configLoading) {
    return <ProSkeleton type="descriptions" />;
  }

  return <>
    <Card bordered={false}>
      {
        data.map((item, index) => {
          return <Card.Grid
            key={index}
            style={{
              padding: '16px 16px 0px 16px',
              width: '15%',
              margin: 8
            }}
          >
            <Card
              style={{
                height: 350,
              }}
              key={index}
              bordered={false}
              actions={[
                <Button
                  type="link"
                  onClick={() => {
                    let skuResult = skus;
                    if (config.isSupplySku === '是') {
                      const supplySkus = item.skuResultList && item.skuResultList.map((item) => {
                        return item.skuId;
                      });
                      skuResult = skus.filter((item) => {
                        return supplySkus.includes(item.skuId);
                      });
                    }
                    quoteRef.current.open({
                      skus: skuResult.map((item) => {
                        return {
                          skuId: item.skuId,
                          brandId: item.brandId,
                          brandResult: item.brandResult,
                          skuResult: item.skuResult,
                          number: item.total,
                        };
                      }),
                      sourceId: id,
                      source,
                      customer: {
                        ...item,
                        crmCustomerLevelResult: {
                          level: item.level.level
                        }
                      },
                      supplySku: config.isSupplySku === '是',
                      level: config.level,
                    });
                  }}><EditOutlined key="edit" title="添加报价" /></Button>,
                <Button
                  type="link"
                  onClick={() => {
                    quotationRef.current.open({
                      name: item.customerName,
                      check: true,
                      source,
                      sourceId: id,
                      customerId: item.customerId
                    });
                  }}>查看报价</Button>,

                <Dropdown placement="bottom" overlay={
                  <Menu items={[{
                    key: '1',
                    label: '详细信息',
                    onClick: () => history.push(`/purchase/supply/${item.customerId}`)
                  }]} />
                }>
                  <EllipsisOutlined key="ellipsis" title="详细信息" />
                </Dropdown>,
              ]}
            >
              <Meta
                style={{
                  height: 300,
                }}
                avatar={<Avatar src={item.avatar}>{!item.avatar && item.customerName.substring(0, 1)}</Avatar>}
                title={item.customerName}
                description={
                  <Descriptions column={1}>
                    <Descriptions.Item
                      label="级别">
                      {item.level ? item.level.level : '无'}
                    </Descriptions.Item>
                    <Descriptions.Item label="联系人">{item.contact ? item.contact.contactsName : '无'}</Descriptions.Item>
                    <Descriptions.Item label="电话">{item.phone ? item.phone.phoneNumber : '无'}</Descriptions.Item>
                    <Descriptions.Item label="地址">{item.address ? item.address.location : '无'}</Descriptions.Item>
                    <Descriptions.Item label="物料">
                      <div style={{height: 70, overflow: 'hidden',}}>
                        <Space direction="vertical">
                          {
                            item.skuResultList && item.skuResultList.map((item, index) => {
                              return <div key={index}><SkuResultSkuJsons skuResult={item} /></div>;
                            })
                          }
                        </Space>
                      </div>
                    </Descriptions.Item>
                  </Descriptions>
                }
              />
            </Card>
          </Card.Grid>;
        })
      }
      {config.isSupplySku === '否' && <Card.Grid
        style={{
          padding: 0,
          width: 'auto',
          border: 'none',
          margin: '100px 8px',
          cursor: 'pointer'
        }}
        onClick={() => {
          quoteRef.current.open({
            skus: skus.map((item) => {
              return {
                skuId: item.skuId,
                brandId: item.brandId,
                brandResult: item.brandResult,
                skuResult: item.skuResult,
                number: item.total,
              };
            }),
            sourceId: id,
            source,
            supplySku: config.isSupplySku === '是',
            level: config.level,
          });
        }}
      >
        <PlusOutlined style={{fontSize: 100, color: '#c2c1c1'}} />
      </Card.Grid>}
    </Card>

    <Modal
      width={1600}
      ref={quotationRef}
      component={PurchaseQuotationList}
      onSuccess={() => {
        quotationRef.current.close();
      }} />

    <Modal
      headTitle="添加报价信息"
      width={2100}
      compoentRef={addQuoteRef}
      footer={<Button
        type="primary"
        style={{marginTop: 8}}
        onClick={() => {
          addQuoteRef.current.submit();
        }}>添加报价</Button>}
      ref={quoteRef}
      component={Quote}
      onSuccess={() => {
        onChange();
        quoteRef.current.close();
      }} />
  </>;
};

export default Supply;
