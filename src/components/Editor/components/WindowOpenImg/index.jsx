import React, {useEffect, useState} from 'react';
import {Modal} from 'antd';
import CommonMediaList from '@/pages/Erp/commonMedia/commonMediaList';

const WindowOpenImg = () => {
  const [visible, setVisible] = useState();

  const [editorRef, setEditorRef] = useState();

  useEffect(() => {
    window.OpenImg = (editorRef) => {
      setEditorRef(editorRef);
      setVisible(true);
    };
  }, []);

  const insertContent = (content) => {
    editorRef.insertContent(content);
  };

  return <>
    <Modal
      title="插入图片"
      destroyOnClose
      width={630}
      open={visible}
      footer={null}
      onOk={() => {
        setVisible(false);
      }}
      onCancel={() => {
        setVisible(false);
      }}>
      <div style={{margin: 'auto'}}>
        <CommonMediaList getImg={(url) => {
          insertContent(`<img src=${url} alt=""/>`);
          setVisible(false);
        }} />
      </div>
    </Modal>
  </>;
};

export default WindowOpenImg;
