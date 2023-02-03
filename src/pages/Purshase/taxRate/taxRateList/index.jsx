/**
 * 列表页
 *
 * @author
 * @Date 2021-12-21 11:29:07
 */

import React, {useRef} from 'react';
import {createFormActions} from '@formily/antd';
import {Table as AntTable} from 'antd';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {taxRateDelete, taxRateList} from '../taxRateUrl';
import TaxRateEdit from '../taxRateEdit';
import * as SysField from '../taxRateField';
import Breadcrumb from '@/components/Breadcrumb';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const TaxRateList = () => {
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
        <FormItem label="税率名称" name="taxRateName" component={SysField.TaxRateName} />
        <FormItem label="税率值" name="taxRateValue" component={SysField.TaxRateValue} />
      </>
    );
  };

  return (
    <div style={{padding:16}}>
      <Table
        api={taxRateList}
        contentHeight
        listHeader={false}
        cardHeaderStyle={{display:'none'}}
        rowKey="taxRateId"
        formActions={formActionsPublic}
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="税率值" dataIndex="taxRateValue" />
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.taxRateId);
              }} />
              <DelButton api={taxRateDelete} value={record.taxRateId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={300} />
      </Table>
      <Drawer width={800} title="税率" component={TaxRateEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </div>
  );
};

export default TaxRateList;
