import React, {useEffect, useState} from 'react';
import {message, Modal} from 'antd';
import {PHYSICALDETAIL, SKUDETAIL} from '@/components/Editor/components/Module';

const WindowOpenSku = () => {

  const [visible, setVisible] = useState();

  const [editorRef, setEditorRef] = useState();

  useEffect(() => {
    window.OpenSku = (editorRef) => {
      setEditorRef(editorRef);
      setVisible(true);
    };
  }, []);

  const [button, setButton] = useState('');

  const insertContent = (content) => {
    editorRef.insertContent(content);
  };

  const refresh = () => {
    setVisible(false);
    setButton(null);
  };

  return <>

    <Modal
      title="插入变量"
      destroyOnClose
      width={800}
      open={visible}
      onOk={() => {
        if (!button) {
          return message.warn('请选择变量！');
        }
        insertContent(`$\{{${button}}}`);
        refresh();
      }}
      onCancel={() => {
        refresh();
      }}>

      <SKUDETAIL setButton={setButton} button={button} />
    </Modal>
  </>;

};

export default WindowOpenSku;

