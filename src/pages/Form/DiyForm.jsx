import React, {useState} from 'react';
import {InputNumber} from 'antd';
import {MultipleContainers} from '@/pages/Form/components/MultipleContainers/MultipleContainers';
import {createRange} from '@/pages/Form/components/createRange';

const DiyForm = () => {

  const data = [
    {key: 'spuClass', filedName: '物料分类', describe: '物料分类', show: true, defaultShow: true, disabled: true},
    {key: 'standard', filedName: '物料编码', describe: '物料唯一标识符', show: true, defaultShow: true},
    {key: 'spu', filedName: '产品名称', show: true, defaultShow: true},
    {key: 'spuCoding', filedName: '产品码', show: true, defaultShow: true,},
    {key: 'unitId', filedName: '单位', show: true, defaultShow: true},
    {key: 'batch', filedName: '二维码生成方式', show: true, defaultShow: true},
    {key: 'specifications', filedName: '规格', show: true,},
    {key: 'maintenancePeriod', filedName: '养护周期', show: true,},
    {key: 'sku', filedName: '物料描述', show: true,},
    {key: 'brandIds', filedName: '品牌', show: true,},
    {key: 'images', filedName: '图片', show: true,},
    {key: 'drawing', filedName: '图纸', show: true,},
    {key: 'fileId', filedName: '附件', show: true,},
    {key: 'model', filedName: '型号', show: true,},
    {key: 'nationalStandard', filedName: '国家标准', show: false,},
    {key: 'partNo', filedName: '零件号', show: false,},
    {key: 'materialId', filedName: '材质', show: true,},
    {key: 'weight', filedName: '重量', show: true,},
    {key: 'skuSize', filedName: '尺寸', show: true,},
    {key: 'color', filedName: '表色', show: true,},
    {key: 'level', filedName: '级别', show: true,},
    {key: 'heatTreatment', filedName: '热处理', show: true,},
    {key: 'packaging', filedName: '包装方式', show: true,},
    {key: 'viewFrame', filedName: '图幅', show: true,},
    {key: 'remarks', filedName: '备注', show: true,},
  ];

  const [columns, setColumns] = useState(1);

  return <>
    <div style={{textAlign: 'center', padding: 24}}>
      <InputNumber min={1} style={{width: 100}} value={columns} onChange={(number) => setColumns(number)} addonAfter="列" />
    </div>
    <MultipleContainers
      vertical
      items={{
        'A': createRange(data.length, (index) => data[index]),
      }}
      columns={columns}
    />

  </>;
};

export default DiyForm;
