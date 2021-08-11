/**
 * 清单列表页
 *
 * @author
 * @Date 2021-07-14 14:30:20
 */

import React, {useRef} from 'react';
import Table from '@/components/Table';
import {Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import Breadcrumb from '@/components/Breadcrumb';
import Modal2 from '@/components/Modal';
import {partsDelete, partsList} from '../PartsUrl';
import PartsEdit from '../PartsEdit';
import * as SysField from '../PartsField';

const {Column} = AntTable;
const {FormItem} = Form;

const PartsList = (props) => {
  const ref = useRef(null);
  const tableRef = useRef(null);
  const actions = () => {
    return (
      <>
        <AddButton onClick={() => {
          ref.current.open(false);
        }}/>
      </>
    );
  };

  const searchForm = () => {
    return (
      <>
        <FormItem label="产品名称" disabled name="ItemId" value={props.itemsId} component={SysField.ItemId}/>
      </>
    );
  };

  return (
    <>
      <Table
        title={<Breadcrumb title='清单管理'/>}
        api={partsList}
        rowKey="partsId"
        searchForm={searchForm}
        SearchButton
        actions={actions()}
        ref={tableRef}
      >
        <Column title="零件名称" render={(value,record)=>{
          return (
            <div>
              {
                record.itemsResult ? record.itemsResult.name : ''
              }
            </div>
          );
        }}/>
        <Column title="零件数量" dataIndex="number"/>
        <Column/>
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record);
              }}/>
              <DelButton api={partsDelete} value={record.partsId} onSuccess={()=>{
                tableRef.current.refresh();
              }}/>
            </>
          );
        }} width={300}/>
      </Table>
      <Modal2 width={900} title="清单" component={PartsEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} itemsId={props.itemsId}/>
    </>
  );
};

export default PartsList;
