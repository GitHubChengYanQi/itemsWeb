import React, {useRef} from 'react';
import {Spin} from 'antd';
import {brandIdSelect} from '@/pages/Erp/stock/StockUrl';
import Select from '@/components/Select';
import {useRequest} from '@/util/Request';
import Drawer from '@/components/Drawer';
import BrandEdit from '@/pages/Erp/brand/BrandEdit';

const CheckBrand = ({
  value,
  onChange = () => {
  },
  getBrands = () => {
  },
  brandRefresh = () => {
  },
  options = [],
  ...props
}) => {

  const ref = useRef();

  const {loading, data, refresh} = useRequest(brandIdSelect, {manual: options.length > 0, onSuccess: getBrands});

  if (loading) {
    return <Spin />;
  }

  return <>
    <Select
      {...props}
      options={[
        {label: <a>新增品牌</a>, value: '111add'},
        ...(options.length > 0 ? options : data)
      ]}
      value={value}
      onChange={(value, option) => {
        if (value === '111add') {
          ref.current.open(false);
          return;
        }
        onChange(value, option);
      }} />

    <Drawer
      noSku
      component={BrandEdit}
      ref={ref}
      onSuccess={(res) => {
        ref.current.close();
        onChange(res.data);
        refresh();
        brandRefresh();
      }}
    />
  </>;
};

export default CheckBrand;
