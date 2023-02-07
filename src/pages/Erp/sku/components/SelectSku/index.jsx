import {Button, Select, Spin} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {useRequest} from '@/util/Request';
import {skuDetail, skuList} from '@/pages/Erp/sku/skuUrl';
import Modal from '@/components/Modal';
import SkuEdit from '@/pages/Erp/sku/skuEdit';
import Note from '@/components/Note';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import AddSkuModal from '@/pages/Erp/sku/SkuTable/AddSkuModal';


const SelectSku = (
  {
    disabled,
    supply,
    value,
    onChange,
    manual,
    width,
    dropdownMatchSelectWidth,
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
    style,
    api,
    getDetailLoading = () => {
    },
  }) => {

  const ref = useRef();

  const [change, setChange] = useState();

  const [open, setOpen] = useState(false);

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
        label: SkuResultSkuJsons({skuResult: skuItem}),
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
        label: skuItem.spuResult && skuItem.spuResult.name,
        value: skuItem.spuId,
        type: 'spu',
        options: [sku]
      });
    });

    return noSpu ? skus : spus;
  };

  const {loading, data, run} = useRequest({...(api || skuList), data: {skuIds: ids, ...params}}, {
    manual,
    debounceInterval: 300,
  });

  const getSkuList = (data) => {
    run({
      data: {
        skuIds: ids, spuClass: spuClassId, ...data, ...params
      }
    });
  };

  const {loading: detailLoading, run: detail} = useRequest(skuDetail, {
    manual: true,
    onSuccess: (res) => {
      onChange(res.skuId, res);
      setChange(SkuResultSkuJsons({skuResult: res}));
    }
  });

  useEffect(() => {
    getDetailLoading(detailLoading);
  }, [detailLoading]);

  useEffect(() => {
    if (value) {
      detail({
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
  return (<>
    <Select
      disabled={disabled}
      filterOption={false}
      style={{width: width || 200, ...style}}
      placeholder={placeholder || '搜索物料'}
      showSearch
      open={open}
      allowClear
      onClear={() => {
        onChange(null);
      }}
      onDropdownVisibleChange={setOpen}
      value={value && change}
      notFoundContent={loading && <div style={{textAlign: 'center', padding: 16}}><Spin /></div>}
      dropdownMatchSelectWidth={dropdownMatchSelectWidth || 400}
      onSearch={(value) => {
        getSkuList({skuName: value,});
      }}
      onChange={(value, option) => {
        if (value === 'add') {
          ref.current.open(false);
          onChange(null);
          return;
        }
        setChange(value);
        if (option) {
          if (option && option.key) {
            onChange(option.key);
          }
        } else {
          onChange(null);
          getSkuList();
        }

      }}>
      {!noAdd && !loading && <Select.Option
        key="add"
        title="新增物料"
        value="add"
      >
        <a>
          新增物料
        </a>
      </Select.Option>}
      {options.map((items) => {
        if (noSpu) {
          return <Select.Option
            key={items.value}
            style={{color: 'rgb(113 111 111)'}}
            disabled={items.disabled}
            title={items.label}
            standard={items.standard}
            value={`${items.label}standard:${items.standard}`}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div style={{flexGrow: 1, maxWidth: '85%'}}>
                <Note>
                  {items.label}
                </Note>
              </div>
              {supply && params && params.customerId && <div style={{textAlign: 'right', width: 100}}>
                <Button
                  type="link"
                  danger={!items.supply}
                  style={{padding: 0}}>{items.supply ? '供应物料' : '非供应物料'}</Button>
              </div>}
            </div>

          </Select.Option>;
        }
        return (
          <Select.OptGroup key={items.value} label={<Button type="text" style={{padding: 0}} onClick={() => {
            onSpuId(items.value);
            setOpen(false);
          }}>{items.label}</Button>}>
            {items.options.map((item) => {
              return <Select.Option
                key={item.value}
                style={{color: 'rgb(113 111 111)'}}
                disabled={item.disabled}
                title={item.label}
                standard={item.standard}
                value={item.label}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <div style={{flexGrow: 1, maxWidth: '85%'}}>
                    <Note>
                      {item.label}
                    </Note>
                  </div>
                  {supply && params && params.customerId && <div style={{textAlign: 'right', width: 100}}>
                    <Button
                      type="link"
                      danger={!item.supply}
                      style={{padding: 0}}>{item.supply ? '供应物料' : '非供应物料'}</Button>
                  </div>}
                </div>

              </Select.Option>;
            })}
          </Select.OptGroup>
        );
      })}
    </Select>


    <AddSkuModal
      addRef={ref}
      onSuccess={(res) => {
        detail({
          data: {
            skuId: res
          }
        });
        ref.current.close();
      }}
    />

  </>);
};

export default SelectSku;
