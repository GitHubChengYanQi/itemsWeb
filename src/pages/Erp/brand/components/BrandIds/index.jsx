import React from 'react';
import {Select as AntSelect, Tag} from 'antd';
import {useRequest} from '@/util/Request';
import {brandListSelect} from '@/pages/Erp/brand/BrandUrl';


const BrandIds = ({value, onChange}) => {

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
      placeholder="请选择品牌"
      mode="multiple"
      showArrow
      allowClear
      showSearch
      filterOption={(input, option) => option.label && option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      value={Array.isArray(value) ? value : []}
      tagRender={tagRender}
      style={{width: '100%'}}
      options={options}
      onChange={(value) => {
        onChange(value);
      }}
    />
  );
};

export default BrandIds;
