/**
 * 来源表列表页
 *
 * @author
 * @Date 2021-07-19 17:59:08
 */

import React, {useRef, useState} from 'react';
import Table from '@/components/Table';
import {Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import Breadcrumb from '@/components/Breadcrumb';
import {originDelete, originList} from '../OriginUrl';
import * as SysField from '../OriginField';

import OriginEdit from '../OriginEdit';

const {Column} = AntTable;
const {FormItem} = Form;

const OriginList = () => {
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
        <FormItem label="来源名称" name="originName" component={SysField.Name} />
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
        footer={footer}
        onChange={(keys) => {
          setIds(keys);
        }}
        title={<Breadcrumb title="商机来源" />}
        api={originList}
        rowKey="originId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}

      >
        <Column title="来源名称" dataIndex="originName" />
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.originId);
              }} />
              <DelButton api={originDelete} value={record.originId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={300} />
      </Table>
      <Drawer width={800} title="编辑" component={OriginEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default OriginList;
