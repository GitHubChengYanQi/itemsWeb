import React, {useRef} from 'react';
import {Select as AntSelect, Tag} from 'antd';
import {useRequest} from '@/util/Request';
import {brandListSelect} from '@/pages/Erp/brand/BrandUrl';
import {isArray} from '@/util/Tools';
import Drawer from '@/components/Drawer';
import BrandEdit from '@/pages/Erp/brand/BrandEdit';


const BrandIds = ({value, onChange, placeholder, autoFocus, ...props}) => {

  const ref = useRef();

  const {data, refresh} = useRequest(brandListSelect);

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
    <>
      <AntSelect
        autoFocus={autoFocus}
        {...props}
        placeholder={placeholder || '请选择品牌'}
        mode="multiple"
        showArrow
        allowClear
        showSearch
        filterOption={(input, option) => {
          if (typeof option.label !== 'string') {
            return true;
          }
          return option.label && option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        }}
        value={Array.isArray(value) ? value : []}
        tagRender={tagRender}
        style={{width: '100%'}}
        options={[{label: <a>添加品牌</a>, value: 'add'}, ...options]}
        onChange={(value) => {
          if (isArray(value).includes('add')) {
            ref.current.open(false);
          } else {
            onChange(value);
          }
        }}
      />
      <Drawer
        noSku
        component={BrandEdit}
        ref={ref}
        onSuccess={(res) => {
          ref.current.close();
          onChange([...isArray(value), res.data]);
          refresh();
        }}
      />
    </>
  );
};

export default BrandIds;
