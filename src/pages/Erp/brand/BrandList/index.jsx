/**
 * 品牌表列表页
 *
 * @author
 * @Date 2021-07-14 14:19:04
 */

import React, {useRef, useState} from 'react';
import {Table as AntTable} from 'antd';
import {createFormActions} from '@formily/antd';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {brandDelete, brandList} from '../BrandUrl';
import BrandEdit from '../BrandEdit';
import * as SysField from '../BrandField';
import {batchDelete} from '@/pages/Erp/material/MaterialUrl';
import Drawer from '@/components/Drawer';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const BrandList = () => {
  const ref = useRef(null);
  const tableRef = useRef(null);
  const actions = () => {
    return (
      <div style={{marginRight:24}}>
        <AddButton onClick={() => {
          ref.current.open(false);
        }}/>
      </div>
    );
  };

  const searchForm = () => {
    return (
      <>
        <FormItem label="品牌名称" name="brandName" component={SysField.BrandName}/>
      </>
    );
  };

  const [ids,setIds] = useState([]);

  const footer = () => {
    /**
     * 批量删除例子，根据实际情况修改接口地址
     */
    return (<DelButton api={{
      ...batchDelete
    }} onSuccess={() => {
      tableRef.current.refresh();
    }} value={ids}>批量删除</DelButton>);
  };

  return (
    <>
      <Table
        contentHeight
        listHeader={false}
        cardHeaderStyle={{display:'none'}}
        api={brandList}
        formActions={formActionsPublic}
        rowKey="brandId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
        footer={footer}
        onChange={(value)=>{
          setIds(value);
        }}
      >
        <Column title="品牌名称" dataIndex="brandName" sorter/>
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.brandId);
              }}/>
              <DelButton api={brandDelete} value={record.brandId} onSuccess={()=>{
                tableRef.current.refresh();
              }}/>
            </>
          );
        }} width={100}/>
      </Table>
      <Drawer width={800} title="品牌" component={BrandEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref}/>
    </>
  );
};

export default BrandList;
