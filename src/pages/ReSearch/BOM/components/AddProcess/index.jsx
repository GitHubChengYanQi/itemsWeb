import React, {useRef, useState} from 'react';
import {Button, Form, Space} from 'antd';
import SelectSku from '@/pages/Erp/sku/components/SelectSku';
import Modal from '@/components/Modal';
import SelectBOM from '../SelectBOM/index';

export const bomsByskuId = {
  url: '/parts/bomsByskuId',
  method: 'POST',
};

const AddProcess = ({value, onChange, onClose}) => {
  const ref = useRef(null);
  const [state,setState] = useState({});
  return <>
    <Form
      initialValues={value}
      labelCol={{span: 5}}
      wrapperCol={{span: 15}}
      onFinish={async (value) => {
        onChange(value);
      }}
      onValuesChange={(changedValues, values)=>{
        setState(values);
      }}
    >


      <Form.Item name="skuId" label="适用物料" rules={[{required: true, message: '请选择适用物料'}]}>
        <SelectSku/>
      </Form.Item>
      <Form.Item name="skuId" label="选择BOM" hidden={!state.skuId} rules={[{required: true, message: '请选择'}]}>
        <Button type='link'
          onClick={() => {
            ref.current.open(false);
          }}>请选择BOM</Button>
      </Form.Item>

      <Modal width={1000} headTitle='选择BOM' footer={[]} ref={ref}>
        <SelectBOM/>
      </Modal>

      <Form.Item wrapperCol={{offset: 8, span: 16}}>
        <Space>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <Button onClick={() => {
            onClose();
          }}>
            取消
          </Button>
        </Space>
      </Form.Item>
    </Form>
  </>;
};

export default AddProcess;
