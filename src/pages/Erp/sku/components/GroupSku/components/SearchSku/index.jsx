import React, {useEffect, useRef} from 'react';
import {Input, Spin} from 'antd';
import {AppstoreOutlined, SearchOutlined} from '@ant-design/icons';
import styles from '@/pages/Erp/sku/components/GroupSku/index.module.less';
import Icon from '@/components/Icon';
import {isArray} from '@/util/Tools';

const SearchSku = (
  {
    searchValue,
    run,
    setSearchValue,
    setOpen,
    setSearchType,
    setShowValue,
    onChange,
    loading,
    groupList,
    noParts,
  }
) => {

  const inputRef = useRef();

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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <div>
    <Input
      ref={inputRef}
      allowClear
      value={searchValue}
      onChange={({target: {value}}) => {
        run({data: {keyWord: value}});
        setSearchValue(value);
      }}
      prefix={<SearchOutlined />}
      size="large"
      placeholder="请输入关键字搜索"
    />

    <div hidden={!searchValue} className={styles.searchValues}>
      <div className={styles.groupTitle}>
        物料
      </div>
      <div className={styles.valueItem} onClick={() => {
        setOpen(false);
        setSearchType('');
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
              setSearchType('skuClass');
              onChange(item.spuClassificationId, 'skuClass');
            }}>
              <AppstoreOutlined style={{marginRight: 16}} />
              <div>
                {format(label)}
              </div>
            </div>;
          })
        }


        <div className={styles.groupTitle} hidden={isArray(groupList.bomListResults).length === 0 || noParts}>
          清单
        </div>
        <div hidden={noParts}>
          {
            isArray(groupList.bomListResults).map((item, index) => {
              const label = `${item.standard} ${item.standard && '/'} ${item.spuName} ${item.spuName && item.skuName && '/'} ${item.skuName}`;
              return <div key={index} className={styles.valueItem} onClick={() => {
                setOpen(false);
                setShowValue(label);
                setSearchType('parts');
                onChange(item.partsId, 'parts', {skuId: item.skuId});
              }}>
                <Icon type="icon-a-kehuliebiao2" style={{marginRight: 16}} />
                <div>
                  版本号：{item.version ? format(item.version) : '-'}
                  <br />
                  {format(label)}
                </div>

              </div>;
            })
          }
        </div>

      < /Spin>
    </div>

  </div>;
};

export default SearchSku;
