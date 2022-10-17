import React, {useRef} from 'react';
import {Button} from 'antd';

import {roleList} from '@/Config/ApiUrl/system/role';

import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import EditButton from "@/components/EditButton";
import MenuEdit from "@/pages/BaseSystem/menu/MenuEdit";
import Drawer from "@/components/Drawer";
import RoleEdit from "@/pages/BaseSystem/role/RoleEdit";
import RoleSet from "@/pages/BaseSystem/role/RoleSet";
import AddButton from "@/components/AddButton";
import Breadcrumb from '@/components/Breadcrumb';


const RoleList = () => {

  const tableRef = useRef(null);
  const ref = useRef(null);
  const refRoleSet = useRef(null);

  const columns = [
    {
      title: '名称',
      width: 200,
      dataIndex: 'name'
    },
    {
      title: '上级角色',
      width: 200,
      dataIndex: 'pName'
    },
    {
      title: '别名',
      width: 300,
      dataIndex: 'description'
    },
    {},
    {
      title: '操作',
      width: 360,
      align: 'right',
      render: (value, record) => {
        return (
          <>
            <Button
              type="dashed"
              className="button-left-margin"
              onClick={() => {
                refRoleSet.current.open(record.roleId);
              }}>权限配置</Button>
            <EditButton onClick={() => {
              ref.current.open(record.roleId);
            }}/>
          </>
        );
      }
    }
  ];

  return (
    <>
      <Table
        api={roleList}
        title={<Breadcrumb />}
        columns={columns}
        rowKey="roleId"
        actions={<>
          <AddButton onClick={() => {
            ref.current.open(false);
          }}/>
        </>}
        ref={tableRef}
      />
      <Drawer width={800} title="编辑角色" component={RoleEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref}/>
      <Drawer width={800} title="设置权限" component={RoleSet} onSuccess={() => {
        tableRef.current.refresh();
        refRoleSet.current.close();
      }} ref={refRoleSet}/>
    </>
  );
};

export default RoleList;
