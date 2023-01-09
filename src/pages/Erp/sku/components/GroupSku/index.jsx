import React, {useImperativeHandle, useState} from 'react';
import {Button, Input, Modal, Space, Spin} from 'antd';
import {SearchOutlined, AppstoreOutlined} from '@ant-design/icons';
import styles from './index.module.less';
import {useRequest} from '@/util/Request';
import Icon from '@/components/Icon';
import {isArray} from '@/util/Tools';

export const generalList = {url: '/general/list', method: 'POST'};

const GroupSku = (
  {
    onChange = () => {

    },
    noParts,
    noSearchButton,
    width = 300,
    align,
  },
  ref
) => {

  const [open, setOpen] = useState(false);

  const [searchValue, setSearchValue] = useState('');

  const [groupList, setGroupList] = useState({});

  const {loading, run} = useRequest(generalList, {
    manual: true,
    debounceInterval: 300,
    onSuccess: (res) => {
      setGroupList(res || {});
    }
  });

  const [showValue, setShowValue] = useState('');

  const format = (label) => {
    let newLabel = label;
    const lowerCaseLabel = label.toLowerCase();
    const lowerCaseValue = searchValue.toLowerCase();
    if (lowerCaseLabel.indexOf(lowerCaseValue) !== -1) {
      const startValue = label.substring(0, lowerCaseLabel.indexOf(lowerCaseValue));
      const value = label.substring(lowerCaseLabel.indexOf(lowerCaseValue), lowerCaseLabel.indexOf(lowerCaseValue) + lowerCaseValue.length);
      const endValue = label.substring(lowerCaseLabel.indexOf(lowerCaseValue) + lowerCaseValue.length, lowerCaseLabel.length);
      newLabel = <>{startValue}<span className={styles.searchValue}>{value}</span>{endValue}</>;
    }
    return newLabel;
  };

  const reset = () => {
    setShowValue('');
  };

  useImperativeHandle(ref, () => ({
    reset
  }));

  return <>
    <Space size={16} align={align}>
      <Input
        style={{width}}
        value={showValue}
        placeholder="请输入关键字搜索"
        onFocus={() => {
          run({data: {keyWord: showValue}});
          setSearchValue(showValue);
          setOpen(true);
        }}
      />
      <div hidden={noSearchButton}>
        <Button
          type="primary"
          onClick={() => {
            run({data: {keyWord: showValue}});
            setSearchValue(showValue);
            setOpen(true);
          }}><SearchOutlined />查询
        </Button>
      </div>

      <div hidden={noSearchButton}>
        <Button
          onClick={() => {
            setShowValue('');
            onChange('', 'reset');
          }}>
          重置
        </Button>
      </div>

    </Space>


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
          allowClear
          autoFocus
          value={searchValue}
          onChange={({target: {value}}) => {
            run({data: {keyWord: value}});
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
          <Icon type="icon-wuliaoguanli" style={{marginRight: 8}} />
          在物料中搜索关键词：<span className={styles.searchValue}>{searchValue}</span>
        </div>

        <Spin spinning={loading}>
          <div className={styles.groupTitle} hidden={isArray(groupList.classListResults).length === 0}>
            分类
          </div>
          {
            isArray(groupList.classListResults).map((item, index) => {
              const label = item.name;
              return <div key={index} className={styles.valueItem} onClick={() => {
                setOpen(false);
                setShowValue(label);
                onChange(item.spuClassificationId, 'skuClass');
              }}>
                <AppstoreOutlined style={{marginRight: 8}} />{format(label)}
              </div>;
            })
          }


          <div className={styles.groupTitle} hidden={isArray(groupList.bomListResults).length === 0 || noParts}>
            清单
          </div>
          <div hidden={noParts}>
            {
              isArray(groupList.bomListResults).map((item, index) => {
                const label = `${item.standard} / ${item.spuName} / ${item.skuName}`;
                return <div key={index} className={styles.valueItem} onClick={() => {
                  setOpen(false);
                  setShowValue(label);
                  onChange(item.partsId, 'parts', {skuId: item.skuId});
                }}>
                  <Icon type="icon-a-kehuliebiao2" style={{marginRight: 8}} />{format(label)}
                </div>;
              })
            }
          </div>

        < /Spin>
      </div>

    </Modal>
  </>;
};

export default React.forwardRef(GroupSku);
