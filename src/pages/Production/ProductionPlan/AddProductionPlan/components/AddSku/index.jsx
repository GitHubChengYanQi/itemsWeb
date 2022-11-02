import React, {useRef} from 'react';
import {Button, Space} from 'antd';
import Modal from '@/components/Modal';
import CheckSku from '@/pages/Erp/sku/components/CheckSku';
import AddSkuTable from '@/pages/Production/ProductionPlan/AddProductionPlan/components/AddSkuTable';

const AddSku = ({value = [], onChange}) => {

  const ref = useRef();

  const addSkuRef = useRef();
  console.log(value);

  return (<>

    <AddSkuTable
      footer={<Button onClick={() => {
        ref.current.open(true);
      }}>批量添加物料</Button>}
      value={value}
      onChange={onChange}
    />

    <Modal
      ref={ref}
      headTitle="添加物料"
      width={1100}
      footer={<Space>
        <Button onClick={() => {
          onChange(addSkuRef.current.check());
        }}>选中</Button>
        <Button type="primary" onClick={() => {
          onChange(addSkuRef.current.change());
          ref.current.close();
        }}>选中并关闭</Button>
      </Space>}
    >
      <CheckSku
        value={value}
        ref={addSkuRef}
      />
    </Modal>
  </>);
};

export default AddSku;
