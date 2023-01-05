import React, {useRef, useState} from 'react';
import {Button, Cascader, Input, message, Space} from 'antd';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './index.module.less';
import Table from '@/components/Table';
import store from '@/store';
import {useRequest} from '@/util/Request';
import {stockForewarnAdd} from '@/pages/Erp/StockForewarn/url';
import Form from '@/components/Form';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import {skuList} from '@/pages/Erp/sku/skuUrl';
import Render from '@/components/Render';
import InputNumber from '@/components/InputNumber';
import {BomSelect} from '@/pages/Erp/stock/StockField';
import {isArray} from '@/util/Tools';
import BottomButton from '@/components/BottomButton';

const {FormItem} = Form;

const {SHOW_CHILD} = Cascader;

const Set = () => {

  const tableRef = useRef();

  const [state] = store.useModel('dataSource');

  const [data, setData] = useState([]);

  const [bomSku, setBomSku] = useState({});

  const [bomId, setBomId] = useState();

  const {loading: addLoading, run: add} = useRequest(stockForewarnAdd, {
    response: true,
    manual: true,
    onSuccess: () => {
      // setData([]);
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
          defaultValue={stockForewarnResult?.inventoryFloor}
          value={sku?.inventoryFloor}
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
          defaultValue={stockForewarnResult?.inventoryCeiling}
          value={sku?.inventoryCeiling}
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

  if (bomId) {
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
        showCheckedStrategy={SHOW_CHILD}
        name="spuClassIds"
        label="物料分类"
        width={200}
        multiple
        style={{width: '200px'}}
        maxTagCount="responsive"
        component={Cascader}
        options={state.skuClass}
        placeholder="请选择"
      />
      <FormItem
        label="物料清单"
        name="partsSkuId"
        component={BomSelect}
      />
    </>;
  };

  return <>
    <div className={styles.breadcrumb}>
      <div className={styles.bread}>
        <Breadcrumb title="预警设置" />
      </div>
      <Space>
        <Button onClick={() => {
          window.history.back(-1);
        }}>返回</Button>
      </Space>
    </div>
    <div className={styles.set}>
      <Table
        formSubmit={(values) => {
          setBomId(values.partsSkuId);
          return {
            ...values,
            spuClassIds: isArray(values.spuClassIds).map(item => {
              return item[item.length - 1];
            })
          };
        }}
        noTableColumnSet
        otherActions={bomId && <>
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
          <Button style={{padding: 0}} type="link" onClick={() => {
            console.log({bomSku, bomId});
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
