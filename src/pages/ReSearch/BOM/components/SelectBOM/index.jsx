import React from 'react';
import {Table as AntTable} from 'antd';
import {createFormActions} from "@formily/antd";
import Table from '@/components/Table';
import {bomsByskuId} from '@/pages/ReSearch/BOM/components/AddProcess';
import Form from "@/components/Form";
import {skuId} from "@/pages/ReSearch/BOM/components/field";
import {sopList} from "@/pages/ReSearch/sop/sopUrl";


const {Column} = AntTable;
const {FormItem} = Form;
const formActionsPublic = createFormActions();

const SelectBOM=()=>{

  const search = ()=>{
    return <>
      <FormItem label="编号" name="skuId" value="12222" component={skuId} />
    </>;
  };

  return <>
    <Table
      formActions={formActionsPublic}
      selectionType="radio"
      api={sopList}
      rowKey="sopId"
      searchForm={search}
    ><Column title="编号" />
      <Column title="关联工序" />
      <Column title="名称" />
      <Column title="版本号" />
      <Column title="创建人" />
      <Column title="创建时间" />
      <Column />
      <Column title="操作"/>
    </Table>
  </>;
};

export default SelectBOM;
