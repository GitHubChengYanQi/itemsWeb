/**
 * 仓库总表列表页
 *
 * @author
 * @Date 2021-07-15 11:13:02
 */

import React, {useEffect, useRef, useState,} from 'react';
import {
  Button,
  Input, Progress,
  Space, Statistic,
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
import MinWidthDiv from '@/components/MinWidthDiv';
import Note from '@/components/Note';

const {baseURI} = config;
const {FormItem} = Form;

const StockTable = (props) => {

  const {storeHouse} = props;

  const tableRef = useRef();

  const [data, setData] = useState([]);

  const token = cookie.get('tianpeng-token');

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
          onOk={() => {
            tableRef.current.submit();
          }}
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
          name="partsId"
          component={BomSelect} />
        <FormItem
          name="selectBom"
          component={SelectBom} />
        <FormItem
          visible={storeHouse || false}
          label="库位"
          id={storeHouse && storeHouse[0]}
          placeholder="搜索库位"
          name="storehousePositionsId"
          component={Position} />
        <FormItem
          hidden
          name="storehouseId"
          component={Input} />
        <FormItem
          hidden
          name="stockView"
          value
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
      actionButton={actions()}
      showCard={<div style={{borderBottom: 'solid 1px #eee', marginBottom: 16}}>
        <Space size={24} style={{paddingBottom: 24}}>
          <Progress
            type="circle"
            percent={100}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            format={() =>
              <Statistic title="物料种类" value={data[0] ? data[0].skuTypeNum : 0} />
            } />
          <Progress
            type="circle"
            percent={100}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            format={() =>
              <Statistic title="总数量" value={data[0] ? data[0].skuCount : 0} />
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
      branch={(data) => {
        setData(data || []);
        return data;
      }}
      api={skuList}
      tableKey="stockSku"
      rowKey="skuId"
      {...props}
    >
      <Table.Column key={1} title="物料编码" dataIndex="standard" render={(value) => {
        return <MinWidthDiv width={60}>{value}</MinWidthDiv>;
      }} />
      <Table.Column key={2} title="物料名称" dataIndex="spuName" render={(value) => {
        return <MinWidthDiv width={60}>{value}</MinWidthDiv>;
      }} />
      <Table.Column key={3} title="物料型号" dataIndex="skuName" render={(value) => {
        return <MinWidthDiv width={60}>{value}</MinWidthDiv>;
      }} />
      <Table.Column key={4} title="物料规格" dataIndex="specifications" render={(value) => {
        return <MinWidthDiv width={60}>{value}</MinWidthDiv>;
      }} />
      <Table.Column title="物料描述" key={5} render={(value, record) => {
        return <div style={{minWidth: 100, maxWidth: 300}}>
          <Note value={<SkuResultSkuJsons describe skuResult={record} />} />
        </div>;
      }} />
      <Table.Column key={6} title="库存数量" dataIndex="stockNumber" render={(value) => {
        return <MinWidthDiv width={60}>{value || 0}</MinWidthDiv>;
      }} />
      <Table.Column key={6} title="预购数量" dataIndex="purchaseNumber" render={(value) => {
        return <MinWidthDiv width={60}>{value || 0}</MinWidthDiv>;
      }} />
      <Table.Column key={7} title="库位" dataIndex="positionsResult" render={(value) => {
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
