/**
 * 商机管理列表页
 *
 * @author
 * @Date 2021-07-23 10:06:12
 */

import React, {lazy, useEffect, useRef, useState} from 'react';
import Table from '@/components/Table';
import {Button, Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import Breadcrumb from '@/components/Breadcrumb';
import Modal2 from '@/components/Modal';
import {businessDelete, businessList, CustomerNameListSelect} from '@/pages/Crm/business/BusinessUrl';
import * as SysField from '@/pages/Crm/business/BusinessField';
import {useHistory} from 'ice';
import BusinessEdit from '@/pages/Crm/business/BusinessEdit';

const {Column} = AntTable;
const {FormItem} = Form;

const BusinessTable = (props) => {

  const {status,state} = props;


  const history = useHistory();

  const ref = useRef(null);
  const tableRef = useRef(null);

  const [search, setSearch] = useState(false);

  if (status!==undefined || state !==undefined){
    tableRef.current.formActions.setFieldValue('salesId', status?status[0] : '');
    tableRef.current.formActions.setFieldValue('originId', state?state[0]:'');
    tableRef.current.submit();
  }

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

    const formItem = () => {
      return (
        <>
          <FormItem label="客户名称" name="customerId" component={SysField.CustomerNameListSelect} />
          <FormItem label="负责人" name="person" component={SysField.PersonListSelect} />
          <FormItem label="立项日期" name="time" component={SysField.TimeListSelect2} />
        </>
      );
    };

    return (
      <>
        <FormItem label="商机名称" name="businessName" component={SysField.BusinessNameListSelect} />
        {search ? formItem() : null}
        <FormItem hidden name="originId" component={SysField.BusinessNameListSelect} />
        <FormItem hidden name="salesId"  component={SysField.BusinessNameListSelect} />
        <Button style={{marginRight: 20}} onClick={() => {
          if (search){
            setSearch(false);
          }else {
            setSearch(true);
          }

        }}>高级搜索</Button>
      </>
    );
  };

  return (
    <>
      <Table
        title={<Breadcrumb />}
        api={businessList}
        rowKey="businessId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="商机名称" dataIndex="businessName" sorter showSorterTooltip={false} sortDirections={['ascend', 'descend']} render={(text, record, index)=>{
          return (
            <Button type="link" onClick={()=>{
              history.push(`/CRM/business/${record.businessId}`);
            }}>{text}</Button>
          );
        }} />
        <Column title="客户名称" dataIndex="customerName"  sorter showSorterTooltip={false} sortDirections={['ascend', 'descend']} render={(value, record)=>{
          return (
            <div>
              {
                record.customer ? record.customer.customerName : null
              }
            </div>
          );
        }}/>
        <Column title="销售流程" dataIndex="salesId"  render={(value, record)=>{
          return (
            <div>
              {
                record.sales ? record.sales.name : null
              }
            </div>
          );
        }} />
        <Column title="机会来源" dataIndex="originName"  render={(value, record)=>{
          return (
            <div>
              {
                record.origin ? record.origin.originName : null
              }
            </div>
          );
        }} />
        <Column title="负责人" dataIndex="person"  render={(value, record)=>{
          return (
            <div>
              {
                record.user ? record.user.account : null
              }
            </div>
          );
        }}/>
        <Column title="立项日期" dataIndex="time"  sorter showSorterTooltip={false} defaultSortOrder='descend' sortDirections={['ascend', 'descend']} />
        <Column title="商机阶段" dataIndex="stage" sorter showSorterTooltip={false} sortDirections={['ascend', 'descend']}  />
        <Column title="商机金额" dataIndex="opportunityAmount" sorter showSorterTooltip  sortDirections={['ascend', 'descend']} />
        {/*<Column title="结单日期" dataIndex="statementTime"  sorter showSorterTooltip={false} defaultSortOrder='descend' sortDirections={['ascend', 'descend']} />*/}
        {/*<Column title="阶段变更时间" dataIndex="changeTime" sorter showSorterTooltip defaultSortOrder='descend' sortDirections={['ascend', 'descend']} />*/}
        {/*<Column title="阶段状态" dataIndex="state" sorter showSorterTooltip={false} sortDirections={['ascend', 'descend']} />*/}
        {/*<Column title="产品合计" dataIndex="totalProducts"  sorter showSorterTooltip={false} sortDirections={['ascend', 'descend']}   />*/}
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.businessId);
              }} />
              <DelButton api={businessDelete} value={record.businessId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={300} />
      </Table>
      <Modal2 width={1500}  title="编辑" component={BusinessEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default BusinessTable;


