import React, {useRef, useState} from 'react';
import {Button, Input, message} from 'antd';
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
      dataIndex: 'inventoryFloor',
      render: (text, record, index) => {
        const sku = data[index] || {};
        return <InputNumber
          value={sku.inventoryFloor}
          width={140}
          placeholder="请输入"
          onChange={(inventoryFloor) => {
            const newData = data.map((item, key) => {
              if (key === index) {
                return {
                  ...item,
                  inventoryFloor,
                  inventoryCeiling: item.inventoryCeiling <= inventoryFloor ? null : item.inventoryCeiling
                };
              }
              return item;
            });
            setData(newData);
          }}
        />;
      }
    },
    {
      title: '库存上限', width: 140, align: 'center', dataIndex: 'inventoryCeiling', render: (text, record, index) => {
        const sku = data[index] || {};
        return <InputNumber
          width={140}
          value={sku.inventoryCeiling}
          min={sku.inventoryFloor + 1}
          placeholder="请输入"
          onChange={(inventoryCeiling) => {
            const newData = data.map((item, key) => {
              if (key === index) {
                return {...item, inventoryCeiling};
              }
              return item;
            });
            setData(newData);
          }} />;
      }
    },
    {
      title: '操作', width: 70, align: 'center', dataIndex: 'action', render: (text, record, index) => {
        const sku = data[index] || {};
        return <Button
          type="link"
          disabled={record.inventoryFloor === sku.inventoryFloor && record.inventoryCeiling === sku.inventoryCeiling}
          onClick={() => {
            add({
              data: {
                type: 'sku',
                formId: record.skuId,
                inventoryFloor: data[index].inventoryFloor,
                inventoryCeiling: data[index].inventoryCeiling
              }
            });
          }}
        >
          确定
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
      <Breadcrumb title="预警设置" />
    </div>
    <div className={styles.set}>
      <Table
        noTableColumn
        format={(data) => {
          const newData = data.map(item => ({
            ...item,
            inventoryCeiling: item.stockForewarnResult?.inventoryCeiling,
            inventoryFloor: item.stockForewarnResult?.inventoryFloor
          }));
          setData(newData);
          return newData;
        }}
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
