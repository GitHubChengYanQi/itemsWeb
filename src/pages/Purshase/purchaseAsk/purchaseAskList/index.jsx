/**
 * 采购申请列表页
 *
 * @author song
 * @Date 2021-12-15 09:35:37
 */

import React, {useRef} from 'react';
import {Button, Table as AntTable} from 'antd';
import {createFormActions} from '@formily/antd';
import Table from '@/components/Table';
import AddButton from '@/components/AddButton';
import Form from '@/components/Form';
import {purchaseAskList} from '../purchaseAskUrl';
import * as SysField from '../purchaseAskField';
import Breadcrumb from '@/components/Breadcrumb';
import Render from '@/components/Render';
import Documents from '@/pages/Workflow/Documents';
import {DocumentEnums} from '@/pages/BaseSystem/Documents/Enums';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const PurchaseAskList = ({status, ...props}) => {
  const tableRef = useRef(null);
  const documentRef = useRef();

  const actions = () => {
    return (
      <>
        <AddButton onClick={() => {
          documentRef.current.create(DocumentEnums.purchaseAsk);
        }} />
      </>
    );
  };

  const searchForm = () => {
    return (
      <>
        <FormItem label="采购编号" name="coding" component={SysField.SelectCoding} />
        <FormItem label="采购类型" name="type" component={SysField.Type} />
        <FormItem label="采购状态" name="status" value={status} component={SysField.Status} />
      </>
    );
  };

  return (
    <>
      <Table
        api={purchaseAskList}
        rowKey="purchaseAskId"
        noRowSelection
        tableKey="purchaseAsk"
        formActions={formActionsPublic}
        title={<Breadcrumb />}
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
        {...props}
      >
        <Column title="编号" key={1} dataIndex="coding" render={(value, record) => {
          return <Button type="link" onClick={() => {
            documentRef.current.action(null, record.purchaseAskId, DocumentEnums.purchaseAsk);
          }}>{value}</Button>;
        }} />
        <Column key={2} title="申请类型" dataIndex="type" render={(value) => {
          switch (value) {
            case '0':
              return '生产采购';
            case '1':
              return '库存采购';
            case '2':
              return '行政采购';
            case '3':
              return '销售采购';
            case '4':
              return '紧急采购';
            default:
              break;
          }
        }} />
        {!status && <Column key={3} title="申请状态" dataIndex="statusResult" render={(value) => {
          return <Render width={70}>{value && value.name}</Render>;
        }} />}
        <Column key={4} title="申请品类" width={100} align="center" dataIndex="applyType" />
        <Column key={5} title="申请数量" width={100} align="center" dataIndex="applyNumber" />
        {!status && <Column key={6} title="最后审批人" dataIndex="viewUpdate" render={(value) => {
          return <Render width={100}>{value && value.updateUser && value.updateUser.name}</Render>;
        }} />}
        {!status && <Column key={7} title="最后审批时间" dataIndex="viewUpdate" render={(value) => {
          return <Render width={100}>{value && value.updateTime}</Render>;
        }} />}
        <Column key={8} title="申请人" render={(value, record) => {
          return <>
            {record.createUserName}
          </>;
        }} />
        <Column key={9} title="申请时间" dataIndex="createTime" />
        <Column />
        {!status &&
        <Column
          key={10}
          title="操作"
          fixed="right"
          width={250}
          align="center"
          dataIndex="purchaseAskId"
          render={(value) => {
            return <>
              <Button type="link">撤回</Button>
              <Button type="link" onClick={() => {
                documentRef.current.create(DocumentEnums.purchaseAsk, value);
              }}>编辑</Button>
              <Button type="link" onClick={() => {
                documentRef.current.action(null, value, DocumentEnums.purchaseAsk);
              }}>查看</Button>
            </>;
          }} />}
      </Table>


      <Documents ref={documentRef} onSuccess={() => {
        tableRef.current.submit();
      }} />
    </>
  );
};

export default PurchaseAskList;
