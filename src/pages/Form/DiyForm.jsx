import React, {useState} from 'react';
import {InputNumber, Select, Space} from 'antd';
import {MultipleContainers} from '@/pages/Form/components/MultipleContainers/MultipleContainers';

const DiyForm = () => {

  const data = [
    {key: 'card', filedName: 'Card'},
    {key: 'spuClass', filedName: '物料分类', disabled: true},
    {key: 'standard', filedName: '物料编码'},
    {key: 'spu', filedName: '产品名称'},
    {key: 'spuCoding', filedName: '产品码'},
    {key: 'unitId', filedName: '单位'},
    {key: 'batch', filedName: '二维码生成方式'},
    {key: 'specifications', filedName: '规格'},
    {key: 'maintenancePeriod', filedName: '养护周期'},
    {key: 'sku', filedName: '物料描述'},
    {key: 'brandIds', filedName: '品牌'},
    {key: 'images', filedName: '图片'},
    {key: 'drawing', filedName: '图纸'},
    {key: 'fileId', filedName: '附件'},
    {key: 'model', filedName: '型号'},
    {key: 'nationalStandard', filedName: '国家标准'},
    {key: 'partNo', filedName: '零件号'},
    {key: 'materialId', filedName: '材质'},
    {key: 'weight', filedName: '重量'},
    {key: 'skuSize', filedName: '尺寸'},
    {key: 'color', filedName: '表色'},
    {key: 'level', filedName: '级别'},
    {key: 'heatTreatment', filedName: '热处理'},
    {key: 'packaging', filedName: '包装方式'},
    {key: 'viewFrame', filedName: '图幅'},
    {key: 'remarks', filedName: '备注'},
  ];

  return <>
    <MultipleContainers
      vertical
      items={[{line: 0, column: 0, data}, {line: 1, column: 0, data: []}]}
    />

  </>;
};

export default DiyForm;
