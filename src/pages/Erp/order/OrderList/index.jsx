/**
 * 货单表列表页
 *
 * @author ta
 * @Date 2021-07-20 16:22:28
 */

import React, {useRef} from 'react';
import {Button, Space, Table as AntTable} from 'antd';
import Table from '@/components/Table';
import Form from '@/components/Form';
import Breadcrumb from '@/components/Breadcrumb';
import Modal from '@/components/Modal';
import './index.scss';
import {useBoolean} from 'ahooks';
import {FormButtonGroup, Submit} from '@formily/antd';
import {SearchOutlined} from '@ant-design/icons';
import Icon from '@/components/Icon';
import OrderEdit from '../OrderEdit';
import {orderList} from '../OrderUrl';
import * as SysField from '../OrderField';

const {Column} = AntTable;
const {FormItem} = Form;

const OrderList = (props) => {

  const {customerId} = props;

  const ref = useRef(null);
  const tableRef = useRef(null);
  const orderDetailRef = useRef(null);

  const [search, {toggle}] = useBoolean(false);

  const searchForm = () => {

    const formItem = () => {
      return (
        <>
          <FormItem mega-props={{span: 1}} placeholder="货单状态" name="state" component={SysField.State} />
          {
            customerId ?
              null
              :
              <FormItem
                mega-props={{span: 1}}
                placeholder="客户名称"
                value={customerId || null}
                name="customerId"
                component={SysField.CustomerListSelect}
              />
          }
        </>
      );
    };

    return (
      <Space wrap>
        <FormItem mega-props={{span: 1}} placeholder="合同名称" name="contractName" component={SysField.contractName} />
        {search ? formItem() : null}
      </Space>
    );
  };


  const Search = () => {
    return (
      <>
        <FormButtonGroup>
          <Submit><SearchOutlined />查询</Submit>
          <Button type="link" title={search ? '收起高级搜索' : '展开高级搜索'} onClick={() => {
            toggle();
          }}>
            <Icon type={search ? 'icon-shouqi' : 'icon-gaojisousuo'} />{search ? '收起' : '高级'}</Button>
          <MegaLayout inline>
            {
              customerId ?
                <FormItem mega-props={{span: 1}} placeholder="客户名称" hidden value={customerId || ' '} name="partyA"
                          component={SysField.CustomerListSelect} /> : null
            }
          </MegaLayout>
        </FormButtonGroup>

      </>
    );
  };

  return (
    <>
      <Table
        title={<Breadcrumb />}
        api={orderList}
        rowKey="orderId"
        isModal={false}
        SearchButton={Search()}
        layout={search}
        searchForm={searchForm}
        ref={tableRef}
      >
        <Column title="合同名称" fixed dataIndex="contractName" render={(value, record) => {
          return (
            <Button type="link" onClick={() => {
              orderDetailRef.current.open(record.orderId);
            }}>{record.contractName}</Button>
          );
        }} sorter />
        <Column title="甲方" width={120} dataIndex="partyA" render={(value, record) => {
          return (
            <div>
              {
                record.partA ? record.partA.customerName : ''
              }
            </div>
          );
        }} sorter />
        <Column title="甲方联系人" width={120} dataIndex="partyAContactsId" render={(value, record) => {
          return (
            <div>
              {
                record.partyAContacts ? record.partyAContacts.contactsName : ''
              }
            </div>
          );
        }} sorter />
        <Column title="甲方联系地址" width={200} dataIndex="partyAAdressId" render={(value, record) => {
          return (
            <div>
              {
                record.partyAAdress ? record.partyAAdress.location : ''
              }
            </div>
          );
        }} sorter />
        <Column title="甲方联系人电话" width={150} dataIndex="partyAPhone" render={(value, record) => {
          return (
            <div>
              {
                record.phoneA ? record.phoneA.phoneNumber : ''
              }
            </div>
          );
        }} sorter />
        <Column title="乙方" width={120} dataIndex="partyB" render={(value, record) => {
          return (
            <div>
              {
                record.partB ? record.partB.customerName : ''
              }
            </div>
          );
        }} sorter />
        <Column title="乙方联系人" width={120} dataIndex="partyBContactsId" render={(value, record) => {
          return (
            <div>
              {
                record.partyBContacts ? record.partyBContacts.contactsName : ''
              }
            </div>
          );
        }} sorter />
        <Column title="乙方联系地址" width={200} dataIndex="partyBAdressId" render={(value, record) => {
          return (
            <div>
              {
                record.partyBAdress ? record.partyBAdress.location : ''
              }
            </div>
          );
        }} sorter />
        <Column title="乙方联系人电话" width={150} dataIndex="partyBPhone" render={(value, record) => {
          return (
            <div>
              {
                record.phoneB ? record.phoneB.phoneNumber : ''
              }
            </div>
          );
        }} sorter />
        <Column title="货单状态" width={120} align="center" dataIndex="state" sorter />
        <Column title="货单时间" width={200} dataIndex="orderTime" sorter />
      </Table>
      <Modal width={1200} title="货单" component={OrderEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
      <Modal width={1200} title="货单明细" component={OrderDetailsList} onSuccess={() => {
        orderDetailRef.current.refresh();
        ref.current.close();
      }} ref={orderDetailRef} />
    </>
  );
};

export default OrderList;
