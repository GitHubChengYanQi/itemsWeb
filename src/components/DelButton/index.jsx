import React from 'react';
import {Button, message, Modal} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import {useRequest} from '@/util/Request';

const DelButton = ({
  onSuccess = () => {
  }, onCancel = () => {
  }, api, rowKey, value, children, icon,...props
}) => {


  if (!api) {
    api = {};
    console.warn('DelButton Component: api cannot be empty,But now it doesn\'t exist!');
  }

  if (!rowKey) {
    rowKey = api.rowKey || 'id';
  }

  const {run} = useRequest(api, {
    manual: true,
    onError(err){
      message.error(err.message);
    }
  });

  const onClick = () => {
    Modal.confirm({
      title: '提示',
      content: '删除后不可恢复，是否确认删除？',
      confirmLoading: true,
      onOk: async () => {
        const params = {};
        params[rowKey] = value;
        try {
          await run({
            data: api.method==='POST' && params,
            params: api.method==='GET' && params,
          });
          onSuccess();
          return new Promise((resolve, reject) => {
            resolve();
          });
        } catch (e) {
          return new Promise((resolve, reject) => {
            reject(new Error(e.message));
          });
        }
      },
      onCancel: () => {
        onCancel();
      }
    });
  };

  return (
    <Button
      size="small" danger onClick={onClick}  icon={icon || <DeleteOutlined />}
      type="text" {...props} >{children}</Button>
  );
};

export default DelButton;
