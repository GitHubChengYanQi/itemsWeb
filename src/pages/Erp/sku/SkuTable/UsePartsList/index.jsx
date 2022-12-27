import React, {useRef, useState} from 'react';
import {Button, Table} from 'antd';
import Render from '@/components/Render';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import Note from '@/components/Note';
import Modal from '@/components/Modal';
import PartsEdit from '@/pages/Erp/parts/PartsEdit';

const {Column} = Table;

const UsePartsList = ({value}) => {

  const refAdd = useRef();
  const formRef = useRef();

  const [bom, setBom] = useState();

  const [loading, setLoading] = useState();

  return <div style={{padding: 18}}>
    <Table
      dataSource={value.map(item => ({...item, children: null}))}
      rowKey="partsId"
      pagination={false}
    >
      <Column title="清单编号" key={1} dataIndex="skuResult" render={(value) => {
        return <Render text={value && value.standard} />;
      }} />
      <Column title="父件物料" key={1} dataIndex="skuResult" render={(value) => {
        return <Note maxWidth={400} value={SkuResultSkuJsons({skuResult: value})} />;
      }} />
      <Column title="版本号" key={1} dataIndex="name" render={(value) => {
        return <Render text={value} />;
      }} />
      <Column title="状态" key={2} dataIndex="number" align="center" render={(value) => {
        return <Render text="启用" />;
      }} />
      <Column title="创建人" key={4} dataIndex="userResult" render={(value) => {
        return <Render text={value?.name} />;
      }} />
      <Column title="创建时间" key={5} dataIndex="createTime" render={(value) => {
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
            refAdd.current.open(value);
          }}>详情</Button>;
        }} />
    </Table>

    <Modal
      width={1200}
      type={1}
      title="物料清单"
      bom={bom}
      loading={setLoading}
      compoentRef={formRef}
      component={PartsEdit}
      onClose={() => {
        setBom(null);
      }}
      onSuccess={() => {
        setBom(null);
        refAdd.current.close();
      }}
      ref={refAdd}
      footer={<>
        <Button type="primary" loading={loading} onClick={() => {
          formRef.current.submit();
        }}>保存</Button>
      </>}
    />
  </div>;
};

export default UsePartsList;
