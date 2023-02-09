export const SkuRender = (skuItem) => {
  if (!skuItem) {
    return '-';
  }
  return `${skuItem.spuName || ''} ${skuItem.skuName ? ` / ${skuItem.skuName}` : ''}${skuItem.specifications ? ` / ${skuItem.specifications}` : ''}`;
};
