/**
 * 客户地址表列表页
 *
 * @author
 * @Date 2021-07-23 10:06:11
 */

import React, {useEffect, useRef, useState} from 'react';
import {Button, Divider, Modal as AntModal, Table as AntTable} from 'antd';
import {createFormActions} from '@formily/antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import ProSkeleton from '@ant-design/pro-skeleton';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {adressDelete, adressList} from '@/pages/Crm/adress/AdressUrl';
import * as SysField from '@/pages/Crm/business/crmBusinessSalesProcess/crmBusinessSalesProcessField';
import AdressEdit from '@/pages/Crm/adress/AdressEdit';
import Table from '@/components/Table';
import {useRequest} from '@/util/Request';
import {customerEdit} from '@/pages/Crm/customer/CustomerUrl';
import Render from '@/components/Render';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const AdressList = (props) => {
  const {customer, refresh} = props;
  const ref = useRef(null);
  const tableRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const {run: editCustomer} = useRequest(customerEdit,
    {
      manual: true,
      onSuccess: () => {
        if (typeof refresh === 'function'){
          refresh();
        }
      }
    });

  const defaultAddress = (name, addressId) => {
    AntModal.confirm({
      title: `是否将[${name}]设为默认地址?`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        await editCustomer({
          data: {
            customerId: customer.customerId,
            defaultAddress: addressId
          }
        });
      },
    });
  };

  useEffect(() => {
    if (customer.defaultAddress) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1);
    }
  }, [customer.defaultAddress]);

  if (loading) {
    return <ProSkeleton />;
  }

  const searchForm = () => {
    return (
      <>
        <FormItem
          style={{display: 'none'}}
          value={customer && customer.customerId || ' '}
          name="customerId"
          component={SysField.SalesId}
        />
      </>
    );
  };

  return (
    <>
      <Divider orientation="right">
        <AddButton ghost onClick={() => {
          ref.current.open(false);
        }} />
      </Divider>
      <Table
        bordered={false}
        bodyStyle={{padding: 0}}
        headStyle={{display: 'none'}}
        api={adressList}
        formActions={formActionsPublic}
        rowKey="adressId"
        showSearchButton={false}
        searchForm={searchForm}
        ref={tableRef}
      >
        <Column title="省市区地址" dataIndex="region" render={(value, record) => {
          return (
            <>
              {record.regionResult && `${record.regionResult.countries}-${record.regionResult.province}-${record.regionResult.city}-${record.regionResult.area}`}
            </>
          );
        }} />
        <Column title="详细地址" dataIndex="detailLocation" render={(text) => <Render>{text}</Render>} />
        <Column title="定位地址" dataIndex="location" render={(text) => <Render>{text}</Render>} />
        <Column title="地址名称" dataIndex="addressName" render={(text) => <Render>{text}</Render>} />
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          const isDefaultAddress = customer && record.adressId === customer.defaultAddress;
          return (
            <>
              {customer && <Button disabled={isDefaultAddress} type="link" onClick={() => {
                defaultAddress(record.location, record.adressId);
              }}>{isDefaultAddress ? '已设为默认地址' : '设为默认地址'}</Button>}
              <EditButton onClick={() => {
                ref.current.open(record.adressId);
              }} />
              <DelButton api={adressDelete} value={record.adressId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={300} />
      </Table>
      <Drawer
        width={800}
        title="编辑"
        component={AdressEdit}
        customer={customer && customer.customerId}
        onSuccess={() => {
          tableRef.current.refresh();
          ref.current.close();
        }}
        ref={ref}
      />
    </>
  );
};

export default AdressList;
