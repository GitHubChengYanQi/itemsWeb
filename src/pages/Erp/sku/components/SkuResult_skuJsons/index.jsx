import React from 'react';

const SkuResultSkuJsons = ({skuResult}) => {

  if (!(skuResult && skuResult.spuResult))
    return null;

  return <>
    {skuResult.spuResult.name}
    &nbsp;/&nbsp;
    {skuResult.skuName}
    {skuResult.specifications && <> &nbsp;/&nbsp; {skuResult.specifications}</>}
  </>;
};

export default SkuResultSkuJsons;
