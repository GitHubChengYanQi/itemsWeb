/**
 * 仓库总表接口配置
 *
 * @author
 * @Date 2021-07-15 11:13:02
 */

export const stockAdd = {
  url: '/stock/add',
  method: 'POST',
  rowKey:'stockId'
};

export const stockEdit = {
  url: '/stock/edit',
  method: 'POST',
  rowKey:'stockId'
};

export const stockDelete = {
  url: '/stock/delete',
  method: 'POST',
  rowKey:'stockId'
};
export const batchDelete = {
  url: '/stock/batchDelete',
  method: 'POST',
  rowKey:'stockId'
};

export const stockDetail = {
  url: '/stock/detail',
  method: 'POST',
  rowKey:'stockId'
};

export const outstockOrderList = {
  url: '/outstockOrder/list',
  method: 'POST',
  rowKey:'stockId'
};


export const outstockListingList = {
  url: '/outstockListing/list',
  method: 'POST',
};

export const instockOrderList = {
  url: '/instockOrder/list',
  method: 'POST',
  rowKey:'stockId'
};

export const allocationLogList = {
  url: '/allocationLog/list',
  method: 'POST',
  rowKey:'stockId'
};

export const maintenanceLogList = {
  url: '/maintenanceLog/list',
  method: 'POST',
  rowKey:'stockId'
};

export const stockDetailList = {
  url: '/stockDetails/list',
  method: 'POST',
  rowKey:'stockId'
};

export const stockList = {
  url: '/stock/list',
  method: 'POST',
  rowKey:'stockId'
};


export const itemIdSelect = {
  url: '/items/listSelect',
  method: 'POST'

};
export const brandIdSelect = {
  url: '/brand/listSelect',
  method: 'POST'
};
export const items = {
  url: '/items/list',
  method: 'POST'
};
export const storehouse = {
  url: '/storehouse/listSelect',
  method: 'POST'
};
