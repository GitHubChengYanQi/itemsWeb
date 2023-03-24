import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {Modal as AntdModal} from 'antd';
import Draggable from 'react-draggable';
import styles from './index.module.less';

const Modal = (
  {
    title,
    modal,
    component: Component,
    width,
    headTitle,
    overflowY,
    loading = () => {
    },
    footer,
    closable = true,
    padding,
    onSuccess = () => {
    },
    onClose = () => {
    },
    compoentRef,
    children,
    wrapClassName = '',
    ...props
  }, ref) => {

  const [value, show] = useState(null);

  const [disabled, setDisabled] = useState(true);

  if (modal !== undefined) {
    show(false);
  }

  const open = (value) => {
    show(value);
  };

  const close = () => {
    show(null);
  };

  useImperativeHandle(ref, () => ({
    open,
    close
  }));


  const visible = value !== null && value !== undefined;

  const draggleRef = useRef(null);

  return (
    <AntdModal
      open={visible}
      footer={footer || null}
      centered
      closable={closable}
      maskClosable={false}
      onCancel={() => {
        show(null);
        onClose();
      }}
      bodyStyle={{padding: 0}}
      width={width}
      title={<div
        style={{
          width: '100%',
          cursor: 'move',
        }}
        onMouseOver={() => {
          if (disabled) {
            setDisabled(false);
          }
        }}
        onMouseOut={() => {
          setDisabled(true);
        }}
      >
        {headTitle || (title && (value ? `编辑${title}` : `添加${title}`))}
      </div>}
      destroyOnClose
      modalRender={(modal) => (
        <Draggable disabled={disabled}>
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
    >
      <div style={{
        maxHeight: footer ? 'calc(100vh - 130px)' : 'calc(100vh - 55px)',
        overflow: 'hidden auto',
      }}>
        {Component ? <Component
          {...props}
          ref={compoentRef}
          value={value}
          loading={(load) => {
            loading(load);
          }}
          onSuccess={(response, action) => {
            onSuccess(response, action);
          }}
          onError={() => {
          }}
        /> : children}
      </div>
    </AntdModal>
  );
};


export default forwardRef(Modal);
