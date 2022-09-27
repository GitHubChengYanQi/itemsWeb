import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  Card,
  Input,
  message,
  Modal as AntModal,
  notification, Select,
  Space,
  Statistic,
  Table as AntTable
} from 'antd';
import {useHistory} from 'ice';
import {createFormActions} from '@formily/antd';
import {addProcurement, purchaseListingReadyBuy, toBuyPlanList} from '@/pages/Purshase/ToBuyPlan/Url';
import Breadcrumb from '@/components/Breadcrumb';
import {useRequest} from '@/util/Request';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import Modal from '@/components/Modal';
import Quote from '@/pages/Purshase/Quote';
import PurchaseQuotationList from '@/pages/Purshase/purchaseQuotation/purchaseQuotationList';
import InquiryTaskEdit from '@/pages/Purshase/inquiryTask/inquiryTaskEdit';
import Table from '@/components/Table';
import Form from '@/components/Form';
import {Type} from '@/pages/Purshase/purchaseAsk/purchaseAskField';
import DatePicker from '@/components/DatePicker';
import PurchaseAskList from '@/pages/Purshase/purchaseAsk/purchaseAskList';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const ToBuyPlanList = (props) => {

  const [skus, setSkus] = useState([]);

  const [showType, setShowType] = useState('sku');

  const [keys, setKeys] = useState([]);

  const [dataSource, setDataSource] = useState([]);

  const addQuoteRef = useRef();

  const tableRef = useRef();

  const history = useHistory();

  const snameSkus = (value) => {
    let array = [];

    const skuBrand = value.map((item) => {
      return {
        skuId: item.skuId,
        brandId: item.brandId,
      };
    });

    const oneSkus = [];
    let sname = [];

    value.map((item) => {
      if (
        skuBrand.filter((value) => {
          return item.skuId === value.skuId && item.brandId === value.brandId;
        }).length === 1
      ) {
        oneSkus.push(item);
      } else {
        let snameSku = null;
        const sku = [];
        sname.map((value) => {
          if (value.skuId === item.skuId && value.brandId === item.brandId) {
            snameSku = value;
          } else {
            sku.push(value);
          }
          return null;
        });
        if (snameSku) {
          sname = [...sku, {...snameSku, applyNumber: (snameSku.applyNumber || 0) + (item.applyNumber || 0)}];
        } else {
          sname.push(item);
        }
      }
      return array = [...oneSkus, ...sname];
    });
    return array;
  };

  const selectedSanme = () => {
    const array = skus.filter((item) => {
      return keys.includes(item.purchaseListingId);
    });
    return snameSkus(array.map((item) => {
      return {
        skuId: item.skuId,
        brandId: item.brandId,
        preordeNumber: item.applyNumber,
        unitId: item.skuResult && item.skuResult.spuResult && item.skuResult.spuResult.unitId,
        defaultBrandResult: item.brandResult && item.brandResult.brandName
      };
    }));
  };

  const [visible, setVisible] = useState();

  const quoteRef = useRef();

  const inquiryRef = useRef();

  const quotationRef = useRef();

  const [createPlanData, setCreatePlanData] = useState({});

  const {loading: addPlanLoading, run: addPlan} = useRequest(
    addProcurement,
    {
      manual: true,
      onSuccess: () => {
        setVisible(false);
        tableRef.current.refresh();
        notification.success({
          message: '创建采购计划成功！',
        });
      }
    });


  const getMainKey = (key) => {
    return key.replace('mainKey:', '').split(',');
  };

  // 操作key
  const selectKeys = (key, checked) => {
    let array = [];

    if (checked) {
      array.push(key);
    } else {
      array = keys.filter((value) => {
        return value !== key;
      });
    }

    if (key.indexOf('mainKey') !== -1) {
      getMainKey(key).map((items) => {
        if (checked)
          return array.push(items);
        else
          return array = array.filter((value) => {
            return value !== items;
          });
      });
    } else {
      const mainKeys = dataSource.filter((value) => {
        return getMainKey(value.purchaseListingId).filter((item) => {
          return item === key;
        }).length > 0;
      });

      if (mainKeys && mainKeys.length > 0) {
        if (checked) {
          const allKeys = getMainKey(mainKeys[0].purchaseListingId).filter((value) => {
            if (value === key) {
              return true;
            } else {
              return keys.filter((items) => {
                return items === value;
              }).length > 0;
            }
          });
          if (allKeys.length === getMainKey(mainKeys[0].purchaseListingId).length) {
            array.push(mainKeys[0].purchaseListingId);
          }
        } else {
          array = array.filter((items) => {
            return items !== mainKeys[0].purchaseListingId;
          });
        }
      }
    }
    if (checked) {
      setKeys(keys.concat(array));
    } else {
      setKeys(array);
    }
  };

  const showCard = () => {
    return <Card style={{margin: 16, marginTop: 0}}>
      <Space size="large">
        <Statistic title="勾选预购金额" value={0} suffix="元" precision={2} />
        <Statistic title="筛选金额合计" value={0} suffix="元" precision={2} />
        <Statistic title="预购金额合计" value={0} suffix="元" precision={2} />
      </Space>
    </Card>;
  };

  const actions = () => {
    return <Space>
      <Button
        type="default"
        onClick={() => {
          history.push(`/purchase/toBuyPlan/createOrder?module=PO&skus=${JSON.stringify(selectedSanme())}`);
        }}>批量采购</Button>
      {props.ggg && <>
        <Button
          disabled={keys.length === 0}
          type="default"
          onClick={() => {
            setVisible(true);
          }}>批量指派</Button>
        <Button
          disabled={keys.length === 0}
          type="default"
          onClick={() => {
            setVisible(true);
          }}>创建采购计划</Button>
        <Button
          type="default"
          disabled={keys.length === 0}
          onClick={() => {
            const array = skus.filter((item) => {
              return keys.includes(item.purchaseListingId);
            });
            inquiryRef.current.open(snameSkus(array));
          }}>指派询价任务</Button>
        <Button
          type="default"
          onClick={() => {
            let array = [];
            if (keys.length > 0) {
              array = skus.filter((item) => {
                return keys.includes(item.purchaseListingId);
              });
            } else {
              array = skus;
            }
            const skuArray = snameSkus(array);

            quoteRef.current.open(
              {
                skus: skuArray.map((item) => {
                  return {
                    skuId: item.skuId,
                    skuResult: item.skuResult,
                    number: item.applyNumber,
                    brandId: item.brandId,
                    brandResult: item.brandResult,
                  };
                }),
                sourceId: 0,
                source: 'toBuyPlan'
              });
          }}>添加报价</Button>
      </>}
      <div style={{marginLeft: 8}}>
        查看维度:
      </div>
      <Select
        value={showType}
        onChange={setShowType}
        style={{width: 150}}
        options={[{label: '合并物料维度', value: 'sku'}, {label: '采购申请维度', value: 'ask'}]} />
    </Space>;
  };

  const searchForm = () => {
    return (
      <>
        <FormItem label="采购申请类型" name="type" component={Type} />
        <FormItem label="交货日期" name="date" component={DatePicker} />
        <FormItem label="采购申请编号" name="coding" component={Input} />
      </>
    );
  };


  return <div>
    {
      showType !== 'sku'
        ?
        <>
          <PurchaseAskList
            title={<Breadcrumb />}
            actions={actions()}
            tableKey="toByPlan"
            showCard={showCard()}
            searchForm={searchForm}
            status={1}
          />
        </>
        :
        <>
          <Table
            api={purchaseListingReadyBuy}
            format={(value) => {
              if (Array.isArray(value)) {
                const allSku = [];
                value.map((item) => {
                  return item.children.map((value) => {
                    return allSku.push(value);
                  });
                });

                setSkus(allSku);

                const data = [];
                value.map((items) => {
                  if (items.applyNumber > 0 && items.skuResult) {
                    data.push({
                      ...items,
                      purchaseListingId: `mainKey:${items.children && items.children.map((items) => {
                        return items.purchaseListingId;
                      }).toString()}`,
                    });
                  }
                  return null;
                });
                setDataSource(data);
                return data;
              }
              return [];
            }}
            ref={tableRef}
            title={<Breadcrumb />}
            formActions={formActionsPublic}
            actions={actions()}
            tableKey="toByPlan"
            showCard={showCard()}
            noSort
            searchForm={searchForm}
            rowSelection={{
              selectedRowKeys: keys,
              onSelectAll: (selected, selectedRows) => {
                if (selected) {
                  setKeys(selectedRows.map((items) => {
                    return items && items.purchaseListingId;
                  }));
                } else {
                  setKeys([]);
                }
              },
              onSelect: (record, selected) => {
                selectKeys(record.purchaseListingId, selected);
              }
            }}
            rowKey="purchaseListingId"
          >
            <Column key={1} title="物料" fixed="left" dataIndex="skuResult" render={(value) => {
              return value && <SkuResultSkuJsons skuResult={value} />;
            }} />
            <Column key={2} title="品牌 / 厂家" dataIndex="brandResult" render={(value) => {
              return value ? value.brandName : '无指定品牌';
            }} />
            <Column key={3} title="预购数量" width={100} dataIndex="applyNumber" />
            <Column key={4} title="单位" width={100} dataIndex="skuResult" render={(value) => {
              return value && value.spuResult && value.spuResult.unitResult && value.spuResult.unitResult.unitName;
            }} />
            <Column key={5} title="期望交货时间" width={150} dataIndex="deliveryDate" render={(value, record) => {
              return <Space>
                {value && value.split(' ')[0]}
                {record && record.deliveryTime}
              </Space>;
            }} />
            <Column key={6} title="历史交期" width={150} dataIndex="lishi" />
            <Column key={7} title="交期预计" width={150} dataIndex="lishi" />
            <Column key={8} title="历史单价" width={150} dataIndex="money" render={(value, record) => {
              return <Space>
                {value}
                <Button type="link" style={{padding: 0}} onClick={() => {
                  quotationRef.current.open({
                    skuId: record.skuId,
                    check: true,
                    name: <SkuResultSkuJsons skuResult={record.skuResult} />
                  });
                }}>
                  详情
                </Button>
              </Space>;
            }} />
            <Column key={9} title="预购总价" width={150} dataIndex="money" />
            <Column key={10} title="询价状态" width={150} dataIndex="money" />
            <Column key={11} title="申请人" width={150} dataIndex="user" render={(value) => {
              return <>{value && value.name}</>;
            }} />
            <Column key={12} title="申请类型" width={150} dataIndex="user" render={(value) => {
              return <>{value && value.name}</>;
            }} />
            <Column key={13} title="申请时间" width={150} dataIndex="createTime" />
            <Column key={14} title="操作" fixed="right" align="center" render={(value, record) => {
              const childrenKeys = [];
              if (record.children) {
                record.children.map((item) => {
                  return childrenKeys.push(item.purchaseListingId);
                });
              }
              return <>
                <Button type="link" onClick={() => {
                  history.push(`/purchase/toBuyPlan/createOrder?module=PO&skus=${JSON.stringify([record.purchaseListingId,...childrenKeys])}`);
                }}>采购</Button>
                <Button type="link">指派</Button>
                <Button type="link">详情</Button>
              </>;
            }} />
          </Table>

          <AntModal
            open={visible}
            title="创建采购计划"
            onCancel={() => {
              setVisible(false);
            }}
            confirmLoading={addPlanLoading}
            onOk={async () => {
              if (createPlanData.procurementPlanName) {
                const addKeys = keys.filter((items) => {
                  return items.indexOf('mainKey:') === -1;
                });
                await addPlan({
                  data: {
                    ...createPlanData,
                    listingIds: addKeys
                  }
                });
              } else {
                message.warn('请输入采购计划名称！');
              }
            }}>
            <Space direction="vertical" style={{width: '100%'}}>
              <Input placeholder="采购计划名称" onChange={(value) => {
                setCreatePlanData({...createPlanData, procurementPlanName: value.target.value});
              }} />
              <Input.TextArea placeholder="输入采购计划备注..." onChange={(value) => {
                setCreatePlanData({...createPlanData, remark: value.target.value});
              }} />
            </Space>
          </AntModal>

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
              quoteRef.current.close();
            }} />

          <Modal
            headTitle="指派询价任务"
            width={1200}
            ref={inquiryRef}
            component={InquiryTaskEdit}
            onSuccess={() => {
              notification.success({
                message: '创建询价任务成功！',
              });
              inquiryRef.current.close();
            }} />

          <Modal
            width={1600}
            ref={quotationRef}
            component={PurchaseQuotationList}
            onSuccess={() => {
              quotationRef.current.close();
            }} />
        </>
    }
  </div>;
};

export default ToBuyPlanList;
