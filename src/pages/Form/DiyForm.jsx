import React from 'react';
import {MultipleContainers} from '@/pages/Form/components/MultipleContainers/MultipleContainers';

const DiyForm = () => {

  const data = [
    {key: 'card', filedName: 'Card'},
    {key: 'spuClass', filedName: '物料分类', inputType: 'input'},
    {key: 'standard', filedName: '物料编码', inputType: 'input'},
    {key: 'spu', filedName: '产品名称', inputType: 'input'},
    {key: 'spuCoding', filedName: '产品码', inputType: 'input'},
    {key: 'unitId', filedName: '单位', inputType: 'select'},
    {key: 'batch', filedName: '二维码生成方式', inputType: 'radio'},
    {key: 'specifications', filedName: '规格', inputType: 'input'},
    {key: 'maintenancePeriod', filedName: '养护周期', inputType: 'input'},
    {key: 'sku', filedName: '物料描述', inputType: 'input'},
    {key: 'brandIds', filedName: '品牌', inputType: 'select'},
    {key: 'images', filedName: '图片', inputType: 'upload'},
    {key: 'drawing', filedName: '图纸', inputType: 'upload'},
    {key: 'fileId', filedName: '附件', inputType: 'upload'},
    {key: 'model', filedName: '型号', inputType: 'input'},
    {key: 'nationalStandard', filedName: '国家标准', inputType: 'input'},
    {key: 'partNo', filedName: '零件号', inputType: 'input'},
    {key: 'materialId', filedName: '材质', inputType: 'input'},
    {key: 'weight', filedName: '重量', inputType: 'input'},
    {key: 'skuSize', filedName: '尺寸', inputType: 'input'},
    {key: 'color', filedName: '表色', inputType: 'input'},
    {key: 'level', filedName: '级别', inputType: 'input'},
    {key: 'heatTreatment', filedName: '热处理', inputType: 'input'},
    {key: 'packaging', filedName: '包装方式', inputType: 'input'},
    {key: 'viewFrame', filedName: '图幅', inputType: 'input'},
    {key: 'remarks', filedName: '备注', inputType: 'input'},
  ];

  return <>
    <MultipleContainers
      vertical
      items={[{line: 0, column: 0, data}, {step: 0, line: 1, column: 0, data: []}]}
    />
  </>;
};

export default DiyForm;
