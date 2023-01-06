import React from 'react';
import {Button, Input, Select} from 'antd';
import {useHistory} from 'ice';
import Table from '@/components/Table';
import Breadcrumb from '@/components/Breadcrumb';
import Form from '@/components/Form';
import {warningSku} from '@/pages/Erp/StockForewarn/url';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import store from '@/store';
import Cascader from '@/components/Cascader';

const {FormItem} = Form;
const searchForm = () => {

  const history = useHistory();

  const [state] = store.useModel('dataSource');

  const types = [
    {value: 'all', label: '全部'},
    {value: 'min', label: '下限预警'},
    {value: 'max', label: '上限预警'},
  ];
  return (
    <>
      <FormItem
        label="物料"
        placeholder="请输入"
        style={{width: '200px'}}
        name="keyWords"
        component={Input} />
      <FormItem
        label="物料分类："
        name="classId"
        width={200}
        placeholder="请选择"
        options={state.skuClass}
        component={Cascader} />
      <FormItem
        label="预警状态"
        name="forewarnStatus"
        style={{width: '200px'}}
        options={types}
        placeholder="请选择"
        component={Select} />
    </>
  );
};


const List = () => {

  const history = useHistory(null);

  const columns = [
    {
      title: '物料编码', width: 200, sorter: true, dataIndex: 'number', render: (value, record) => {
        return (<>{record.skuResult.standard}</>);
      }
    },
    {
      title: '物料分类', width: 140, sorter: true, dataIndex: 'name', render: (value, record) => {
        try {
          return (record.skuResult.spuResult.spuClassificationResult.name);
        } catch (e) {
          return null;
        }
      }
    },
    {
      title: '物料', dataIndex: 'skuResult', sorter: true, render: (value) => {
        return SkuResultSkuJsons({skuResult: value});

      }
    },
    {
      title: '库存数量', width: 100, sorter: true, dataIndex: 'number', render(value, record) {
        return record.number;
      }
    },
    {
      title: '未到货数量', width: 120, sorter: true, dataIndex: 'floatingCargoNumber', render(value) {
        return <Button type="link" onClick={() => {
          history.push('/purchase/order');
        }}>{value}</Button>;
      }
    },
    {
      title: '库存下限', width: '140', sorter: true, dataIndex: 'inventoryFloor', render: (text, record) => {
        return (
          <div style={{color: record.number <= record.inventoryFloor ? 'red' : ''}}>{text}</div>);
      }
    },
    {
      title: '库存上限', width: '140', sorter: true, dataIndex: 'inventoryCeiling', render: (text, record) => {
        return (
          <div style={{color: record.number >= record.inventoryCeiling ? 'red' : ''}}>{text}</div>);
      }
    },

  ];

  const actions = () => {
    return <>
      <Button type="primary" onClick={() => {
        history.push('/ERP/stockForewarn/Set');
      }}>预警设置</Button>
    </>;
  };

  return <>
    <Table
      api={warningSku}
      title={<Breadcrumb />}
      columns={columns}
      rowKey="skuId"
      searchForm={searchForm}
      actions={actions()}
      // footer={footer}
      actionButton={<>
        <Button type="link" onClick={() => {
        }}>导出全部</Button>
        <Button type="link" onClick={() => {
        }}>导出选中</Button>
      </>}
    />

  </>;
};

export default List;
