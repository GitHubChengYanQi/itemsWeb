/**
 * 行业表列表页
 *
 * @author
 * @Date 2021-08-02 08:25:03
 */

import React, {useRef, useState} from 'react';
import {Table as AntTable} from 'antd';
import {createFormActions} from '@formily/antd';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {crmIndustryDelete, crmIndustryTreeView} from '../crmIndustryUrl';
import CrmIndustryEdit from '../crmIndustryEdit';
import Breadcrumb from '@/components/Breadcrumb';

const {Column} = AntTable;
const formActions = createFormActions();
const CrmIndustryList = () => {
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
    <div style={{padding:'0px 16px'}}>
      <Table
        contentHeight
        listHeader={false}
        cardHeaderStyle={{display:'none'}}
        SearchButton
        searchForm
        footer={footer}
        onChange={(keys) => {
          setIds(keys);
        }}
        api={crmIndustryTreeView}
        noSort
        rowKey="key"
        actions={actions()}
        ref={tableRef}
        formActions={formActions}
      >
        <Column title="行业名称" dataIndex="title" />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.key);
              }} />
              <DelButton api={crmIndustryDelete} value={record.key} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={300} />
      </Table>
      <Drawer width={800} title="行业" component={CrmIndustryEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </div>
  );
};
export default CrmIndustryList;
