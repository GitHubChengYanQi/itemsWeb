/**
 * sku详情表列表页
 *
 * @author
 * @Date 2021-10-18 14:14:21
 */

import React, {useRef} from 'react';
import {Table as AntTable} from 'antd';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {skuValuesDelete, skuValuesList} from '../skuValuesUrl';
import SkuValuesEdit from '../skuValuesEdit';
import * as SysField from '../skuValuesField';

const {Column} = AntTable;
const {FormItem} = Form;

const SkuValuesList = () => {
  const ref = useRef(null);
  const tableRef = useRef(null);
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
        <FormItem label="" name="skuId" component={SysField.SkuId} />
        <FormItem label="属性Id" name="attributeId" component={SysField.AttributeId} />
        <FormItem label="属性值id" name="attributeValuesId" component={SysField.AttributeValuesId} />
      </>
    );
  };

  return (
    <>
      <Table
        title={<h2>列表</h2>}
        api={skuValuesList}
        rowKey="skuDetailId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="属性Id" dataIndex="attributeId" />
        <Column title="属性值id" dataIndex="attributeValuesId" />
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.skuDetailId);
              }} />
              <DelButton api={skuValuesDelete} value={record.skuDetailId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={300} />
      </Table>
      <Drawer width={800} title="编辑" component={SkuValuesEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default SkuValuesList;
