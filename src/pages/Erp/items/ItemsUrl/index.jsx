/**
 * 产品表接口配置
 *
 * @author
 * @Date 2021-07-14 14:04:26
 */

export const itemsAdd = {
  url: '/items/add',
  method: 'POST',
  rowKey:'itemId'
};

export const itemsEdit = {
  url: '/items/edit',
  method: 'POST',
  rowKey:'itemId'
};

export const itemsDelete = {
  url: '/items/delete',
  method: 'POST',
  rowKey:'itemId'
};
export const batchDelete = {
  url: '/items/batchDelete',
  method: 'POST',
  rowKey:'itemId'
};

export const batchAdd = {
  url: '/crmBusinessDetailed/batchAdd',
  method: 'POST',
  rowKey:'id'
};
export const contractDetail = {
  url: '/contractDetail/addItems',
  method: 'POST',
  rowKey:'id'
};

export const addAllPackages = {
  url: '/crmBusinessDetailed/addAllPackages',
  method: 'POST',
  rowKey:'id'
};

export const addAllPackagesTable = {
  url: '/erpPackageTable/batchAdd',
  method: 'POST',
  rowKey:'id'
};


export const itemsDetail = {
  url: '/items/detail',
  method: 'POST',
  rowKey:'itemId'
};

export const itemsList = {
  url: '/items/list',
  method: 'POST',
  rowKey:'itemId'
};
export const itemsListSelect = {
  url: '/items/listSelect',
  method: 'POST',
  rowKey:'itemId'
};

export const materialIdSelect = {
  url: '/material/listSelect',
  method: 'POST'
};
