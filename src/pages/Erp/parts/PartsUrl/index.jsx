/**
 * 清单接口配置
 *
 * @author
 * @Date 2021-07-14 14:30:20
 */

export const partsAdd = {
  // url: '/parts/add',
  url: '/parts/v1.1.1/add',
  method: 'POST',
  rowKey:'partsId'
};

export const bomsByskuId = {
  url: '/parts/bomsByskuId',
  method: 'GET',
};

export const partsRelease= {
  url: '/parts/release',
  method: 'POST',
  rowKey:'partsId'
};

export const partsEdit = {
  url: '/parts/edit',
  method: 'POST',
  rowKey:'partsId'
};

export const partsDelete = {
  url: '/parts/delete',
  method: 'POST',
  rowKey:'partsId'
};

export const partsDetail = {
  url: '/parts/detail',
  method: 'POST',
  rowKey:'partsId'
};

export const partsGetDetails = {
  url: '/parts/getdetails',
  method: 'POST',
  rowKey:'partsId'
};

export const partsGetBom = {
  url: '/parts/getBOM',
  method: 'GET',
  rowKey:'partsId'
};

export const partsList = {
  url: '/parts/list',
  method: 'POST',
  rowKey:'partsId'
};

export const partsOldList = {
  url: '/parts/oldList',
  method: 'POST',
  rowKey:'partsId'
};
export const partsListSelect = {
  url: '/parts/listSelect',
  method: 'POST',
  rowKey:'partsId'
};

export const itemIdSelect = {
  url: '/items/listSelect',
  method: 'POST'
};
export const brandIdSelect = {
  url: '/brand/listSelect',
  method: 'POST'
};
export const materialListSelect = {
  url: '/material/listSelect',
  method: 'POST',
  rowKey:'materialId'
};

export const spuListSelect = {
  url: '/spu/listSelect',
  method: 'POST',
};

// 产品名称
export const ProductNameListSelect = {
  url: '/items/listSelect',
  method: 'POST',
};

export const backDetails = {
  url: '/parts/backDetails',
  method: 'GET'
};
export const oldBackDetails = {
  url: '/parts/oldBackDetails',
  method: 'GET'
};
