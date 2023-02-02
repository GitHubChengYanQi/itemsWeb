/**
 * 注意事项列表页
 *
 * @author song
 * @Date 2022-05-27 13:45:48
 */

import React, {useRef} from 'react';
import Table from '@/components/Table';
import {Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {announcementsDelete, announcementsList} from '../announcementsUrl';
import AnnouncementsEdit from '../announcementsEdit';
import * as SysField from '../announcementsField';
import Breadcrumb from '@/components/Breadcrumb';

const {Column} = AntTable;
const {FormItem} = Form;

const AnnouncementsList = () => {
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

  return (
    <>
      <Table
        api={announcementsList}
        rowKey="noticeId"
        contentHeight
        actions={actions()}
        ref={tableRef}
      >
        <Column title="内容" dataIndex="content" />
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.noticeId);
              }} />
              <DelButton api={announcementsDelete} value={record.noticeId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={300} />
      </Table>
      <Drawer width={800} title="编辑" component={AnnouncementsEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default AnnouncementsList;
