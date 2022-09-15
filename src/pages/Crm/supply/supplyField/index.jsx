/**
 * 供应商供应物料字段配置页
 *
 * @author song
 * @Date 2021-12-20 10:08:44
 */

import React, {useEffect} from 'react';
import {
  Input,
  Tag,
  Select as AntSelect
} from 'antd';
import SelectSku from '@/pages/Erp/sku/components/SelectSku';
import {useRequest} from '@/util/Request';
import {brandListSelect} from '@/pages/Erp/brand/BrandUrl';

export const SkuId = ({
  value,
  onChange,
  skuDetail = () => {
  }
}) => {

  return (<SelectSku value={value} onChange={(skuId, sku) => {
    onChange(skuId);
    skuDetail(sku);
  }} width="100%" />);
};
export const CustomerId = (props) => {
  return (<Input {...props} />);
};
export const Display = (props) => {
  return (<Input {...props} />);
};

export const Model = (props) => {
  return (<Input placeholder="请输入供应商型号" {...props} />);
};

export const BrandId = (props) => {

  const {value, displays} = props;

  const brandBindResults = [];

  if (value && value.length > 0) {
    if (typeof value[0] === 'object') {
      value.forEach((items) => {
        brandBindResults.push(items && `${items.brandId}`);
      });
    } else {
      value.forEach((items) => {
        brandBindResults.push(items);
      });
    }
  }

  useEffect(() => {
    if (brandBindResults.length > 0) {
      props.onChange(brandBindResults);
    }
  }, []);


  const {data} = useRequest(brandListSelect);

  const options = data || [];

  const tagRender = (props) => {
    const {label, closable, onClose} = props;
    const onPreventMouseDown = event => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color="green"
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{marginRight: 3}}
      >
        {label}
      </Tag>
    );
  };


  return (
    <AntSelect
      mode="multiple"
      showArrow
      allowClear
      showSearch
      filterOption={(input, option) => option.label && option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      value={brandBindResults}
      tagRender={tagRender}
      style={{width: '100%', display: displays || null}}
      options={[{value: 0, label: '无品牌'}, ...options]}
      onChange={(value) => {
        props.onChange(value);
      }}
    />
  );
};
