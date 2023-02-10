import {Button, Input, List, Popover, Spin} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {SearchOutlined, DownOutlined, CloseCircleOutlined} from '@ant-design/icons';
import classNames from 'classnames';
import {useRequest} from '@/util/Request';
import {skuDetail, skuV1List} from '@/pages/Erp/sku/skuUrl';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import AddSkuModal from '@/pages/Erp/sku/SkuTable/AddSkuModal';
import styles from './index.module.less';
import {SkuRender} from '@/pages/Erp/sku/components/SkuRender';
import SearchValueFormat from '@/components/SearchValueFormat';
import Note from '@/components/Note';


const SelectSku = (
  {
    maxHeight = '50vh',
    popupContainerBody,
    disabled,
    supply,
    value,
    onChange,
    manual,
    placeholder,
    onSpuId = () => {
    },
    skuResult,
    noSpu,
    params,
    skuIds,
    noAdd,
    spuClassId,
    ids,
    api,
    getDetailLoading = () => {
    },
  }) => {

  const ref = useRef();

  const selectRef = useRef();

  const searchRef = useRef();

  const [open, setOpen] = useState(false);

  const [searchValue, setSearchValue] = useState('');

  const [hover, setHover] = useState(false);

  const [detailData, setDetailData] = useState({});

  const objects = (data) => {

    if (!Array.isArray(data)) {
      return [];
    }

    let spus = [];
    const skus = [];
    data.map((item) => {
      const skuItem = (skuResult ? item.skuResult : item) || {};
      const sku = {
        disabled: skuIds && skuIds.filter((value) => {
          return value === skuItem.skuId;
        }).length > 0,
        label: SkuRender(skuItem),
        value: skuItem.skuId,
        spu: skuItem.spuResult,
        standard: skuItem.standard,
        type: 'sku',
        supply: skuItem.inSupply,
      };

      if (noSpu) {
        return skus.push(sku);
      }

      if (spus.map(item => item.value).includes(skuItem.spuId)) {
        return spus = spus.map((spuItem) => {
          if (spuItem.value === skuItem.spuId) {
            return {
              ...spuItem,
              options: [...spuItem.options, sku],
            };
          } else {
            return spuItem;
          }
        });

      }

      return spus.push({
        label: skuItem.spuName,
        value: skuItem.spuId,
        type: 'spu',
        options: [sku]
      });
    });

    return noSpu ? skus : spus;
  };

  const {loading, data, run} = useRequest({...(api || skuV1List), data: {skuIds: ids, ...params}}, {
    manual,
    debounceInterval: 300,
  });

  const getSkuList = (data) => {
    run({
      data: {
        skuIds: ids, categoryId: spuClassId, ...data, ...params
      }
    });
  };

  const {loading: detailLoading, run: detailRun} = useRequest(skuDetail, {
    manual: true,
    onSuccess: (res) => {
      setDetailData(res);
      onChange(res.skuId, res);
    }
  });

  useEffect(() => {
    getDetailLoading(detailLoading);
  }, [detailLoading]);

  useEffect(() => {
    if (value) {
      detailRun({
        data: {
          skuId: value
        }
      });
    }
  }, [value]);

  useEffect(() => {
    if (spuClassId) {
      getSkuList();
    }
  }, [spuClassId]);


  const options = !loading ? objects(data) : [];

  if (detailLoading) {
    return <Spin />;
  }

  const skuList = (dataSource, isChildren) => {
    return <List
      loading={loading}
      className={isChildren ? styles.childrenList : styles.list}
      itemLayout="horizontal"
      dataSource={dataSource}
      renderItem={(item, index) => {
        return <List.Item
          style={{backgroundColor: index % 2 === 0 && '#f5f5f5'}}
          className={styles.item}
          actions={[
            supply && params && params.customerId &&
            <div style={{textAlign: 'right', width: 100}}>
              <Button
                type="link"
                danger={!item.supply}
                style={{padding: 0}}
              >
                {item.supply ? '供应物料' : '非供应物料'}
              </Button>
            </div>
          ]}
        >
          <List.Item.Meta
            title={<SearchValueFormat
              maxWidth="100%"
              searchValue={searchValue}
              label={item.standard || '-'}
            />}
            description={<SearchValueFormat
              maxWidth="100%"
              searchValue={searchValue}
              label={item.label || '-'}
            />}
            onClick={() => {
              setOpen(false);
              detailRun({
                data: {
                  skuId: item.value
                }
              });
            }}
          />
        </List.Item>;
      }}
    />;
  };

  return (<div style={{width: '100%'}} ref={selectRef}>
    <Popover
      zIndex={1005}
      getPopupContainer={() => {
        return popupContainerBody ? document.body : selectRef.current;
      }}
      overlayClassName={classNames(styles.popover, !popupContainerBody && styles.popoverTop)}
      arrow={false}
      placement="bottomLeft"
      open={disabled ? false : open}
      onOpenChange={(status) => {
        if (status) {
          setTimeout(() => {
            searchRef.current?.focus();
          }, 0);
          return;
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
              getSkuList({keyWord: value});
            }}
          />
          <div className={styles.add}>
            <div>物料列表</div>
            <a hidden={noAdd} onClick={() => {
              setOpen(false);
              ref.current.open(false);
            }}>
              新增物料
            </a>
          </div>
          <div style={{maxHeight}} className={styles.skuList}>
            {
              noSpu ? skuList(options) : <div className={styles.spuList}>
                {
                  options.map((item, index) => {
                    return <div key={index}>
                      <div onClick={() => {
                        onSpuId(item.value);
                        setOpen(false);
                      }}>
                        <div className={styles.spuName}>
                          <div>{item.label}</div>
                          <a onClick={() => {
                            onSpuId(item.value);
                            setOpen(false);
                          }}>选择产品</a>
                        </div>
                        {skuList(item.options, true)}
                      </div>
                    </div>;
                  })
                }
              </div>
            }
          </div>
        </div>
      }
    >
      <div
        onBlur={()=>{}}
        onFocus={()=>{}}
        className={styles.show}
        onMouseOver={() => {
          setHover(true);
        }}
        onMouseOut={() => {
          setHover(false);
        }}
      >
        <div className={styles.content} onClick={() => {
          setOpen(true);
        }}>
          <div className={styles.placeholder} hidden={detailData.skuId}>{placeholder || '请选择物料'}</div>
          <div
            className={styles.coding}
          >
            <Note maxWidth="100%" value={detailData.standard} />
          </div>
          <div><Note maxWidth="100%" value={SkuResultSkuJsons({skuResult: detailData})} /></div>
        </div>
        <div>
          {(hover && detailData.skuId) ?
            <CloseCircleOutlined style={{color: '#7d8389'}} onClick={() => {
              onChange(null);
              setDetailData({});
            }} />
            :
            <DownOutlined style={{color: '#7d8389'}} />}
        </div>
      </div>

    </Popover>


    <AddSkuModal
      addRef={ref}
      onSuccess={(res) => {
        detailRun({
          data: {
            skuId: res
          }
        });
        ref.current.close();
      }}
    />

  </div>);
};

export default SelectSku;
