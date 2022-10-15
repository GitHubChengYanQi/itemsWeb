import {Button, Select, Spin} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {useRequest} from '@/util/Request';
import {skuDetail, skuList} from '@/pages/Erp/sku/skuUrl';
import Modal from '@/components/Modal';
import SkuEdit from '@/pages/Erp/sku/skuEdit';
import Note from '@/components/Note';
import {partsList} from '@/pages/Erp/parts/PartsUrl';


const SelectSku = (
  {
    supply,
    value,
    onChange,
    width,
    dropdownMatchSelectWidth,
    placeholder,
    onSpuId = () => {
    },
    skuResult,
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

  const formRef = useRef();
  const ref = useRef();

  const [change, setChange] = useState();

  const [open, setOpen] = useState(false);

  const [addLoading, setAddLoading] = useState();

  const skuLabel = (res) => {
    if (!res.spuResult) {
      return '';
    }
    return `${res.spuResult.name} / ${res.skuName} ${res.specifications ? `/ ${res.specifications}` : ''}`;
  };

  const objects = (data) => {

    if (!Array.isArray(data)) {
      return [];
    }
    let spus = [];
    data.map((item) => {
      const skuItem = (skuResult ? item.skuResult : item) || {};
      const sku = {
        disabled: skuIds && skuIds.filter((value) => {
          return value === skuItem.skuId;
        }).length > 0,
        label: skuLabel(skuItem),
        value: skuItem.skuId,
        spu: skuItem.spuResult,
        standard: skuItem.standard,
        type: 'sku',
        supply: skuItem.inSupply,
      };

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

    return spus;
  };

  const {loading, data, run} = useRequest({...(api || skuList), data: {skuIds: ids, ...params}}, {
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
    manual: true, onSuccess: (res) => {
      onChange(res.skuId, res);
      setChange(`${skuLabel(res)}standard:${res.standard}`);
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
    } else {
      setChange(null);
    }
  }, [value]);

  useEffect(() => {
    getSkuList();
  }, [spuClassId]);


  const options = !loading ? objects(data) : [];

  return (<>
    <Select
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
      {options && options.map((items) => {
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
                value={`${item.label}standard:${item.standard}`}>
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


    <Modal
      title="物料"
      compoentRef={formRef}
      loading={setAddLoading}
      component={SkuEdit}
      onSuccess={(res) => {
        onChange(res);
        ref.current.close();
      }}
      ref={ref}
      footer={<>
        <Button
          loading={addLoading}
          type="primary"
          onClick={() => {
            formRef.current.nextAdd(false);
          }}
        >完成</Button>
      </>} />

  </>);
};

export default SelectSku;
