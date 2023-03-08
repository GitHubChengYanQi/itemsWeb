/**
 * 轮播图列表页
 *
 * @author
 * @Date 2021-08-17 14:05:06
 */

import React, {useEffect, useRef, useState} from 'react';
import Table from '@/components/Table';
import Breadcrumb from '@/components/Breadcrumb';
import {Image, Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {bannerDelete, bannerList, batchDelete} from '../../bannerUrl';
import BannerEdit from '../../bannerEdit';
import * as SysField from '../../bannerField';

const {Column} = AntTable;
const {FormItem} = Form;

const BannerTable = (props) => {

  const {state} = props;


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

  useEffect(() => {
    if (state) {
      tableRef.current.formActions.setFieldValue('difference', state[0]);
      tableRef.current.submit();
    }
  }, [state]);

  const searchForm = () => {
    return (
      <>
        <FormItem label="轮播图标题" name="title" component={SysField.Title} />
        <FormItem hidden name="difference" component={SysField.Difference} />
      </>
    );
  };

  const [ids, setIds] = useState([]);

  const footer = () => {
    /**
     * 批量删除例子，根据实际情况修改接口地址
     */
    return (<DelButton api={{
      ...batchDelete
    }} onSuccess={()=>{
      tableRef.current.refresh();
    }
    } value={ids}>批量删除</DelButton>);
  };


  return (
    <>
      <Table
        title={<Breadcrumb />}
        api={bannerList}
        rowKey="bannerId"
        searchForm={searchForm}
        isModal={false}
        actions={actions()}
        ref={tableRef}
        footer={footer}
        selectedRowKeys={ids}
        onChange={(value)=>{
          setIds(value);
        }}
      >
        <Column title="轮播图标题" dataIndex="title"  />
        <Column title="图片"  dataIndex="imgUrl" render={(value, record) => {
          return (
            <>
              <Image width={100} height={50} src={value} />
            </>
          );
        }} />
        <Column title="排序" width={120} align='center' dataIndex="sort" sorter />
        <Column title="链接" dataIndex="link" />
        <Column title="分类" dataIndex="difference" render={(value,record)=>{
          return (
            <>
              {record.bannerDifferenceResult ? record.bannerDifferenceResult.difference : null}
            </>
          );
        }} />
        <Column />
        <Column title="操作" fixed='right' align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.bannerId);
              }} />
              <DelButton api={bannerDelete} value={record.bannerId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={100} />
      </Table>
      <Drawer width={800} title="编辑" component={BannerEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default BannerTable;
