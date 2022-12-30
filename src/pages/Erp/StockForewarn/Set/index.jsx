import React, {useRef, useState} from 'react';
import {Button, Input, message, Space} from 'antd';
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
import Cascader from '@/components/Cascader';
import {BomSelect} from '@/pages/Erp/stock/StockField';

const {FormItem} = Form;

const Set = () => {

  const tableRef = useRef();

  const [state] = store.useModel('dataSource');

  const [data, setData] = useState([]);
  console.log(data);
  const {addLoading, run: add} = useRequest(stockForewarnAdd, {
    response: true,
    manual: true,
    onSuccess: () => {
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
        component={BomSelect} />
    </>;
  };

  return <>
    <div className={styles.breadcrumb}>
      <div className={styles.bread}>
        <Breadcrumb title="预警设置" />
      </div>
      <Space>
        <Button type="primary">保存</Button>
        <Button>返回</Button>
      </Space>
    </div>
    <div className={styles.set}>
      <Table
        noTableColumnSet
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
  </>;
};

export default Set;
