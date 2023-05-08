/**
 * 微信小程序配置表（对应租户）列表页
 *
 * @author Captain_Jazz
 * @Date 2023-04-25 09:53:02
 */

import React, {useRef} from 'react';
import Table from '@/components/Table';
import {Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {wxMaConfigDelete, wxMaConfigList} from '../wxMaConfigUrl';
import WxMaConfigEdit from '../wxMaConfigEdit';
import * as SysField from '../wxMaConfigField';
import Breadcrumb from '@/components/Breadcrumb';

const {Column} = AntTable;
const {FormItem} = Form;

const WxMaConfigList = () => {
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


  return (
    <>
      <Table
        title={<Breadcrumb title='租户配置管理' />}
        api={wxMaConfigList}
        rowKey="wxMaConfigId"
        actions={actions()}
        noTableColumnSet
        ref={tableRef}
      >
        <Column title="租户id" dataIndex="tenantId"/>
        <Column title="appid" dataIndex="appid"/>
        <Column title="secret" dataIndex="secret"/>
        <Column title="aesKey" dataIndex="aesKey"/>
        <Column title="token" dataIndex="token"/>
        <Column title="msgDataFormat" dataIndex="msgDataFormat"/>
        <Column/>
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.wxMaConfigId);
              }}/>
              <DelButton api={wxMaConfigDelete} value={record.wxMaConfigId} onSuccess={()=>{
                tableRef.current.refresh();
              }}/>
            </>
          );
        }} width={300}/>
      </Table>
      <Drawer width={800} title="编辑" component={WxMaConfigEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref}/>
    </>
  );
};

export default WxMaConfigList;
