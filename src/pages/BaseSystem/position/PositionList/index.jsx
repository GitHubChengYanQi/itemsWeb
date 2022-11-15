import React, {useRef, useState} from 'react';
import {Table as AntTable} from 'antd';
import {positionDel, positionList} from '@/Config/ApiUrl/system/position';
import Table from '@/components/Table';
import Breadcrumb from '@/components/Breadcrumb';
import AddButton from '@/components/AddButton';
import * as SysField from '@/pages/Erp/brand/BrandField';
import DelButton from '@/components/DelButton';
import Form from '@/components/Form';
import EditButton from '@/components/EditButton';
import Drawer from '@/components/Drawer';
import PositionEdit from '@/pages/BaseSystem/position/PositionEdit';

const {Column} = AntTable;
const {FormItem} = Form;

const PositionList = () => {

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

  const searchForm = () => {
    return (
      <>
        <FormItem label="职位名称" name="brandName" component={SysField.BrandName} />
      </>
    );
  };

  const [ids, setIds] = useState([]);

  const footer = () => {
    /**
     * 批量删除例子，根据实际情况修改接口地址
     */
    return (<DelButton api={{
      // ...batchDelete
    }} onSuccess={() => {
      tableRef.current.refresh();
    }} value={ids}>批量删除</DelButton>);
  };

  return (
    <>
      <Table
        title={<Breadcrumb />}
        api={positionList}
        rowKey="positionId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
        footer={footer}
        onChange={(value) => {
          setIds(value);
        }}
      >
        <Column title="职位名称" dataIndex="name" width={120} />
        <Column title="职位编码" dataIndex="code" width={120} />
        <Column title="是否是主管" dataIndex="governor" width={120} render={(value) => {
          return value ? '是' : '否';
        }} />
        <Column title="备注" dataIndex="remark" width={200} />
        <Column title="创建时间" dataIndex="createTime" width={200} />
        <Column title="更新时间" dataIndex="updateTime" width={200} />
        <Column title="状态" dataIndex="status" width={200} />
        <Column />
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.positionId);
              }} />
              <DelButton api={positionDel} value={record.positionId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={100} />
      </Table>
      <Drawer width={800} title="职位" component={PositionEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
    </>
  );
};

export default PositionList;
