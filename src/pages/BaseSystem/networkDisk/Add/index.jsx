import React, {useState} from 'react';
import {Button, Divider, Form, Select, Space} from 'antd';
import AutoFocus from '@/components/AutoFocus';
import TranserUsers from '@/pages/BaseSystem/user/components/TranserUsers';
import Modal from '@/components/Modal';
import {useRequest} from '@/util/Request';
import {addUrl} from '@/pages/BaseSystem/networkDisk/url';

const Add = (
  {
    addSpaceRef,
    onSuccess
  }
) => {

  const {loading: addLoading, run: addRun} = useRequest(addUrl, {
    manual: true,
    onSuccess
  });

  const [spaceName, setSpaceName] = useState();

  const [userIds, setUserIds] = useState([]);

  const [type, setType] = useState([]);

  return <>
    <Modal
      width={600}
      headTitle="添加空间"
      ref={addSpaceRef}
      footer={<Space>
        <Button onClick={() => {
          addSpaceRef.current.close();
        }}>取消</Button>
        <Button loading={addLoading} type="primary" onClick={() => {
          addRun({
            data: {
              userIds,
              spaceName,
              type
            }
          });
        }}>确认</Button>
      </Space>}
    >
      <div style={{padding: '16px 32px'}}>
        <Form
          labelCol={{
            span: 4,
          }}
        >
          <Form.Item label="类型" name="type">
            <Select
              options={[
                {value: 'order', label: '订单'},
                {value: 'paymentRecord', label: '付款'},
                {value: 'invoiceBill', label: '发票'}
              ]}
              placeholder="请选择空间类型"
              onChange={setType}
            />
          </Form.Item>
          <Form.Item label="空间名" name="spaceName">
            <AutoFocus placeholder="请输入空间名" onChange={setSpaceName} />
          </Form.Item>
          <Form.Item label="设置权限" name="userIds">
            <TranserUsers onChange={setUserIds} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  </>;
};

export default Add;
