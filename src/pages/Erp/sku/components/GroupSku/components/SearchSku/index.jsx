import React, {useEffect, useRef} from 'react';
import {Input, Spin} from 'antd';
import {AppstoreOutlined, SearchOutlined, EnterOutlined, HistoryOutlined} from '@ant-design/icons';
import styles from '@/pages/Erp/sku/components/GroupSku/index.module.less';
import Icon from '@/components/Icon';
import {isArray} from '@/util/Tools';
import SearchValueFormat from '@/components/SearchValueFormat';
import {useRequest} from '@/util/Request';

const historyList = {url: '/queryLog/list', method: 'POST'};
const historyAdd = {url: '/queryLog/add', method: 'POST'};
const historyDeleteBatch = {url: '/queryLog/deleteBatch', method: 'POST'};
const historyDelete = {url: '/queryLog/delete', method: 'POST'};

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
    noSkuClass,
  }
) => {

  const formType = 'skuSearch';

  const inputRef = useRef();

  const {data: historyListData = [], refresh} = useRequest({
    ...historyList,
    data: {
      formType,
    },
    params: {
      page: 1,
      limit: 10
    }
  });


  const {run: addHistory} = useRequest(historyAdd, {
    manual: true,
    onSuccess: () => {
      refresh();
    },
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const searchSkuName = (value) => {
    const val = value || searchValue;
    setOpen(false);
    setSearchType('');
    setShowValue(val);
    onChange(val, 'skuName', val);
    !value && addHistory({data: {record: val, formType}});
  };

  return <div>
    <Input
      onKeyDown={(e) => {
        if (e.keyCode === 13) {
          searchSkuName();
        }
      }}
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

    <div hidden={searchValue}>
      <div className={styles.groupTitle}>
        历史搜索
      </div>
      <div>
        {
          isArray(historyListData).map((item, index) => {
            return <div key={index} className={styles.valueItem} onClick={() => {
              searchSkuName(item.record);
            }}>
              <HistoryOutlined style={{marginRight: 16}} />
              {item.record}
            </div>;
          })
        }
      </div>
    </div>

    <div hidden={!searchValue} className={styles.searchValues}>
      <div className={styles.groupTitle}>
        物料
      </div>
      <div className={styles.valueItem} onClick={() => {
        searchSkuName();
      }}>
        <Icon type="icon-wuliaoguanli" style={{marginRight: 8}} />
        在物料中搜索关键词：
        <div style={{flexGrow: 1, height: 22}}>
          <span className={styles.keyWord}>{searchValue}</span>
        </div>
        <EnterOutlined />
      </div>

      <Spin spinning={loading}>
        <div className={styles.groupTitle} hidden={isArray(groupList.classListResults).length === 0 || noSkuClass}>
          分类
        </div>
        <div hidden={noSkuClass}>
          {
            isArray(groupList.classListResults).map((item, index) => {
              const label = item.name;
              return <div key={index} className={styles.valueItem} onClick={() => {
                setOpen(false);
                setShowValue(label);
                setSearchType('skuClass');
                onChange(item.spuClassificationId, 'skuClass', label);
              }}>
                <AppstoreOutlined style={{marginRight: 16}} />
                <SearchValueFormat searchValue={searchValue} label={label} />
              </div>;
            })
          }
        </div>


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
                onChange(item.partsId, 'parts', label);
              }}>
                <Icon type="icon-a-kehuliebiao2" style={{marginRight: 16}} />
                <div>
                  <SearchValueFormat searchValue={searchValue} label={label} />
                  <br />
                  版本号：{item.version ? <SearchValueFormat searchValue={searchValue} label={item.version} /> : '-'}
                  <br />
                  创建时间：{item.createTime}
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
