import React from 'react';
import {Button, Modal} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';

const DeleteButton = ({
  disabled,
  onClick = () => {
  },
  icon,
  children,
  ...props
}) => {


  return <>
    <Button
      disabled={disabled}
      size="small"
      danger
      onClick={() => {
        Modal.confirm({
          title: '提示',
          content: '删除后不可恢复，是否确认删除？',
          confirmLoading: true,
          onOk: onClick,
        });
      }}
      icon={icon || <DeleteOutlined />}
      type="text" {...props}
    >
      {children}
    </Button>
  </>;
};

export default DeleteButton;
