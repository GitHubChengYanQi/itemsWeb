import React, {useEffect, useState} from 'react';
import {message, Modal} from 'antd';
import {PHYSICALDETAIL} from '@/components/Editor/components/Module';

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
      visible={visible}
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

      <PHYSICALDETAIL setButton={setButton} button={button} />
    </Modal>
  </>;

};

export default WindowOpenSku;

