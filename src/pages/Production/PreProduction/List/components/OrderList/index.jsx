import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Checkbox, List, Space} from 'antd';
import ProSkeleton from '@ant-design/pro-skeleton';
import {pendingProductionByOrder} from '@/pages/Production/Url';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import {useRequest} from '@/util/Request';
import Label from '@/components/Label';
import Drawer from '@/components/Drawer';
import Detail from '@/pages/ReSearch/Detail';
import Note from '@/components/Note';

const OrderList = ({checkedSkus, setCheckedSkus, refresh}) => {

  const [orderKeys, setOrderKeys] = useState([]);

  const [skuId, setSkuId] = useState();

  const showShip = useRef();

  useEffect(() => {
    if (skuId) {
      showShip.current.open(false);
    }
  }, [skuId]);

  const {loading, data, refresh: orderResh} = useRequest(pendingProductionByOrder);

  useEffect(() => {
    if (refresh) {
      setOrderKeys([]);
      orderResh();
    }
  }, [refresh]);

  if (loading) {
    return <ProSkeleton type="descriptions" />;
  }

  const onChecked = (checked, rowItem, orderItem) => {
    if (checked) {
      const orderDetails = checkedSkus.filter((item) => {
        return item.orderId === rowItem.orderId;
      });
      const details = orderItem.detailResults && orderItem.detailResults.filter(item => item.skuResult && item.skuResult.processResult);
      if (orderDetails.length + 1 === details.length) {
        setOrderKeys([...orderKeys, rowItem.orderId]);
      }
      setCheckedSkus([...checkedSkus, rowItem]);
    } else {
      const array = checkedSkus.filter((item) => {
        return item.detailId !== rowItem.detailId;
      });
      setCheckedSkus(array);
      const orders = orderKeys.filter((item) => {
        return item !== rowItem.orderId;
      });
      setOrderKeys(orders);
    }
  };

  return <>
    <div style={{maxWidth: 1200, margin: 'auto'}}>
      <List
        bordered={false}
        dataSource={data}
        renderItem={(orderItem) => (
          <div style={{margin: '16px 0'}}>
            <Card
              type="inner"
              title={<Space size={24}>

                <Checkbox
                  disabled={
                    orderItem.detailResults
                    &&
                    (orderItem.detailResults.filter(item => !(item.skuResult && item.skuResult.processResult)).length === orderItem.detailResults.length)
                  }
                  checked={orderKeys.includes(orderItem.orderId)}
                  onChange={(value) => {
                    if (value.target.checked) {
                      setOrderKeys([...orderKeys, orderItem.orderId]);
                      const details = orderItem.detailResults && orderItem.detailResults.filter(item => item.skuResult && item.skuResult.processResult);
                      setCheckedSkus([...checkedSkus, ...details]);
                    } else {
                      const array = orderKeys.filter((item) => {
                        return item !== orderItem.orderId;
                      });
                      setOrderKeys(array);
                      const skus = checkedSkus.filter((item) => {
                        return array.includes(item.orderId);
                      });
                      setCheckedSkus(skus);
                    }
                  }}>
                  <Space size={24} style={{paddingLeft: 16}}>
                    <div><Label>订单号：</Label>{orderItem.coding}</div>
                    <div><Label>客户：</Label>{orderItem && orderItem.acustomer && orderItem.acustomer.customerName}</div>
                  </Space>
                </Checkbox>
              </Space>}
              bodyStyle={{padding: 0}}
              extra={<Space size={24}>
                <div>
                  <Label>创建时间：</Label>{orderItem.createTime}
                </div>
                <div>
                  <Label>交货时间：</Label>{orderItem.deliveryDate}
                </div>
              </Space>}
            >
              <List
                bordered={false}
                dataSource={orderItem.detailResults}
                renderItem={(rowItem) => {
                  const skuResult = rowItem.skuResult || {};
                  return <div style={{padding: 24, borderBottom: 'solid #eee 1px'}}>
                    <Space size={24}>
                      <Checkbox
                        disabled={!skuResult.processResult}
                        checked={checkedSkus.map(item => item.detailId).includes(rowItem.detailId)}
                        onChange={(value) => {
                          onChecked(value.target.checked, rowItem, orderItem);
                        }} />
                      <Space direction="vertical" style={{cursor: 'pointer'}} onClick={() => {
                        if (skuResult.processResult) {
                          onChecked(!checkedSkus.map(item => item.detailId).includes(rowItem.detailId), rowItem, orderItem);
                        }
                      }}>
                        <div>
                          <Label>物料编码：</Label>{skuResult && skuResult.standard}
                          {!skuResult.processResult && <Button
                            type="link"
                            onClick={() => {
                              setSkuId(rowItem.skuId);
                            }}
                            danger>请先创建工艺路线</Button>}
                        </div>
                        <Button type="link" style={{padding: 0}}>
                          <SkuResultSkuJsons skuResult={skuResult} />
                        </Button>
                      </Space>
                      <div>
                        × {rowItem.purchaseNumber}
                      </div>
                    </Space>
                    <div style={{float: 'right', lineHeight: '62px', maxWidth: '40%'}}>
                      <Note><SkuResultSkuJsons describe skuResult={skuResult} /></Note>
                    </div>
                  </div>;
                }} />
            </Card>
          </div>
        )}
      />
    </div>


    <Drawer
      bodyStyle={{padding: 0}}
      push={false}
      headTitle="添加工艺路线"
      height="100%"
      placement="top"
      addChildren
      skuId={skuId}
      component={Detail}
      ref={showShip}
      onSuccess={() => {
        setSkuId(null);
        showShip.current.close();
        orderResh();
      }}
      onBack={() => {
        setSkuId(null);
        showShip.current.close();
      }}
    />
  </>;
};

export default OrderList;
