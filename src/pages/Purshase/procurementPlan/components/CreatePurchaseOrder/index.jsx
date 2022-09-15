import React, {useEffect, useRef, useState} from 'react';
import {
  Badge,
  Button,
  Card,
  Empty, Input,
  message,
  Modal,
  notification,
  Table
} from 'antd';
import {useBoolean, useSetState} from 'ahooks';
import ProSkeleton from '@ant-design/pro-skeleton';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import {useRequest} from '@/util/Request';
import {purchaseQuotationAllList} from '@/pages/Purshase/purchaseQuotation/purchaseQuotationUrl';
import CreateContracts from '@/pages/Purshase/procurementPlan/components/CreateContracts';
import {procurementOrderAdd} from '@/pages/Purshase/procurementOrder/procurementOrderUrl';

const CreatePurchaseOrder = ({data, palnId, onChange}) => {

  const [quotations, setQuotations] = useSetState({data: []});

  const [createContracts, setCreateContracts] = useState([]);

  const [closable,{setTrue,setFalse}] = useBoolean();

  const contractRef = useRef();

  const {loading: createLoading, run: createOrder} = useRequest(
    procurementOrderAdd
    , {
      manual: true,
      onSuccess: (res) => {
        const array = [];
        skus.data.map((item) => {
          if (array.length === 0) {
            return array.push({
              customerId: item.customerId,
              money: item.money,
              skus: [item]
            });
          }
          return array.map((value, index) => {
            if (value.customerId === item.customerId) {
              array[index] = {
                customerId: item.customerId,
                money: value.money + item.money,
                skus: [
                  ...value.skus,
                  {
                    ...item
                  }
                ]
              };
            } else {
              array.push({
                customerId: item.customerId,
                skus: [item],
                money: item.money,
              });
            }
            return null;
          });
        });
        setFalse();
        setCreateContracts(array.map((item) => {
          return {...item, orderId: res};
        }));
        notification.success({
          message: '创建采购单成功！',
        });
      }
    });

  const {loading: quotationsLoading, run: quotationsRun} = useRequest(
    purchaseQuotationAllList,
    {
      manual: true,
      onSuccess: (res) => {
        setQuotations({data: res});
      }
    });

  useEffect(() => {
    quotationsRun();
  }, []);

  const [skus, setSkus] = useSetState({data: []});

  let allMoney = 0;
  skus.data.map((item) => {
    if (item.money) {
      allMoney += item.money;
    }
    return null;
  });

  const [visible, setVisible] = useState();

  if (quotationsLoading) {
    return <ProSkeleton type="descriptions" />;
  }

  if (!data && !quotations) {
    return <Empty />;
  }

  return <div style={{padding: 16}}>
    <Table
      footer={() => <Button disabled={skus.data.length === 0} onClick={() => {
        setTrue();
        setVisible(true);
      }}>创建采购单</Button>}
      pagination={false}
      rowKey="detailId"
      dataSource={data}
      rowSelection={{
        type: 'checkbox',
        onChange: (selectedRowKeys, selectedRows) => {
          setSkus({data: selectedRows});
        },
        getCheckboxProps: (record) => ({
          disabled: record.status === 97 || record.status === 99,
        })
      }}
    >
      <Table.Column title="物料" dataIndex="skuResult" render={(value) => {
        return <SkuResultSkuJsons skuResult={value} />;
      }} />
      <Table.Column title="品牌" dataIndex="brandResult" render={(value) => {
        return <>{value ? value.brandName : '无指定品牌'}</>;
      }} />
      <Table.Column title="数量" dataIndex="total" />
      <Table.Column title="状态" dataIndex="status" width={100} align="center" render={(value) => {
        return value !== 0 ? <Badge text="已完成" color="green" /> : <Badge text="未完成" color="red" />;
      }} />
      <Table.Column />
    </Table>

    <Modal
      width={1100}
      open={visible}
      destroyOnClose
      keyboard={false}
      onCancel={() => {
        setCreateContracts([]);
        setVisible(false);
        onChange();
      }}
      footer={[<Button loading={createLoading} key="create" type="primary" onClick={() => {
        if (createContracts.length > 0) {
          contractRef.current.next();
          return;
        }
        if (skus.data.filter((item) => {
          return !item.money;
        }).length > 0) {
          return message.warn('请选择物料的供应商和报价信息！');
        }
        createOrder(
          {
            data: {
              detailParams: skus.data.map((item) => {
                return {
                  ...item,
                  number: item.total,
                  status: 99,
                };
              }),
              procurementPlanId: palnId,
            }
          }
        );
      }}>
        创建
      </Button>]}
      maskClosable={false}
    >
      {
        createContracts.length > 0
          ?
          <CreateContracts ref={contractRef} data={createContracts} onSuccess={() => {
            onChange();
            setCreateContracts([]);
            setVisible(false);
          }} />
          :
          <Card title="创建采购单" bordered={false} extra={<>采购总金额：{allMoney}</>}>
            {skus.data.map((item, index) => {
              const skuQuotation = quotations.data.filter((value) => {
                return value.skuId === item.skuId && (item.brandResult ? value.brandId === item.brandId : true);
              });
              return <Card
                key={index}
                title={
                  <>
                    <SkuResultSkuJsons skuResult={item.skuResult} />
                    <div style={{float: 'right'}}>采购数量:{item.total} 总金额:{item.money || 0}</div>
                  </>
                }
              >
                <Table
                  rowSelection={{
                    type: 'radio',
                    onChange: (value, record) => {
                      const skuDetail = record[0];
                      const array = skus.data;
                      const money = (skuDetail.afterTax || skuDetail.price) * item.total;
                      array[index] = {
                        ...array[index],
                        customerId: skuDetail.customerId,
                        brandId: skuDetail.brandId,
                        money,
                        quotations: skuDetail
                      };
                      setSkus({data: array});
                    }
                  }}
                  key={index}
                  scroll={{y: 300}}
                  pagination={false}
                  dataSource={skuQuotation || []}
                  rowKey="purchaseQuotationId"
                >
                  <Table.Column title="供应商" dataIndex="customerResult" render={(value) => {
                    return <>{value && value.customerName}</>;
                  }} />
                  <Table.Column title="品牌" dataIndex="brandResult" render={(value) => {
                    return <>{value && value.brandName}</>;
                  }} />
                  <Table.Column title="票据类型" dataIndex="InvoiceType" />
                  <Table.Column title="税率" dataIndex="afterTax" render={(value) => {
                    return <>{value}</>;
                  }} />
                  <Table.Column title="税后单价" dataIndex="customerResult" render={(value, record) => {
                    return <Input value={record.afterTax || record.price} onChange={(value) => {
                      const array = quotations.data.map((item) => {
                        if (item.purchaseQuotationId === record.purchaseQuotationId) {
                          return {
                            ...record,
                            afterTax: value.target.value,
                            price: value.target.value,
                          };
                        } else {
                          return item;
                        }
                      });
                      setQuotations({data: array});
                    }} />;
                  }} />
                  <Table.Column title="税后总价" dataIndex="customerResult" render={(value, record) => {
                    return <>{item.total * (record.afterTax || record.price)}</>;
                  }} />
                </Table>
              </Card>;
            })}
          </Card>}
    </Modal>
  </div>;
};

export default CreatePurchaseOrder;
