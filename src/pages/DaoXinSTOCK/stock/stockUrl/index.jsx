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

export const stockDetail = {
  url: '/stock/detail',
  method: 'POST',
  rowKey:'stockId'
};

export const stockList = {
  url: '/stock/list',
  method: 'POST',
  rowKey:'stockId'
};

export const palceIdSelect = {
  url: '/place/listSelect',
  method: 'POST'
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
export const places = {
  url: '/place/list',
  method: 'POST'
};
