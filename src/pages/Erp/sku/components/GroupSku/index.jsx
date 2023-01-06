import React, {useState} from 'react';
import {Input, Modal, Spin} from 'antd';
import {SearchOutlined, AppstoreOutlined} from '@ant-design/icons';
import styles from './index.module.less';
import {useRequest} from '@/util/Request';
import Icon from '@/components/Icon';
import {isArray} from '@/util/Tools';

export const generalList = {url: '/general/list', method: 'POST'};

const GroupSku = (
  {
    onChange = () => {

    }
  }
) => {

  const [open, setOpen] = useState(false);

  const [searchValue, setSearchValue] = useState('');

  const [groupList, setGroupList] = useState({});

  const {loading, run} = useRequest(generalList, {
    manual: true,
    debounceInterval: 300,
    onSuccess: (res) => {
      console.log(res);
      setGroupList(res || {});
    }
  });

  const [showValue, setShowValue] = useState('');

  return <>
    <Input
      value={showValue}
      placeholder="请输入关键字搜索"
      onFocus={() => {
        setOpen(true);
      }}
    />

    <Modal
      className={styles.searchModal}
      closable={false}
      maskClosable
      onCancel={() => setOpen(false)}
      footer={null}
      open={open}
      mask={false}
      destroyOnClose
    >
      <div className={styles.search}>
        <Input
          autoFocus
          value={searchValue}
          onChange={({target: {value}}) => {
            run({data: {keyvoid: value}});
            setSearchValue(value);
          }}
          prefix={<SearchOutlined />}
          size="large"
          placeholder="请输入关键字搜索" />
      </div>

      <div hidden={!searchValue} className={styles.searchValues}>
        <div className={styles.groupTitle}>
          物料
        </div>
        <div className={styles.valueItem} onClick={() => {
          setOpen(false);
          setShowValue(searchValue);
          onChange(searchValue, 'skuName');
        }}>
          <Icon type="icon-wuliaoguanli" style={{marginRight: 8}} /> 在物料中搜索关键词：{searchValue}
        </div>

        <Spin spinning={loading}>
          <div className={styles.groupTitle}>
            分类
          </div>
          {
            isArray(groupList.classListResults).map((item, index) => {
              const label = item.name;
              let newLabel = label;
              label.replace(searchValue, <span className={styles.searchValue}>{searchValue}</span>);
              if (label.indexOf(searchValue) !== -1) {
                const startValue = label.substring(0, label.indexOf(searchValue));
                const value = label.substring(label.indexOf(searchValue), label.indexOf(searchValue) + searchValue.length);
                const endValue = label.substring(label.indexOf(searchValue) + searchValue.length, label.length);
                newLabel = <>{startValue}<span className={styles.searchValue}>{value}</span>{endValue}</>;
              }
              return <div key={index} className={styles.valueItem} onClick={() => {
                setOpen(false);
                setShowValue(label);
                onChange(item.spuClassificationId, 'skuClass');
              }}>
                <AppstoreOutlined style={{marginRight: 8}} />{newLabel}
              </div>;
            })
          }


          <div className={styles.groupTitle}>
            清单
          </div>
          {
            [1, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3].map((item, index) => {
              return <div key={index} className={styles.valueItem}>
                <Icon type="icon-a-kehuliebiao2" style={{marginRight: 8}} />清单{index}
              </div>;
            })
          }
        < /Spin>
      </div>

    </Modal>
  </>;
};

export default GroupSku;
