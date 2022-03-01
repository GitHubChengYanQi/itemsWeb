/**
 * 清单列表页
 *
 * @author
 * @Date 2021-07-14 14:30:20
 */

import React, {useRef, useState} from 'react';
import {Button, Dropdown, Menu, Space} from 'antd';
import ProCard from '@ant-design/pro-card';
import {DownOutlined} from '@ant-design/icons';
import {partsList, partsRelease} from '../PartsUrl';
import Breadcrumb from '@/components/Breadcrumb';
import Modal from '@/components/Modal';
import EditButton from '@/components/EditButton';
import AddButton from '@/components/AddButton';
import PartsOldList from '@/pages/Erp/parts/components/PartsOldList';
import PartsEdit from '@/pages/Erp/parts/PartsEdit';
import Table from '@/components/Table';
import * as SysField from '../PartsField';
import Form from '@/components/Form';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import {useRequest} from '@/util/Request';
import ShowBOM from '@/pages/Erp/parts/components/ShowBOM';
import Drawer from '@/components/Drawer';
import {createFormActions} from '@formily/antd';

const {Column} = Table;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const PartsList = ({spuId, value, type = 1, category}) => {

  const refAdd = useRef();
  const formRef = useRef();
  const tableRef = useRef();
  const showRef = useRef();

  const [bom, setBom] = useState();

  const refOldList = useRef();

  const {run} = useRequest(partsRelease, {
    manual: true, onSuccess: () => {
      tableRef.current.submit();
    }
  });

  const action = () => {
    return (
      <AddButton onClick={() => {
        refAdd.current.open(false);
      }} />
    );
  };

  const searchForm = () => {

    return (
      <>
        <FormItem
          label="物料"
          placeholder="请选择物料"
          name="skuId"
          value={value}
          component={SysField.SkuId} />
        <FormItem
          hidden
          placeholder="请选择物料"
          name="spuId"
          value={spuId}
          component={SysField.PartName} />
        <FormItem
          hidden
          placeholder="请选择物料"
          name="type"
          value={type}
          component={SysField.PartName} />
      </>
    );
  };

  const menu = (record) => {

    return <Menu
      onClick={({key}) => {
        switch (key) {
          case '1':
            setBom({add: true, copy: false});
            break;
          case '2':
            setBom({add: false, copy: true});
            break;
          default:
            break;
        }
        refAdd.current.open(record.partsId);
      }}>
      <Menu.Item key={1}>
        <Button type="link">
          新建
        </Button>
      </Menu.Item>
      <Menu.Item key={2}>
        <Button type="link">
          拷贝
        </Button>
      </Menu.Item>
    </Menu>;
  };

  const table = () => {
    return <Table
      formActions={formActionsPublic}
      headStyle={{display: (spuId || value) && 'none'}}
      title={<Breadcrumb title="物料清单" />}
      actions={action()}
      contentHeight
      noRowSelection
      api={partsList}
      rowKey="partsId"
      tableKey="parts"
      searchForm={searchForm}
      ref={tableRef}
    >
      <Column title="物料" key={1} dataIndex="skuId" render={(value, record) => {
        return (<Button type="link" onClick={async () => {
          // history.push(`/SPU/parts/show?id=${record.partsId}&type=${type}`);
          showRef.current.open(record.partsId);
        }}>
          <SkuResultSkuJsons skuResult={record.skuResult} />
        </Button>);
      }} />
      <Column title="名称" key={4} dataIndex="partName" />
      <Column title="类型" key={4} dataIndex="type" render={(value) => {
        switch (parseInt(value, 0)) {
          case 1:
            return '设计BOM';
          case 2:
            return '生产BOM';
          default:
            break;
        }
      }} />
      <Column title="创建时间" key={5} dataIndex="createTime" render={(value, record) => {
        return !record.partsDetailId && <>{value}</>;
      }} />
      <Column title="创建人" key={6} dataIndex="userResult" render={(value) => {
        return <>{value && value.name}</>;
      }} />

      <Column
        title="操作"
        key={7}
        fixed="right"
        align="center"
        dataIndex="partsId"
        width={200}
        render={(value, record) => {
          return <Space>
            <>
              {record.status !== 99 ?
                <Button type="link" onClick={() => {
                  run({
                    data: {
                      partsId: value,
                    }
                  });
                }}>发布</Button>
                :
                parseInt(record.type,0) === 1 && <Dropdown overlay={menu(record)}>
                  <Button type="link">
                    新建生产BOM<DownOutlined />
                  </Button>
                </Dropdown>
              }
              <EditButton onClick={() => {
                refAdd.current.open(value);
              }} />
              {/*<Button icon={<ClockCircleOutlined />} type="link" onClick={() => {*/}
              {/*  refOldList.current.open(record.skuId);*/}
              {/*}} />*/}
            </>
          </Space>;
        }} />
    </Table>;
  };

  return (
    <>
      {spuId ?
        <ProCard className="h2Card" title="清单列表" headerBordered extra={action()}>
          {table()}
        </ProCard>
        :
        table()
      }
      <Modal
        width={900}
        type={bom ? 2 : 1}
        title="清单"
        bom={bom}
        category={category}
        compoentRef={formRef}
        component={PartsEdit}
        onClose={() => {
          setBom(null);
        }}
        onSuccess={() => {
          setBom(null);
          tableRef.current.submit();
          refAdd.current.close();
        }}
        ref={refAdd}
        spuId={spuId}
        footer={<>
          <Button type="primary" onClick={() => {
            formRef.current.submit();
          }}>保存</Button>
        </>}
      />

      <Modal width={1200} title="清单" type={type} component={PartsOldList} onSuccess={() => {
        refOldList.current.close();
      }} ref={refOldList} spuId={spuId} />

      <Drawer
        extra
        height="100%"
        placement="top"
        headTitle="物料清单"
        width={1000}
        component={ShowBOM}
        ref={showRef}
      />

    </>
  );
};

export default PartsList;
