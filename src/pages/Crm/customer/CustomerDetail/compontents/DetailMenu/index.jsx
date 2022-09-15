import {Button, Dropdown, Input, Menu, Modal, Modal as AntModal, notification, Space} from 'antd';
import React, {useState} from 'react';
import {useHistory} from 'ice';
import {useRequest} from '@/util/Request';
import {supplierBlacklistAdd} from '@/pages/Crm/supplierBlacklist/supplierBlacklistUrl';
import SopEdit from '@/pages/ReSearch/sop/sopEdit';

const DetailMenu = ({data, deletaApi, url, refresh, type, supply,}) => {
  const history = useHistory();

  const [visible, setVisible] = useState();

  const [note, setNote] = useState();

  const openNotificationWithIcon = (status, supplierBlack) => {
    let message = '';
    switch (status) {
      case 'success':
        message = supplierBlack ? '已加入黑名单!' : '已删除！';
        break;
      case 'error':
        message = supplierBlack ? '加入黑名单失败！' : '删除失败！';
        break;
      default:
        break;
    }
    notification[status]({
      message,
    });
    if (status === 'success') {
      history.push(url);
    }
  };

  const {run} = useRequest(deletaApi, {
    manual: true, onSuccess: () => {
      openNotificationWithIcon('success');
    },
    onError: () => {
      openNotificationWithIcon('error');
    }
  });

  const {run: supplierBlack} = useRequest(supplierBlacklistAdd, {
    manual: true, onSuccess: () => {
      openNotificationWithIcon('success', supplierBlack);
    },
    onError: () => {
      openNotificationWithIcon('error', supplierBlack);
    }
  });


  const deleteCustomer = () => {
    AntModal.confirm({
      title: '温馨提示',
      centered: true,
      content: '删除后不可恢复，是否确认删除？',
      style: {margin: 'auto'},
      cancelText: '取消',
      onOk: async () => {
        await run({
          data: {
            ...data
          }
        });
      }
    });
  };

  const module = () => {
    const menuItems = [];
    switch (type) {
      case 'customer':
        if (supply) {
          menuItems.push({key: '2', label: '加入黑名单', onClick: () => setVisible(true)});
        }
        return [...menuItems, {key: 'delete', label: '删除', onClick: () => deleteCustomer()}];
      case 'bussiness':
        return [{key: 'delete', label: '删除', onClick: () => deleteCustomer()}];
      case 'sop':
        return [{key: 'edit', label: '编辑'}];
      default:
        break;
    }
  };

  return (
    <>
      <Dropdown trigger="click" placement="bottom" overlay={
        <Menu items={module()} />
      }>
        <Button type="text">
          管理
        </Button>
      </Dropdown>


      <Modal
        title={`确定要将【 ${data.customerName} 】拉入黑名单吗？`}
        open={visible}
        footer={[
          <Button
            type="primary"
            danger
            key={1}
            onClick={() => {
              supplierBlack({
                data: {
                  supplierId: data.customerId,
                  remark: note
                }
              });
            }}>拉入黑名单</Button>
        ]}
        onCancel={() => {
          setVisible(false);
        }}>

        <Space direction="vertical" style={{width: '100%'}}>
          <Input maxLength={20} style={{width: '100%'}} placeholder="请输入备注..." onChange={(value) => {
            setNote(value.target.value);
          }} />
        </Space>
      </Modal>
    </>
  );
};
export default DetailMenu;
