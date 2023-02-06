/**
 * 列表页
 *
 * @author
 * @Date 2021-10-18 14:14:21
 */

import React, {useRef, useState} from 'react';
import {Button, Space, Table as AntTable} from 'antd';
import {config, useHistory} from 'ice';
import cookie from 'js-cookie';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {deleteBatch, spuDelete, spuList} from '../spuUrl';
import SpuEdit from '../spuEdit';
import * as SysField from '../spuField';
import Modal from '@/components/Modal';
import Breadcrumb from '@/components/Breadcrumb';
import Code from '@/pages/Erp/spu/components/Code';
import Import from '@/pages/Erp/sku/SkuTable/Import';

const {Column} = AntTable;
const {FormItem} = Form;
const {baseURI} = config;

const SpuList = () => {

  const token = cookie.get('tianpeng-token');

  const ref = useRef(null);
  const formRef = useRef(null);
  const tableRef = useRef(null);
  const history = useHistory();

  const [ids, setIds] = useState([]);

  const actions = () => {
    return (
      <>
        <AddButton onClick={() => {
          ref.current.open(false);
        }} />
      </>
    );
  };

  const searchForm = () => {
    return (
      <>
        <FormItem placeholder="产品名称" name="name" component={SysField.Name} />
        <FormItem hidden name="type" value={1} component={SysField.type} />
      </>
    );
  };

  const footer = () => {
    return <>
      <DelButton api={{
        ...deleteBatch,
      }} onSuccess={() => {
        tableRef.current.refresh();
      }} value={ids}>批量删除</DelButton>
    </>;
  };

  return (
    <>
      <Table
        title={<Breadcrumb />}
        api={spuList}
        rowKey="spuId"
        tableKey="spu"
        actionButton={<Space>
          <Import
            url={`${baseURI}spuExcel/spuImport`}
            title="导入产品"
            module="spu"
            templateUrl={`${baseURI}spuExcel/spuTemp?authorization=${token}`}
          />
        </Space>}
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
        footer={footer}
        onChange={setIds}
      >
        <Column title="名称" key={1} dataIndex="name" render={(value, record) => {
          return (
            <>
              <Code source="spu" id={record.spuId} />
              <Button type="link" onClick={() => {
                history.push(`/spu/SPUS/detail/${record.spuId}`);
              }}>
                {value}
              </Button>
            </>
          );
        }} sorter />

        <Column title="系列" key={2} dataIndex="categoryId" render={(value, record) => {
          return (
            <>
              {record.category && record.category.categoryName}
            </>
          );
        }} />
        <Column title="单位" key={3} width={120} align="center" dataIndex="unitId" render={(value, record) => {
          return (
            <>
              {record.unitResult && record.unitResult.unitName}
            </>
          );
        }} sorter />
        <Column title="分类" key={4} width={120} render={(value, record) => {
          return (
            <>
              {
                record.spuClassificationResult && record.spuClassificationResult.name
              }
            </>
          );
        }} sorter />
        <Column title="生产类型" key={5} width={120} align="center" dataIndex="productionType" render={(value) => {
          switch (value) {
            case 0:
              return '自制件';
            case 1:
              return '委派件';
            case 2:
              return '外购件';
            default:
              break;
          }
        }} sorter />
        <Column title="养护周期" key={6} width={120} align='center' dataIndex="curingCycle" render={(value) => {
          return (
            <>
              {value && `${value}天`}
            </>
          );
        }} sorter />
        <Column />
        <Column title="操作" width={150} key={7} fixed="right" align="center" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record);
              }} />
              <DelButton api={spuDelete} value={record.spuId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} />
      </Table>
      <Modal
        width={1000}
        title="产品"
        compoentRef={formRef}
        component={SpuEdit}
        footer={<>
          <Button type="primary" onClick={() => {
            formRef.current.formRef.current.submit();
          }}>保存</Button>
          <Button type="default" onClick={() => {
            ref.current.close();
          }}>取消</Button>
        </>}
        onSuccess={() => {
          tableRef.current.refresh();
          ref.current.close();
        }}
        ref={ref}
      />
    </>
  );
};

export default SpuList;
