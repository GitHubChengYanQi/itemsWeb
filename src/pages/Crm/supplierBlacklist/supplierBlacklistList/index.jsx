/**
 * 供应商黑名单列表页
 *
 * @author Captian_Jazz
 * @Date 2021-12-20 11:20:05
 */

import React, {useRef} from 'react';
import Table from '@/components/Table';
import {Button, Modal, Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {supplierBlacklistDelete, supplierBlacklistList} from '../supplierBlacklistUrl';
import SupplierBlacklistEdit from '../supplierBlacklistEdit';
import * as SysField from '../supplierBlacklistField';
import Breadcrumb from '@/components/Breadcrumb';
import {useRequest} from '@/util/Request';
import {createFormActions} from '@formily/antd';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const SupplierBlacklistList = () => {
  const tableRef = useRef(null);

  const {run} = useRequest(supplierBlacklistDelete,
    {
      manual: true,
      onSuccess: () => {
        tableRef.current.submit();
      }
    });

  const Remove = (record) => {
    Modal.confirm({
      content: '是否移出黑名单？',
      onOk: () => {
        run({
          data: {
            blackListId: record.blackListId
          }
        });
      }
    });
  };

  const searchForm = () => {
    return (
      <>
        <FormItem label="供应商名称" name="supplierName" component={SysField.SupplierId} />
      </>
    );
  };

  return (
    <>
      <Table
        contentHeight
        listHeader={false}
        cardHeaderStyle={{display:'none'}}
        api={supplierBlacklistList}
        formActions={formActionsPublic}
        rowKey="blackListId"
        searchForm={searchForm}
        ref={tableRef}
      >
        <Column title="供应商名称" dataIndex="customerResult" render={(value) => {
          return <>{value && value.customerName}</>;
        }} />
        <Column title="创建人" dataIndex="createUserName" />
        <Column title="创建时间" dataIndex="createTime" />
        <Column title="备注（原因）" dataIndex="remark" width={200} />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <Button type="link" onClick={() => {
                Remove(record);
              }}>移出黑名单</Button>
            </>
          );
        }} />
      </Table>
    </>
  );
};

export default SupplierBlacklistList;
