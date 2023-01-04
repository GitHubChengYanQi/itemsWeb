import React, {useRef, useState} from 'react';
import {Button, Input, message, Space} from 'antd';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './index.module.less';
import Table from '@/components/Table';
import store from '@/store';
import {useRequest} from '@/util/Request';
import {stockForewarnAdd, stockForewarnSave} from '@/pages/Erp/StockForewarn/url';
import Form from '@/components/Form';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import {skuList} from '@/pages/Erp/sku/skuUrl';
import Render from '@/components/Render';
import InputNumber from '@/components/InputNumber';
import Cascader from '@/components/Cascader';
import {BomSelect} from '@/pages/Erp/stock/StockField';
import BottomButton from '@/components/BottomButton';

const {FormItem} = Form;

const Set = () => {

  const tableRef = useRef();

  const [state] = store.useModel('dataSource');

  const [data, setData] = useState([]);

  const [bomSku, setBomSku] = useState({});

  const [bomId, setBomId] = useState();

  const [showBatch, setShowBatch] = useState(false);

  const {loading: addLoading, run: add} = useRequest(stockForewarnAdd, {
    response: true,
    manual: true,
    onSuccess: () => {
      setData([]);
      message.success('设置成功!');
      tableRef.current.refresh();
    }
  });

  const {loading: stockForewarnSaveLoading, run: stockForewarnSaveRun} = useRequest(stockForewarnSave, {
    response: true,
    manual: true,
    onSuccess: () => {
      setData([]);
      message.success('设置成功!');
      tableRef.current.refresh();
    }
  });

  const columns = [
    {title: '物料编码', width: 200, dataIndex: 'standard'},
    {
      title: '物料分类', width: 140, dataIndex: 'spuResult', render: (value) => {
        return <Render text={value?.spuClassificationResult?.name} />;
      }
    },
    {
      title: '物料', dataIndex: 'skuResult', render: (value, record) => {
        return SkuResultSkuJsons({skuResult: record});
      }
    },
    {
      title: '库存下限',
      width: 140,
      align: 'center',
      dataIndex: 'stockForewarnResult',
      render: (stockForewarnResult, record) => {
        const sku = data.find(item => item.skuId === record.skuId);
        return <InputNumber
          value={sku ? sku.inventoryFloor : stockForewarnResult?.inventoryFloor}
          width={140}
          placeholder="请输入"
          onChange={(inventoryFloor) => {
            let exit = false;
            const newData = data.map(item => {
              if (item.skuId === record.skuId) {
                exit = true;
                return {
                  ...item,
                  inventoryFloor,
                  inventoryCeiling: item.inventoryCeiling <= inventoryFloor ? null : item.inventoryCeiling
                };
              }
              return item;
            });
            if (!exit) {
              newData.push({
                skuId: record.skuId,
                inventoryFloor,
                inventoryCeiling: stockForewarnResult?.inventoryCeiling
              });
            }
            setData(newData);
          }}
        />;
      }
    },
    {
      title: '库存上限',
      width: 140,
      align: 'center',
      dataIndex: 'stockForewarnResult',
      render: (stockForewarnResult, record) => {
        const sku = data.find(item => item.skuId === record.skuId);
        return <InputNumber
          value={sku ? sku.inventoryCeiling : stockForewarnResult?.inventoryCeiling}
          width={140}
          min={sku?.inventoryFloor ? sku.inventoryFloor + 1 : 0}
          placeholder="请输入"
          onChange={(inventoryCeiling) => {
            let exit = false;
            const newData = data.map(item => {
              if (item.skuId === record.skuId) {
                exit = true;
                return {
                  ...item,
                  inventoryCeiling,
                };
              }
              return item;
            });
            if (!exit) {
              newData.push({
                skuId: record.skuId,
                inventoryCeiling,
                inventoryFloor: stockForewarnResult?.inventoryFloor
              });
            }
            setData(newData);
          }}
        />;
      }
    },
    {
      title: '操作', width: 70, align: 'center', dataIndex: 'action', render: (text, record) => {
        return <Button
          type="link"
          onClick={() => {
            let exit = false;
            const newData = data.map(item => {
              if (item.skuId === record.skuId) {
                exit = true;
                return {
                  ...item,
                  inventoryCeiling: null,
                  inventoryFloor: null,
                };
              }
              return item;
            });
            if (!exit) {
              newData.push({
                skuId: record.skuId,
                inventoryCeiling: null,
                inventoryFloor: null,
              });
            }
            setData(newData);
          }}
        >
          重置
        </Button>;
      }
    },

  ];

  if (showBatch) {
    columns.splice(3, 0, {
      title: '配套数量',
      width: 140,
      dataIndex: 'number'
    });
  }

  const searchForm = () => {
    return <>
      <FormItem name="skuName" label="基础物料" component={Input} placeholder="请输入" />
      <FormItem
        name="spuClass"
        label="物料分类"
        width={200}
        component={Cascader}
        options={state.skuClass}
        placeholder="请选择"
      />
      <FormItem
        label="物料清单"
        name="partsSkuId"
        component={BomSelect}
        onChange={(value, partsId) => {
          setBomId(partsId);
        }}
      />
    </>;
  };

  return <>
    <div className={styles.breadcrumb}>
      <div className={styles.bread}>
        <Breadcrumb title="预警设置" />
      </div>
      <Space>
        <Button>返回</Button>
      </Space>
    </div>
    <div className={styles.set}>
      <Table
        onReset={() => setBomId()}
        contentHeight="calc(100vh - 175px)"
        formSubmit={(values) => {
          setShowBatch(values.partsSkuId);
          return values;
        }}
        format={(data) => {
          return data;
        }}
        noTableColumnSet
        otherActions={showBatch && <>
          <div style={{marginLeft: 24}}>批量设置：</div>
          <InputNumber
            value={bomSku.inventoryFloor}
            width={140}
            placeholder="下限"
            onChange={(inventoryFloor) => {
              setBomSku({...bomSku, inventoryFloor});
            }}
          />
          <InputNumber
            width={140}
            value={bomSku.inventoryCeiling}
            min={bomSku.inventoryFloor + 1}
            placeholder="上限"
            onChange={(inventoryCeiling) => {
              setBomSku({...bomSku, inventoryCeiling});
            }}
          />
          <Button loading={stockForewarnSaveLoading} style={{padding: 0}} type="link" onClick={() => {
            stockForewarnSaveRun({
              data: {
                'bomId': bomId,
                'InventoryFloor': bomSku.inventoryFloor,
                'InventoryCeiling': bomSku.inventoryCeiling
              }
            });
          }}>确定</Button>
        </>}
        loading={addLoading}
        searchForm={searchForm}
        api={skuList}
        ref={tableRef}
        bodyStyle={{padding: 0}}
        cardHeaderStyle={{display: 'none'}}
        searchStyle={{margin: 0, padding: '0 0 16px'}}
        rowKey="skuId"
        columns={columns}
        noRowSelection
      />
    </div>

    <BottomButton textAlign="right">
      <Button disabled={data.length === 0} loading={addLoading} type="primary" onClick={() => {
        add({data: {params: data.map(item => ({...item, formId: item.skuId, type: 'sku'}))}});
      }}>保存</Button>
    </BottomButton>
  </>;
};

export default Set;
