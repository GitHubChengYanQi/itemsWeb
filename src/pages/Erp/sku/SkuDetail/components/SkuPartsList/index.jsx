/**
 * 清单列表页
 *
 * @author
 * @Date 2021-07-14 14:30:20
 */

import React, {useRef, useState} from 'react';
import {Button, Input} from 'antd';
import {createFormActions} from '@formily/antd';
import Breadcrumb from '@/components/Breadcrumb';
import Modal from '@/components/Modal';
import EditButton from '@/components/EditButton';
import AddButton from '@/components/AddButton';
import PartsEdit from '@/pages/Erp/parts/PartsEdit';
import Table from '@/components/Table';
import Form from '@/components/Form';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import ShowBOM from '@/pages/Erp/parts/components/ShowBOM';
import Drawer from '@/components/Drawer';
import {partsList} from '@/pages/Erp/parts/PartsUrl';
import Render from '@/components/Render';

const {Column} = Table;
const {FormItem} = Form;

const SkuPartsList = ({
  spuId,
  spuSkuId,
  value,
  getPartsId = () => {
  },
  type = 1
}) => {

  const [formActionsPublic] = useState(createFormActions);

  const refAdd = useRef();
  const formRef = useRef();
  const tableRef = useRef();
  const showRef = useRef();

  const [loading, setLoading] = useState();


  const [bom, setBom] = useState();

  const action = () => {
    return (
      <AddButton name="创建物料清单" onClick={() => {
        refAdd.current.open(false);
      }} />
    );
  };

  const searchForm = () => {

    return (
      <>
        <FormItem
          hidden
          name="children"
          value={value || null}
          component={Input} />
        <FormItem
          hidden
          name="status"
          value={99}
          component={Input} />
      </>
    );
  };

  return (
    <>
      <Table
        bodyStyle={{padding: 0}}
        bordered={false}
        cardHeaderStyle={{display: value === false && 'none'}}
        listHeader={value}
        formActions={formActionsPublic}
        headStyle={{display: 'none'}}
        title={value !== false && <Breadcrumb title="物料清单" />}
        actions={action()}
        searchForm={searchForm}
        ref={tableRef}
        contentHeight
        noRowSelection
        api={partsList}
        rowKey="partsId"
      >
        <Column title="清单编号" key={1} dataIndex="skuResult" render={(value) => {
          return <Render text={value && value.standard} />;
        }} />
        <Column title="父件物料" key={1} dataIndex="skuResult" render={(value) => {
          return <Render maxWidth={400} text={<SkuResultSkuJsons skuResult={value} />} />;
        }} />
        <Column title="版本号" key={1} dataIndex="name" render={(value) => {
          return <Render text={value} />;
        }} />
        <Column title="配套数量" key={2} dataIndex="bomNum" align="center" render={(value) => {
          return <Render>{value || 0}</Render>;
        }} />
        <Column title="状态" key={2} dataIndex="number" align="center" render={(value) => {
          return <Render text="启用" />;
        }} />
        <Column title="创建人" key={4} dataIndex="userResult" render={(value) => {
          return <Render text={value?.name} />;
        }} />
        <Column title="创建时间" key={5} visible={spuSkuId && false} dataIndex="createTime" render={(value) => {
          return <Render text={value} />;
        }} />
        <Column title="备注" key={3} dataIndex="note" render={(value) => {
          return <Render text={value} />;
        }} />

        <Column
          title="操作"
          key={99}
          fixed="right"
          align="center"
          dataIndex="partsId"
          width={150}
          render={(value) => {
            return <Button type="link" onClick={() => {
              showRef.current.open(value);
            }}>详情</Button>;
          }} />
      </Table>

      <Modal
        width={1200}
        type={type}
        headTitle="创建物料清单"
        bom={bom}
        loading={setLoading}
        compoentRef={formRef}
        component={PartsEdit}
        onClose={() => {
          setBom(null);
        }}
        onSuccess={() => {
          if (bom && bom.type) {
            tableRef.current.formActions.setFieldValue('type', bom.type);
          }
          setBom(null);
          tableRef.current.submit();
          refAdd.current.close();
        }}
        ref={refAdd}
        spuId={spuId}
        footer={<>
          <Button type="primary" loading={loading} onClick={() => {
            formRef.current.submit();
          }}>保存</Button>
        </>}
      />

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

export default SkuPartsList;
