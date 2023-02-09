import React, {ReactNode} from 'react';
import {Modal} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';

interface Props {
  children: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}

const Warning: React.FC<Props> = (props) => {
  const {
    children,
    content,
    disabled,
    onOk = () => {
    },
    onCancel = () => {
    },
  } = props;

  return <div onClick={() => {
    if (disabled) {
      return;
    }
    Modal.confirm({
      zIndex: 1005,
      title: '提示信息',
      centered: true,
      icon: <ExclamationCircleOutlined />,
      content: content || '确定删除吗？',
      onOk,
      onCancel,
    });
  }}>{children}</div>;
};

export default Warning;
