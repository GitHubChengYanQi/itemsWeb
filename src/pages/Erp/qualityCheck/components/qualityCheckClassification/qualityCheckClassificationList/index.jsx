/**
 * 质检分类表列表页
 *
 * @author song
 * @Date 2021-10-27 13:08:57
 */

import React, {useRef} from 'react';
import Table from '@/components/Table';
import {Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {qualityCheckClassificationDelete, qualityCheckClassificationList} from '../qualityCheckClassificationUrl';
import QualityCheckClassificationEdit from '../qualityCheckClassificationEdit';
import * as SysField from '../qualityCheckClassificationField';
import Breadcrumb from '@/components/Breadcrumb';

const {Column} = AntTable;
const {FormItem} = Form;

const QualityCheckClassificationList = () => {
  const ref = useRef(null);
  const tableRef = useRef(null);
  const actions = () => {
    return (
      <>
        <AddButton style={{marginRight:24}} onClick={() => {
          ref.current.open(false);
        }} />
      </>
    );
  };

  const searchForm = () => {
    return (
      <>
        <FormItem label="名称" name="name" component={SysField.Name} />
      </>
    );
  };

  return (
    <div style={{padding:16}}>
      <Table
        api={qualityCheckClassificationList}
        rowKey="qualityCheckClassificationId"
        searchForm={searchForm}
        isModal
        contentHeight
        actions={actions()}
        ref={tableRef}
      >
        <Column title="名称" dataIndex="name" />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.qualityCheckClassificationId);
              }} />
              <DelButton
                api={qualityCheckClassificationDelete}
                value={record.qualityCheckClassificationId}
                onSuccess={() => {
                  tableRef.current.refresh();
                }} />
            </>
          );
        }} width={300} />
      </Table>
      <Drawer width={800} title="编辑" component={QualityCheckClassificationEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </div>
  );
};

export default QualityCheckClassificationList;
