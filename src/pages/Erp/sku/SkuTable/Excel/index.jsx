import React, {useRef, useState} from 'react';
import {Button, Checkbox, Space} from 'antd';
import {config} from 'ice';
import cookie from 'js-cookie';
import styles from './index.module.less';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal';

const Excel = (
  {
    excelUrl,
    title,
    fileds = []
  }
) => {

  const {baseURI} = config;
  const token = cookie.get('tianpeng-token');

  const ref = useRef();

  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const onChange = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < fileds.length);
    setCheckAll(list.length === fileds.length);
  };
  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? fileds.map(item => item.key) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  return <>
    <Button
      type="link"
      style={{padding: 0}}
      icon={<Icon type="icon-daoru" />}
      onClick={() => {
        setIndeterminate(false);
        setCheckAll(false);
        setCheckedList([]);
        ref.current.open(false);
      }}
    >
      {title || '导出'}
    </Button>


    <Modal
      headTitle="请选择导出字段"
      ref={ref}
      width={600}
      footer={<Space>
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          {checkAll ? '取消全选' : '全选'}
        </Checkbox>
        <Button onClick={() => ref.current.close()}>取消</Button>
        <Button type="primary" onClick={() => {
          window.open(`${baseURI}${excelUrl}?authorization=${token}`);
        }}>导出</Button>
      </Space>}
      onClose={() => ref.current.close()}
    >
      <div style={{padding: 24}}>
        <Checkbox.Group value={checkedList} onChange={onChange}>
          <div className={styles.row}>
            {
              fileds.map((item, index) => {
                const array = item || [];
                return <div key={index} className={styles.col}>
                  {
                    array.map((item, index) => {
                      return <Checkbox key={index} value={item.key}>{item.filedName}</Checkbox>;
                    })
                  }
                </div>;
              })
            }
          </div>
        </Checkbox.Group>
      </div>
    </Modal>
  </>;
};

export default Excel;
