/**
 * 仓库总表列表页
 *
 * @author
 * @Date 2021-07-15 11:13:02
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  Input,
  Progress,
  Space, Spin,
  Statistic,
} from 'antd';
import {config} from 'ice';
import cookie from 'js-cookie';
import Table from '@/components/Table';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import Breadcrumb from '@/components/Breadcrumb';
import Form from '@/components/Form';
import {BomSelect, Position, SelectBom, StockNumbers} from '@/pages/Erp/stock/StockField';
import Analysis from '@/pages/Erp/Analysis';
import Import from '@/pages/Erp/sku/SkuTable/Import';
import {skuList} from '@/pages/Erp/sku/skuUrl';
import Render from '@/components/Render';
import Note from '@/components/Note';
import {useRequest} from '@/util/Request';
import {isArray} from '@/util/Tools';
import {skuPriceList} from '@/pages/Erp/StockMoney/url';
import ThousandsSeparator from '@/components/ThousandsSeparator';

const {baseURI} = config;
const {FormItem} = Form;

const stockDetailApi = {url: '/viewStockDetails/detail', method: 'GET'};

const StockTable = (props) => {

  const {storeHouse} = props;

  const tableRef = useRef();

  const token = cookie.get('tianpeng-token');

  const {loading, data: stockDetail} = useRequest(stockDetailApi);

  const {run: getPriceList} = useRequest(skuPriceList, {manual: true});

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
        <FormItem
          label="物料名称"
          placeholder="搜索物料"
          name="skuName"
          component={Input} />
        <FormItem
          label="库存范围"
          name="numbers"
          component={StockNumbers} />
        <FormItem
          label="BOM查询"
          name="partsSkuId"
          component={BomSelect} />
        <FormItem
          name="selectBom"
          component={SelectBom} />
        <FormItem
          visible={isArray(storeHouse)[0] || false}
          label="库位"
          id={isArray(storeHouse)[0]}
          placeholder="搜索库位"
          name="storehousePositionsId"
          component={Position} />
        <FormItem
          hidden
          name="storehouseId"
          component={Input} />
      </>
    );
  };

  const positionResult = (data) => {

    if (!data) {
      return '';
    }

    if (!data.supper) {
      return data.name;
    }

    return `${positionResult(data.supper)}-${data.name}`;
  };

  return (
    <Table
      ref={tableRef}
      noRowSelection
      format={async (list) => {
        const skuIds = list.map(item => item.skuId);
        const res = await getPriceList({
          data: {skuIds}
        });
        const tmp = {};
        isArray(res).forEach((item) => {
          tmp[`${item.skuId}`] = item.price;
        });
        return list.map(item => ({...item, price: tmp[item.skuId]}));
      }}
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
      api={skuList}
      tableKey="stockSku"
      rowKey="skuId"
      {...props}
    >
      <Table.Column key={1} title="物料编码" dataIndex="standard" sorter render={(value) => {
        return <Render width={60}>{value}</Render>;
      }} />
      <Table.Column key={1} title="物料分类" dataIndex="spuResult" render={(value) => {
        return <Render width={60}>{value?.spuClassificationResult?.name}</Render>;
      }} />
      <Table.Column key={2} title="物料名称" dataIndex="spuName" sorter render={(value) => {
        return <Render width={60}>{value}</Render>;
      }} />
      <Table.Column key={3} title="物料型号" dataIndex="skuName" sorter render={(value) => {
        return <Render width={60}>{value}</Render>;
      }} />
      <Table.Column key={4} title="物料规格" dataIndex="specifications" sorter render={(value) => {
        return <Render width={60}>{value}</Render>;
      }} />
      <Table.Column title="物料描述" key={5} render={(value, record) => {
        return <div style={{minWidth: 100, maxWidth: 300}}>
          <Note value={<SkuResultSkuJsons describe skuResult={record} />} />
        </div>;
      }} />
      <Table.Column key={6} title="库存数量" dataIndex="stockNumber" sorter render={(value, record) => {
        const stockNumber = (record.stockNumber || 0) - (record.lockStockDetailNumber || 0);
        return <Render width={60}>{stockNumber || 0}</Render>;
      }} />
      <Table.Column key={6} title="价格" dataIndex='price' render={(value) => {
        return <ThousandsSeparator suffix='元' value={value || 0} />;
      }} />
      <Table.Column key={6} title="未到货数量" dataIndex="floatingCargoNumber" sorter render={(value) => {
        return <Render width={60}>{value || 0}</Render>;
      }} />
      <Table.Column key={6} title="备料数量" dataIndex="lockStockDetailNumber" sorter render={(value) => {
        return <Render width={60}>{value || 0}</Render>;
      }} />
      <Table.Column key={6} title="预购数量" dataIndex="purchaseNumber" sorter render={(value) => {
        return <Render width={60}>{value || 0}</Render>;
      }} />
      <Table.Column key={7} title="库位" dataIndex="positionsResult" sorter render={(value) => {
        if (Array.isArray(value) && value.length > 0) {
          return value.map((item, index) => {
            return <div key={index} style={{minWidth: 60}}>{positionResult(item)}</div>;
          });
        }
        return '-';
      }} />
      <Table.Column key={8} title="仓库" dataIndex="storehouseResult" render={(value) => {
        return <div style={{minWidth: 60}}>{value ? value.name : '-'}</div>;
      }} />
      <Table.Column />
    </Table>
  );
};

export default StockTable;
