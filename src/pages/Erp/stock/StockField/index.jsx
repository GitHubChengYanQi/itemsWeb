/**
 * 仓库总表字段配置页
 *
 * @author
 * @Date 2021-07-15 11:13:02
 */

import React, {useRef} from 'react';
import {Input, Button, Checkbox, Select as AntSelect, Spin, Space} from 'antd';
import Select from '@/components/Select';
import Items from '@/pages/Erp/stock/StockEdit/components/Items';
import Drawer from '@/components/Drawer';
import * as apiUrl from '../StockUrl';
import SelectSku from '@/pages/Erp/sku/components/SelectSku';
import Cascader from '@/components/Cascader';
import {
  storehousePositionsTreeView
} from '@/pages/Erp/storehouse/components/storehousePositions/storehousePositionsUrl';
import style from './index.module.less';
import InputNumber from '@/components/InputNumber';
import {useRequest} from '@/util/Request';
import {partsList} from '@/pages/Erp/parts/PartsUrl';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';

export const Palce = (props) => {
  return <Input {...props} />;
};

export const Position = (props) => {
  const {value, onChange, id, placeholder} = props;
  return <Cascader
    width={200}
    value={value}
    resh={id}
    placeholder={placeholder}
    api={storehousePositionsTreeView}
    defaultParams={{params: {ids: id}}}
    onChange={onChange} />;
};


export const Sku = (props) => {
  return <SelectSku {...props} />;
};

export const Stock = (props) => {
  const {onChange} = props;
  return <Checkbox onChange={(value) => {
    if (value.target.checked) {
      onChange(0);
    } else {
      onChange(null);
    }
  }} />;
};

export const Item = (props) => {
  const {onChange} = props;
  const ref = useRef(null);
  const tableRef = useRef(null);
  return (<>
    <Input   {...props} />
    <Button className="placeName" onClick={() => {
      ref.current.open(false);
    }}>
      搜索产品
    </Button>
    <Drawer width={1000} title="选择" component={Items} onSuccess={() => {
      tableRef.current.refresh();
      ref.current.close();
    }} ref={ref} ckeck={(id) => {
      onChange(id);
      ref.current.close();
    }} />
  </>);
};

export const Storehouse = (props) => {
  return (<Select width={300} api={apiUrl.storehouse}   {...props} />);
};

export const ItemId = (props) => {
  return (<Select api={apiUrl.itemIdSelect}   {...props} />);
};
export const BrandId = (props) => {
  return (<Select width={200} api={apiUrl.brandIdSelect} {...props} />);
};
export const Inventory = (props) => {
  return (<InputNumber min={0}   {...props} />);
};

export const StockNumbers = ({value = {}, onChange}) => {

  return <Space size={0}>
    <InputNumber
      min={0}
      className={style.between}
      value={value?.mixNum}
      style={{width: 100, textAlign: 'center'}}
      placeholder="最小库存"
      onChange={(mixNum) => {
        onChange({
          mixNum,
          maxNum: value?.maxNum
        });
      }}
    />
    <Input
      style={{
        width: 30,
        borderLeft: 0,
        borderRight: 0,
        backgroundColor: '#fff',
        pointerEvents: 'none',
      }}
      placeholder="~"
      disabled
    />
    <InputNumber
      className={style.and}
      style={{
        width: 100,
        textAlign: 'center',
      }}
      value={value?.maxNum}
      min={value?.mixNum + 1}
      placeholder="最大库存"
      onChange={(maxNum) => {
        onChange({
          ...(value || {}),
          maxNum
        });
      }}
    />
  </Space>;
};

export const BomSelect = ({value, onChange}) => {

  const {loading, data, run} = useRequest({...partsList, params: {limit: 10, page: 1}, data: {status: 99}});

  const options = (!loading && data) ? data.map((item) => {
    const skuResult = item.skuResult || {};
    return {
      label: <SkuResultSkuJsons skuResult={skuResult} />,
      value: item.skuId,
      partsId: item.partsId
    };
  }) : [];

  return <AntSelect
    value={value}
    allowClear
    placeholder="搜索BOM"
    style={{width: 200}}
    showSearch
    filterOption={false}
    notFoundContent={loading && <div style={{textAlign: 'center'}}><Spin /></div>}
    options={options}
    onSearch={(string) => {
      run({
        data: {
          status: 99,
          skuName: string,
        },
        params: {
          limit: 10,
          page: 1
        }
      });
    }}
    onChange={(value, option) => {
      onChange(value, option && option.partsId);
    }}
  />;
};

export const SelectBom = (props) => {
  return <AntSelect
    placeholder="BOM查询条件"
    style={{width: 150}}
    options={[{label: '所有物料', value: 'All'}, {label: '下级物料', value: 'Present'},]}
    {...props}
  />;
};
