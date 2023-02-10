import {Input, List, Popover,} from 'antd';
import React, {useRef, useState} from 'react';
import {SearchOutlined} from '@ant-design/icons';
import {useRequest} from '@/util/Request';
import Note from '@/components/Note';
import {partsList} from '@/pages/Erp/parts/PartsUrl';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import SearchValueFormat from '@/components/SearchValueFormat';
import styles from '@/pages/Erp/sku/components/SelectSku/index.module.less';


const SelectBoms = (
  {
    disabled,
    manual,
    placeholder,
    onChange = () => {
    }
  }) => {


  const selectRef = useRef();

  const searchRef = useRef();

  const [open, setOpen] = useState(false);

  const [searchValue, setSearchValue] = useState('');

  const [detailData, setDetailData] = useState({});

  const {loading, data = [], run} = useRequest(partsList, {
    manual,
    debounceInterval: 300,
  });

  const getList = (data) => {
    run({
      data
    });
  };


  const options = !loading ? data.map((item) => ({
    ...item,
    label: SkuResultSkuJsons({skuResult: item.skuResult}),
    value: item.partsId,
  })) : [];

  return (<div style={{width: '100%'}} ref={selectRef}>
    <Popover
      zIndex={1005}
      getPopupContainer={() => {
        return selectRef.current;
      }}
      overlayClassName={styles.popover}
      arrow={false}
      placement="bottomLeft"
      open={disabled ? false : open}
      onOpenChange={(status) => {
        if (status) {
          setTimeout(() => {
            searchRef.current?.focus();
          }, 0);
        }
        setOpen(status);
      }}
      trigger="click"
      content={
        <div style={{minWidth: 400}}>
          <Input
            ref={searchRef}
            allowClear
            placeholder="请输入关键词搜索"
            value={searchValue}
            prefix={<SearchOutlined />}
            onChange={({target: {value}}) => {
              setSearchValue(value);
              getList({keyWord: value});
            }}
          />
          <List
            loading={loading}
            className={styles.list}
            itemLayout="horizontal"
            dataSource={options}
            renderItem={(item, index) => {
              return <List.Item
                style={{backgroundColor: index % 2 === 0 && '#f5f5f5'}}
                className={styles.item}
              >
                <List.Item.Meta
                  title={<SearchValueFormat
                    maxWidth="100%"
                    searchValue={searchValue}
                    label={item.name || '-'}
                  />}
                  description={<div>
                    <SearchValueFormat
                      maxWidth="100%"
                      searchValue={searchValue}
                      label={item.skuResult?.standard || '-'}
                    />
                    <SearchValueFormat
                      maxWidth="100%"
                      searchValue={searchValue}
                      label={item.label || '-'}
                    />
                  </div>}
                  onClick={() => {
                    setOpen(false);
                    setDetailData(item);
                    onChange(item.value);
                  }}
                />
              </List.Item>;
            }}
          />
        </div>
      }
    >
      <div className={styles.show}>
        <div className={styles.placeholder} hidden={detailData.partsId}>{placeholder || '请选择Bom'}</div>
        <div
          className={styles.coding}
        >
          <Note maxWidth="100%" value={detailData.name} />
        </div>
        <Note maxWidth="100%" value={detailData.skuResult?.standard} />
        <Note maxWidth="100%" value={SkuResultSkuJsons({skuResult: detailData.skuResult})} />
      </div>

    </Popover>

  </div>);
};

export default SelectBoms;
