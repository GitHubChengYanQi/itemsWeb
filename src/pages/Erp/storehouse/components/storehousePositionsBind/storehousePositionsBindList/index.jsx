/**
 * 库位绑定物料表列表页
 *
 * @author song
 * @Date 2022-01-20 11:15:05
 */

import React, {useRef} from 'react';
import {Button, Divider, Table as AntTable} from 'antd';
import {createFormActions} from '@formily/antd';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import Form from '@/components/Form';
import {storehousePositionsBindDelete, storehousePositionsBindList} from '../storehousePositionsBindUrl';
import StorehousePositionsBindEdit from '../storehousePositionsBindEdit';
import * as SysField from '../storehousePositionsBindField';
import Breadcrumb from '@/components/Breadcrumb';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const StorehousePositionsBindList = ({value}) => {
  const ref = useRef(null);
  const tableRef = useRef(null);

  const searchForm = () => {
    return (
      <div hidden>
        <FormItem label="库位id" name="positionId" value={value} component={SysField.PositionId} />
        <FormItem label="skuId" name="skuId" component={SysField.SkuId} />
        <FormItem label="排序" name="sort" component={SysField.Sort} />
        <FormItem label="供应商id" name="customerId" component={SysField.CustomerId} />
        <FormItem label="品牌id" name="brandId" component={SysField.BrandId} />
        <FormItem label="部门id" name="deptId" component={SysField.DeptId} />
        <FormItem label="创建者" name="createUser" component={SysField.CreateUser} />
        <FormItem label="修改者" name="updateUser" component={SysField.UpdateUser} />
        <FormItem label="创建时间" name="createTime" component={SysField.CreateTime} />
        <FormItem label="修改时间" name="updateTime" component={SysField.UpdateTime} />
        <FormItem label="状态" name="display" component={SysField.Display} />
      </div>
    );
  };

  return (
    <>
      <Divider orientation='right'>
        <AddButton onClick={() => {
          ref.current.open(false);
        }} />
      </Divider>
      <Table
        listHeader
        api={storehousePositionsBindList}
        headStyle={{display: 'none'}}
        cardHeaderStyle={{display: 'block'}}
        formActions={formActionsPublic}
        rowKey="bindId"
        noRowSelection
        bordered={false}
        bodyStyle={{padding: 0}}
        searchForm={searchForm}
        ref={tableRef}
      >
        <Column title="物料" dataIndex="skuResult" render={(value) => {
          return <SkuResultSkuJsons skuResult={value} />;
        }} />
        <Column
          fixed="right"
          title="操作"
          align="center"
          render={(value, record) => {
            return (
              <>
                <DelButton api={storehousePositionsBindDelete} value={record.bindId} onSuccess={() => {
                  tableRef.current.refresh();
                }} />
              </>
            );
          }} width={120} />
      </Table>

      <Drawer
        positionId={value}
        width={800}
        title="编辑"
        component={StorehousePositionsBindEdit}
        onSuccess={() => {
          tableRef.current.refresh();
          ref.current.close();
        }} ref={ref} />

    </>
  );
};

export default StorehousePositionsBindList;
