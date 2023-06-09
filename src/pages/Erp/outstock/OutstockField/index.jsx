/**
 * 出库表字段配置页
 *
 * @author song
 * @Date 2021-07-17 10:46:08
 */

import React, {useEffect, useRef, useState} from 'react';
import {Input, Select as AntSelect} from 'antd';
import Drawer from '@/components/Drawer';
import StockList from '@/pages/Erp/stock/StockList';
import Select from '@/components/Select';
import * as apiUrl from '@/pages/Erp/outstock/OutstockUrl';
import InputNumber from '@/components/InputNumber';
import {useRequest} from '@/util/Request';
import {brandIdSelect} from '@/pages/Erp/parts/PartsUrl';


const {Search} = Input;


export const Stock = (props) => {
  const {onChange, val} = props;
  const [value, setValue] = useState(val);
  const ref = useRef(null);
  return (<>
    <Search style={{width: 200}} {...props} value={value} onSearch={() => {
      ref.current.open(false);
    }} enterButton />
    <Drawer width={1700} title="选择" component={StockList} onSuccess={() => {
      ref.current.close();
    }} ref={ref} choose={(choose) => {
      setValue(choose.name);
      onChange(choose.stockId);
      ref.current.close();
    }} />
  </>);
};

export const StockId = (props) => {
  return (<Input   {...props} />);
};


export const Number = (props) => {
  const {number} = props;
  const inventory = number ? number[0].inventory : null;
  return (<InputNumber min={0}   {...props} onChange={(value) => {
    if (value > inventory) {
      props.onChange(null);
    } else {
      props.onChange(value);
    }
  }} />);
};

export const BrandId = ({
  value,
  onChange,
  skuId,
}) => {

  const {loading, data, run} = useRequest(brandIdSelect, {manual: true});

  useEffect(() => {
    if (skuId) {
      run({
        data: {
          skuId
        }
      });
    }
  }, [skuId]);

  const options = (loading || !data) ? [] : data.map((value) => {
    return {
      label: value.brandResult ? value.brandResult.brandName : null,
      value: value.brandId,
    };
  });

  return (<AntSelect options={options} style={{width: 200}} value={value} onChange={onChange} />);
};
export const ItemIdSelect = (props) => {
  const {storehouseid, itemid, state} = props;

  // if (state) {
  //   // eslint-disable-next-line react-hooks/rules-of-hooks
  //   useEffect(() => {
  //     props.onChange(null);
  //   }, [storehouseid]);
  // }


  const data = storehouseid ? storehouseid.map((value, index) => {
    return {
      label: value.itemsResult ? value.itemsResult.name : null,
      value: value.itemId,
    };
  }) : null;

  return (<AntSelect options={data} style={{width: 200}}  {...props} onChange={(value) => {
    props.onChange(value);
    itemid ? itemid(value) : null;
  }} />);
};

export const StoreHouseSelect = (props) => {

  const {storehouseid, onChange} = props;

  return (<Select api={apiUrl.storeHouseSelect} {...props} onChange={(value) => {
    onChange(value);
    storehouseid(value);
  }} />);
};

export const OutstockOrder = (props) => {
  props.onChange(props.OutstockOrder);
  return (<Input {...props} />);
};



