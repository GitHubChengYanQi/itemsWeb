/**
 * 字段配置页
 *
 * @author
 * @Date 2021-10-18 14:14:21
 */

import React from 'react';
import {
  Input,
  InputNumber,
  Select as AntdSelect,
  Radio,
  AutoComplete
} from 'antd';
import Select from '@/components/Select';
import * as apiUrl from '../spuUrl';
import DatePicker from '@/components/DatePicker';
import {categoryTree} from '../spuUrl';
import Attribute from '@/pages/Erp/spu/components/Attribute';
import CategoryList from '@/pages/Erp/category/categoryList';
import SpuClassificationList from '@/pages/Erp/spu/components/spuClassification/spuClassificationList';
import UnitList from '@/pages/Erp/unit/unitList';
import {spuClassificationTreeVrew} from '@/pages/Erp/spu/components/spuClassification/spuClassificationUrl';
import SetSelectOrCascader from '@/components/SetSelectOrCascader';
import SpuClassificationEdit from '@/pages/Erp/spu/components/spuClassification/spuClassificationEdit';
import UnitEdit from '@/pages/Erp/unit/unitEdit';
import CategoryEdit from '@/pages/Erp/category/categoryEdit';

export const Name = (props) => {
  return (<Input {...props} />);
};
export const ShelfLife = (props) => {
  return (<><InputNumber min={0}  {...props} />&nbsp;&nbsp;天</>);
};

export const CuringCycle = (props) => {
  return (<><InputNumber min={0}  {...props} />&nbsp;&nbsp;天</>);
};
export const Inventory = (props) => {
  return (<><InputNumber min={0} {...props} />&nbsp;&nbsp;个/件</>);
};
export const ProductionTime = (props) => {
  return (<DatePicker   {...props} />);
};
export const Important = (props) => {
  return (<><InputNumber min={0} man={100} {...props} />&nbsp;&nbsp;0~100</>);
};
export const Weight = (props) => {
  return (<><InputNumber min={0} {...props} />&nbsp;&nbsp;kg</>);
};
export const MaterialId = (props) => {
  return (<Select width={200} api={apiUrl.materialIdSelect} {...props} />);
};
export const SpuClass = (props) => {

  return (<SetSelectOrCascader
    api={spuClassificationTreeVrew}
    width={200}
    moduleType='cascader'
    title="设置分类"
    component={SpuClassificationEdit}
    changeOnSelect={false}
    {...props} />);
};
export const Vulnerability = (props) => {
  return (<AntdSelect
    style={{width: 200}}
    showSearch
    filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    options={[{value: 0, label: '易损'}, {value: 1, label: '不易损'}]} {...props} />);
};
export const DeptId = (props) => {
  return (<Input {...props} />);
};
export const Class = (props) => {
  return (<Input {...props} />);
};
export const ClassId = (props) => {
  return (<Input {...props} />);
};
export const UnitId = (props) => {
  return (<SetSelectOrCascader api={apiUrl.unitListSelect} width={200} title="设置单位" component={UnitEdit} {...props} />);
};
export const CategoryId = (props) => {

  return (
    <SetSelectOrCascader api={categoryTree} width={200} moduleType='cascader' title="设置系列" component={CategoryEdit} {...props} />);
};
export const Type = (props) => {
  return (
    <Radio.Group {...props} >
      <Radio value={0}>自制件</Radio>
      <Radio value={1}>委派件</Radio>
      <Radio value={2}>外购件</Radio>
    </Radio.Group>
  );
};
export const AttributeId = (props) => {
  return (<Input {...props} />);
};

export const Values = (props) => {
  const {items, ...other} = props;

  return (
    <Radio.Group {...other} defaultValue={items.length && items[0].attributeValuesId}>
      {items && items.map((items, index) => {
        return <Radio key={index} value={items.attributeValuesId}>{items.attributeValues}</Radio>;
      })}
    </Radio.Group>
  );
};

export const Spu = (props) => {
  const {value, onChange, options} = props;

  return (
    <AutoComplete
      value={value && value.name ? value.name : null}
      options={options && options.map((items)=>{
        return {
          label:items.label,
          value:items.label,
          id:items.value
        };
      }) || []}
      style={{width: 300}}
      onSelect={(value, option) => {
        onChange({name: value, id: option.id});
      }}
      onChange={async (value) => {
        onChange({name: value});
      }}
      placeholder="请输入产品名称"
    />
  );
};

export const Atts = (props) => {

  const {attribute, spuId, ...other} = props;

  return (
    <>
      <Attribute attribute={attribute} spuId={spuId} {...other} />
    </>
  );
};

export const type = (props) => {
  return (
    <>
      <Input {...props} />
    </>
  );
};

