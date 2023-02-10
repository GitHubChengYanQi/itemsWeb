import React from 'react';

const SkuResultSkuJsons = ({skuResult, describe}) => {

  if (!skuResult) {
    return '';
  }

  if (describe) {
    return skuResult.skuJsons
      &&
      skuResult.skuJsons.length > 0
      &&
      skuResult.skuJsons[0].values.attributeValues
      &&
      skuResult.skuJsons.map((items) => {
        return `${items.attribute.attribute || '无'}:${items.values.attributeValues || '无'}`;
      }).join(' ; ') || '';
  }

  return `${skuResult.spuResult ? skuResult.spuResult.name : ''} ${skuResult.skuName ? ` / ${skuResult.skuName}` : ''}${skuResult.specifications ? ` / ${skuResult.specifications}` : ''}`;
};

export default SkuResultSkuJsons;
