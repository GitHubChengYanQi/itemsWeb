import React, {useEffect, useState} from 'react';
import {message, Modal} from 'antd';
import {POSITIONS} from '@/components/Editor/components/Module';

const WindowOpenPosition = () => {

  const [visible, setVisible] = useState();

  const [editorRef, setEditorRef] = useState();

  useEffect(() => {
    window.OpenPosition = (editorRef) => {
      setEditorRef(editorRef);
      setVisible(true);
    };
  }, []);

  const [button, setButton] = useState('');

  const [table, setTable] = useState([]);

  const insertContent = (content) => {
    editorRef.insertContent(content);
  };

  const refresh = () => {
    setVisible(false);
    setButton(null);
  };

  const moduleOnoK = () => {
    let content = '';
    let valuetds = '';
    table.map((item) => {
      if (item.value) {
        valuetds += `<td>$\{{${item.value}}}</td>`;
      }
      return null;
    });
    switch (button) {
      case 'skuTable':
        content = `<table style="border-collapse: collapse;" border="1"><tr data-group="sku">${valuetds}</tr></table>`;
        insertContent(content);
        break;
      default:
        insertContent(`$\{${button}}`);
        break;
    }

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
        moduleOnoK();
        refresh();
      }}
      onCancel={() => {
        refresh();
      }}>

      <POSITIONS setButton={setButton} button={button} setTable={setTable} />
    </Modal>
  </>;

};

export default WindowOpenPosition;

