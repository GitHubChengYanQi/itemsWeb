/**
 * 套餐分表字段配置页
 *
 * @author qr
 * @Date 2021-08-04 11:01:43
 */

import React from 'react';
import {Input, Select} from 'antd';
import * as apiUrl from '../packageTableUrl';

// 套餐
export const PackageId = (props) => {
  return (<Select api={apiUrl.erpPackageNameList} {...props} />);
};

// 产品名称
export const ItemId = (props) => {
  return (<Select api={apiUrl.ProductNameListSelect} {...props} />);
};

// 产品名称
export const name = (props) =>{
  return (<Input {...props}/>);
};

// 销售价格
export const salePrice = (props) =>{
  return (<Input {...props}/>);
};

// 数量
export const Quantity = (props) =>{
  return (<Input {...props}/>);
};




