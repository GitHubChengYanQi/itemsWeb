/**
 * 字段配置页
 *
 * @author
 * @Date 2021-10-18 14:14:21
 */

import React, {useRef} from 'react';
import {Input, InputNumber, TimePicker, Select as AntdSelect, Checkbox, Radio, Space, Button, Switch} from 'antd';
import Tree from '@/components/Tree';
import Cascader from '@/components/Cascader';
import Select from '@/components/Select';
import * as apiUrl from '../spuUrl';
import DatePicker from '@/components/DatePicker';
import {categoryList, categoryTree, spuClassificationListSelect, unitListSelect} from '../spuUrl';
import Attribute from '@/pages/Erp/spu/components/Attribute';
import {useBoolean} from 'ahooks';
import Modal from '@/components/Modal';
import ToolClassificationList from '@/pages/Erp/tool/components/toolClassification/toolClassificationList';
import CategoryList from '@/pages/Erp/category/categoryList';
import SpuClassificationList from '@/pages/Erp/spu/components/spuClassification/spuClassificationList';
import UnitList from '@/pages/Erp/unit/unitList';

export const Name = (props) =>{
  return (<Input {...props}/>);
};
export const ShelfLife = (props) =>{
  return (<><InputNumber min={0}  {...props}/>&nbsp;&nbsp;天</>);
};

export const CuringCycle = (props) =>{
  return (<><InputNumber min={0}  {...props}/>&nbsp;&nbsp;天</>);
};
export const Inventory = (props) =>{
  return (<><InputNumber min={0} {...props}/>&nbsp;&nbsp;个/件</>);
};
export const ProductionTime = (props) =>{
  return (<DatePicker   {...props} />);
};
export const Important = (props) =>{
  return (<><InputNumber min={0}  man={100} {...props}/>&nbsp;&nbsp;0~100</>);
};
export const Weight = (props) =>{
  return (<><InputNumber min={0} {...props}/>&nbsp;&nbsp;kg</>);
};
export const MaterialId = (props) =>{
  return (<Select width={200} api={apiUrl.materialIdSelect} {...props}/>);
};
export const Cost = (props) =>{
  return (<><InputNumber min={0} {...props}/>&nbsp;&nbsp;元</>);
};

export const SpuClass = (props) =>{
  const ref = useRef();

  const [state, {toggle}] = useBoolean();

  return (
    <Space>
      <Select resh={state} width={365} api={apiUrl.spuClassificationListSelect} {...props} />
      <Button onClick={() => {
        ref.current.open(false);
      }}>新增分类</Button>
      <Modal width={800} component={SpuClassificationList} ref={ref} onClose={() => {
        ref.current.close();
        toggle();
      }} />
    </Space>);
};
export const Vulnerability = (props) =>{
  return (<AntdSelect style={{width:200}} showSearch filterOption={(input, option) =>option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0} options={[{value:0,label:'易损'},{value:1,label:'不易损'}]} {...props}/>);
};
export const DeptId = (props) =>{
  return (<Input {...props}/>);
};
export const Class = (props) =>{
  return (<Input {...props}/>);
};
export const ClassId = (props) =>{
  return (<Input {...props}/>);
};
export const UnitId = (props) =>{
  const ref = useRef();

  const [state, {toggle}] = useBoolean();

  return (
    <Space>
      <Select resh={state} width={365} api={apiUrl.unitListSelect} {...props} />
      <Button onClick={() => {
        ref.current.open(false);
      }}>设置单位</Button>
      <Modal width={800} component={UnitList} ref={ref} onClose={() => {
        ref.current.close();
        toggle();
      }} />
    </Space>);
};
export const CategoryId = (props) =>{

  const ref = useRef();

  const [state, {toggle}] = useBoolean();

  return (
    <Space>
      <Cascader refre={state} api={categoryTree} {...props}/>
      <Button onClick={() => {
        ref.current.open(false);
      }}>设置类目</Button>
      <Modal width={800} component={CategoryList} ref={ref} onClose={() => {
        ref.current.close();
        toggle();
      }} />
    </Space>);
};
export const Type = (props) =>{
  return (
    <Radio.Group {...props} >
      <Radio value={0}>自制件</Radio>
      <Radio value={1}>委派件</Radio>
      <Radio value={2}>外购件</Radio>
    </Radio.Group>
  );
};
export const AttributeId = (props) =>{
  return (<Input {...props}/>);
};

export const Values = (props) => {
  const {items,...other} = props;

  return (
    <Radio.Group {...other} defaultValue={items.length && items[0].attributeValuesId}>
      {items && items.map((items,index)=>{
        return  <Radio key={index} value={items.attributeValuesId}>{items.attributeValues}</Radio>;
      })}
    </Radio.Group>
  );
};


export const Atts = (props) => {

  const {attribute,spuId,...other} = props;

  return (
    <>
      <Attribute attribute={attribute} spuId={spuId} {...other} />
    </>
  );
};

