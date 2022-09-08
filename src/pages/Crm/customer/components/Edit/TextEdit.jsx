import React, {useState} from 'react';
import parse from 'html-react-parser';
import {Modal} from 'antd';
import Editor from '@/components/Editor';

const TextEdit = ({
  value,
  onChange = () => {
  }
}) => {

  const [visiable, setVisiable] = useState(false);
  const [change, setChange] = useState(value);

  return (
    <>
      <div
        style={{cursor: 'pointer'}}
        onClick={() => {
          setVisiable(true);
        }}>{change ? parse(change) : '未填写'}</div>
      <Modal
        destroyOnClose
        width={800}
        title='编辑'
        visible={visiable}
        onCancel={() => {
          setVisiable(false);
        }}
        onOk={() => {
          setVisiable(false);
        }}
      >
        <Editor value={change} onChange={(value) => {
          setChange(value);
          onChange(value);
        }} />
      </Modal>
    </>

  );
};
export default TextEdit;
