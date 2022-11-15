/**
 * 客户地址表列表页
 *
 * @author
 * @Date 2021-07-23 10:06:11
 */

import React, {useRef} from 'react';
import Table from '@/components/Table';
import {Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {adressDelete, adressList} from '../AdressUrl';
import * as SysField from '../AdressField';
import Breadcrumb from '@/components/Breadcrumb';
import Modal2 from '@/components/Modal';
import CheckButton from '@/components/CheckButton';
import AdressEdit from '@/pages/Crm/adress/AdressEdit';

const {Column} = AntTable;
const {FormItem} = Form;

const AdressList = (props) => {

  const {choose} = props;

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
        <FormItem label="客户id" name="clientId" component={SysField.ClientId}/>
      </>
    );
  };

  return (
    <>
      <Table
        title={<Breadcrumb />}
        api={adressList}
        rowKey="adressId"
        isModal={false}
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="省市区地址" dataIndex="region"/>
        <Column title="详细地址" dataIndex="location"/>
        <Column title="经度" dataIndex="longitude"/>
        <Column title="纬度" dataIndex="latitude"/>
        <Column title="客户" dataIndex="clientId"/>
        <Column/>
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              {choose ? <CheckButton onClick={() => {
                choose(record);
                props.onSuccess();
              }} /> : null}
              <EditButton onClick={() => {
                ref.current.open(record.adressId);
              }}/>
              <DelButton api={adressDelete} value={record.adressId} onSuccess={()=>{
                tableRef.current.refresh();
              }}/>
            </>
          );
        }} width={300}/>
      </Table>
      <Modal2 width={800} title="编辑" component={AdressEdit} onSuccess={() => {
        tableRef.current.submit();
        ref.current.close();
      }} ref={ref}/>
    </>
  );
};

export default AdressList;
