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
  ...props
}) => {

  const ref = useRef();

  const {loading, data, refresh} = useRequest(brandIdSelect, {onSuccess: getBrands});

  if (loading) {
    return <Spin />;
  }

  if (!data) {
    return <>暂无品牌</>;
  }

  return <>
    <Select
      {...props}
      options={[
        {label: <a>新增品牌</a>, value: 'add'},
        ...data
      ]}
      value={value}
      onChange={(value, option) => {
        if (value === 'add') {
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
        onChange(res.data);
        refresh();
      }}
    />
  </>;
};

export default CheckBrand;
