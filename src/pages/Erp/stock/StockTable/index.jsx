/**
 * 仓库总表列表页
 *
 * @author
 * @Date 2021-07-15 11:13:02
 */

import React, {useEffect, useRef} from 'react';
import {
  Input,
  Progress,
  Space, Spin,
  Statistic,
} from 'antd';
import {config} from 'ice';
import cookie from 'js-cookie';
import Table from '@/components/Table';
import Breadcrumb from '@/components/Breadcrumb';
import Form from '@/components/Form';
import {Position, StockNumbers} from '@/pages/Erp/stock/StockField';
import Analysis from '@/pages/Erp/Analysis';
import Import from '@/pages/Erp/sku/SkuTable/Import';
import {skuV1List} from '@/pages/Erp/sku/skuUrl';
import Render from '@/components/Render';
import {useRequest} from '@/util/Request';
import {isArray, MathCalc} from '@/util/Tools';
import ThousandsSeparator from '@/components/ThousandsSeparator';
import GroupSku from '@/pages/Erp/sku/components/GroupSku';
import Note from '@/components/Note';

const {baseURI} = config;
const {FormItem} = Form;

const stockDetailApi = {url: '/viewStockDetails/detail', method: 'GET'};

const StockTable = (props) => {

  const {storeHouse} = props;

  const tableRef = useRef();

  const skuListRef = useRef();

  const token = cookie.get('tianpeng-token');

  const {loading, data: stockDetail} = useRequest(stockDetailApi);

  const actions = () => {
    return (
      <Space size={24}>
        <Analysis type="link" style={{padding: 0}} />
        <a href={`${baseURI}stockExcel/stockExport?authorization=${token}`} target="_blank" rel="noreferrer">导出库存</a>
        <Import
          url={`${baseURI}Excel/importPositionBind`}
          title="导入库存"
          module="stock"
          templateUrl={`${baseURI}Excel/positionTemp?authorization=${token}`}
        />
      </Space>
    );
  };

  useEffect(() => {
    if (storeHouse) {
      tableRef.current.formActions.setFieldValue('storehouseId', storeHouse[0]);
      tableRef.current.formActions.setFieldValue('storehousePositionsId', null);
      tableRef.current.submit();
    }
  }, [storeHouse]);

  const searchForm = () => {

    return (
      <>
        <GroupSku
          ref={skuListRef}
          align="start"
          noSearchButton
          noParts
          onChange={(id, type) => {
            tableRef.current.formActions.setFieldValue('classId', null);
            tableRef.current.formActions.setFieldValue('keyWord', null);
            switch (type) {
              case 'skuClass':
                tableRef.current.formActions.setFieldValue('classId', id);
                break;
              case 'skuName':
                tableRef.current.formActions.setFieldValue('keyWord', id);
                break;
              default:
                break;
            }
            tableRef.current.submit();
          }} />
        <div hidden>
          <FormItem name="keyWord" component={Input} />
          <FormItem name="classId" component={Input} />
          <FormItem name="storehouseId" component={Input} />
        </div>
        <FormItem
          label="库存范围"
          name="numbers"
          component={StockNumbers}
        />
        <FormItem
          visible={isArray(storeHouse)[0] || false}
          label="库位"
          id={isArray(storeHouse)[0]}
          placeholder="搜索库位"
          name="storehousePositionsId"
          component={Position} />
      </>
    );
  };

  const columns = [
    {title: '物料编码', width: 150, dataIndex: 'standard', sorter: true},
    {title: '物料分类', width: 150, dataIndex: 'categoryName', sorter: true},
    {title: '物料名称', width: 150, dataIndex: 'spuName', sorter: true},
    {title: '物料型号', width: 150, dataIndex: 'skuName', sorter: true},
    {title: '物料规格', width: 150, dataIndex: 'specifications', sorter: true},
    {
      title: '物料描述', width: 300, dataIndex: 'skuValue', render: (value) => {
        return <Render width={300}><Note value={value} maxWidth={300} /></Render>;
      }
    },
    {
      title: '库存数量', width: 150, dataIndex: 'stockNum', sorter: true, render: (value) => {
        return <Render>{value || 0}</Render>;
      }
    },
    {
      title: '单价', width: 150, dataIndex: 'price', sorter: true, render: (value) => {
        return <ThousandsSeparator suffix="元" value={value || 0} />;
      }
    },
    {
      title: '总价', width: 150, dataIndex: 'price', sorter: true, render: (value, record) => {
        return <ThousandsSeparator suffix="元" value={MathCalc((value || 0), (record.stockNum || 0), 'cheng')} />;
      }
    },
    {title: '未到货数量', width: 150, dataIndex: 'floatingCargoNumber', sorter: true},
    {title: '备料数量', width: 150, dataIndex: 'lockStockDetailNumber', sorter: true},
    {title: '库位', width: 150, dataIndex: 'storeName', sorter: true},
    {title: '仓库', width: 150, dataIndex: 'positionsResult', sorter: true},
  ];

  return (
    <Table
      onReset={() => {
        skuListRef.current.reset();
      }}
      // cardHeaderStyle={{display: 'none'}}
      columns={columns}
      ref={tableRef}
      noRowSelection
      actionButton={actions()}
      showCard={loading ?
        <div style={{margin: 24}}><Spin size="large" /></div>
        :
        <div style={{borderBottom: 'solid 1px #eee', marginBottom: 16}}>
          <Space size={24} style={{paddingBottom: 24}}>
            <Progress
              type="circle"
              percent={100}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              format={() =>
                <Statistic title="物料种类" value={stockDetail && stockDetail.type} />
              } />
            <Progress
              type="circle"
              percent={100}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              format={() =>
                <Statistic title="总数量" value={stockDetail && stockDetail.number} />
              } />
          </Space>
        </div>}
      title={<Breadcrumb />}
      searchForm={searchForm}
      formSubmit={(values) => {
        const numbers = values.numbers || {};
        values = {
          ...values,
          numbers: null,
          maxNum: numbers.maxNum,
          mixNum: numbers.mixNum,
        };
        return values;
      }}
      api={skuV1List}
      tableKey="stockSku"
      rowKey="skuId"
      {...props}
    />
  );
};

export default StockTable;
