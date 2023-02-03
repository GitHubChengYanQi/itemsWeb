/**
 * 轮播图分类列表页
 *
 * @author
 * @Date 2021-08-18 10:38:50
 */

import React, {useRef} from 'react';
import Table from '@/components/Table';
import {Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {bannerDifferenceDelete, bannerDifferenceList} from '../bannerDifferenceUrl';
import BannerDifferenceEdit from '../bannerDifferenceEdit';
import * as SysField from '../bannerDifferenceField';
import Breadcrumb from '@/components/Breadcrumb';

const {Column} = AntTable;
const {FormItem} = Form;

const BannerDifferenceList = () => {
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
        <FormItem label="轮播图分类名称" name="difference" component={SysField.Difference} />
      </>
    );
  };

  return (
    <>
      <Table
        api={bannerDifferenceList}
        rowKey="classificationId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="轮播图分类名称" dataIndex="difference" />
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.classificationId);
              }} />
              {/*<DelButton api={bannerDifferenceDelete} value={record.classificationId} onSuccess={()=>{*/}
              {/*  tableRef.current.refresh();*/}
              {/*}}/>*/}
            </>
          );
        }} width={300} />
      </Table>
      <Drawer width={800} title="编辑" component={BannerDifferenceEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default BannerDifferenceList;
