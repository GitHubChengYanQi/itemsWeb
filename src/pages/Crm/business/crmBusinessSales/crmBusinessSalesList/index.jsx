/**
 * 销售列表页
 *
 * @author
 * @Date 2021-08-02 15:47:16
 */

import React, {useRef, useState} from 'react';
import Table from '@/components/Table';
import {Button, Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {crmBusinessSalesDelete, crmBusinessSalesList} from '../crmBusinessSalesUrl';
import CrmBusinessSalesEdit from '../crmBusinessSalesEdit';
import * as SysField from '../crmBusinessSalesField';
import Modal2 from '@/components/Modal';
import CrmBusinessSalesProcessList from '@/pages/Crm/business/crmBusinessSalesProcess/crmBusinessSalesProcessList';
import {Name} from '../crmBusinessSalesField';
import Breadcrumb from '@/components/Breadcrumb';
import {createFormActions} from '@formily/antd';
import store from '@/store';
import Modal from '@/components/Modal';

const {Column} = AntTable;
const {FormItem} = Form;

const formActions = createFormActions();

const CrmBusinessSalesList = () => {
  const ref = useRef(null);
  const refCrmBusinessSalesProcessList = useRef(null);
  const tableRef = useRef(null);

  const dataDispatchers = store.useModel('dataSource')[1];

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
        <FormItem label="分类名称" name="name" component={SysField.Name} />
      </>
    );
  };

  const [ids, setIds] = useState([]);

  const footer = () => {
    /**
     * 批量删除例子，根据实际情况修改接口地址
     */
    return (<DelButton api={{
      // ...customerBatchDelete
    }} onSuccess={() => {
      tableRef.current.refresh();
    }} value={ids}>批量删除</DelButton>);
  };

  return (
    <>
      <Table
        contentHeight
        footer={footer}
        onChange={(keys) => {
          setIds(keys);
        }}
        api={crmBusinessSalesList}
        rowKey="salesId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
        formActions={formActions}
      >
        <Column title="分类名称" dataIndex="name" render={(text, record,) => {
          return (
            <Button type="link" onClick={() => {
              refCrmBusinessSalesProcessList.current.open(record.salesId);
            }}>{text}</Button>
          );
        }} />
        <Column title="备注" dataIndex="note" />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.salesId);
              }} />
              <DelButton api={crmBusinessSalesDelete} value={record.salesId} onSuccess={() => {
                dataDispatchers.getBusinessSale();
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={300} />
      </Table>
      <Modal width={800} title="流程" component={CrmBusinessSalesEdit} onSuccess={() => {
        dataDispatchers.getBusinessSale();
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />

      <Modal width={900} title="流程" component={CrmBusinessSalesProcessList} onSuccess={() => {
        refCrmBusinessSalesProcessList.current.close();
      }} ref={refCrmBusinessSalesProcessList} />
    </>
  );
};

export default CrmBusinessSalesList;
