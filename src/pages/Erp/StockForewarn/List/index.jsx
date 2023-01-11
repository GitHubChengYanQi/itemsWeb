import React, {useRef} from 'react';
import {Button, Input, Select} from 'antd';
import {useHistory} from 'ice';
import Table from '@/components/Table';
import Breadcrumb from '@/components/Breadcrumb';
import Form from '@/components/Form';
import {warningSku} from '@/pages/Erp/StockForewarn/url';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import GroupSku from '@/pages/Erp/sku/components/GroupSku';
import Render from '@/components/Render';

const {FormItem} = Form;


const List = () => {

  const tableRef = useRef(null);
  const skuListRef = useRef(null);

  const searchForm = () => {

    const types = [
      {value: 'all', label: '全部'},
      {value: 'min', label: '下限预警'},
      {value: 'max', label: '上限预警'},
    ];

    return (
      <>
        <GroupSku
          ref={skuListRef}
          align="start"
          noSearchButton
          noParts
          onChange={(id, type) => {
            tableRef.current.formActions.setFieldValue('classId', null);
            tableRef.current.formActions.setFieldValue('keyWords', null);
            switch (type) {
              case 'skuClass':
                tableRef.current.formActions.setFieldValue('classId', id);
                break;
              case 'skuName':
                tableRef.current.formActions.setFieldValue('keyWords', id);
                break;
              default:
                break;
            }
            tableRef.current.submit();
          }} />
        <div hidden>
          <FormItem name="keyWords" label="基础物料" component={Input} />
          <FormItem name="classId" label="基础物料" component={Input} />
        </div>
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

  const history = useHistory(null);

  const columns = [
    {
      title: '物料编码', width: 200, sorter: true, dataIndex: 'standard', render: (value, record) => {
        return (<Render>{record?.skuResult?.standard}</Render>);
      }
    },
    {
      title: '物料分类', width: 140, sorter: true, dataIndex: 'className', render: (value, record) => {
        return <Render>{record?.skuResult?.spuResult?.spuClassificationResult?.name}</Render>;
      }
    },
    {
      title: '物料', dataIndex: 'spuName', sorter: true, render: (value, record) => {
        return <>{SkuResultSkuJsons({skuResult: record.skuResult})}</>;
      }
    },
    {
      title: '库存数量', width: 100, sorter: true, dataIndex: 'number'
    },
    {
      title: '未到货数量', width: 120, sorter: true, dataIndex: 'floatingCargoNumber', render(value) {
        return <Button type="link" onClick={() => {
          history.push('/purchase/order');
        }}>{value}</Button>;
      }
    },
    {
      title: '库存下限', width: 100, sorter: true, dataIndex: 'inventoryFloor', render: (text, record) => {
        return (
          <Render style={{color: record.number <= record.inventoryFloor ? 'red' : ''}}>{text || '-'}</Render>);
      }
    },
    {
      title: '库存上限', width: 100, sorter: true, dataIndex: 'inventoryCeiling', render: (text, record) => {
        return (
          <Render style={{color: record.number >= record.inventoryCeiling ? 'red' : ''}}>{text || '-'}</Render>);
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
      onReset={() => {
        skuListRef.current.reset();
      }}
      ref={tableRef}
      api={warningSku}
      title={<Breadcrumb />}
      columns={columns}
      rowKey="skuId"
      searchForm={searchForm}
      actions={actions()}
    />

  </>;
};

export default List;
