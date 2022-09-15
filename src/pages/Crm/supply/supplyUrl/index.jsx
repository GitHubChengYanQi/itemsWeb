/**
 * 供应商供应物料接口配置
 *
 * @author song
 * @Date 2021-12-20 10:08:44
 */

export const supplyAdd = {
  url: '/supply/add',
  method: 'POST',
  rowKey:'supplyId'
};

export const supplyEdit = {
  url: '/supply/updateBind',
  method: 'POST',
  rowKey:'supplyId'
};

export const supplyDelete = {
  url: '/supply/delete',
  method: 'POST',
  rowKey:'supplyId'
};

export const supplyDetail = {
  url: '/supply/detail',
  method: 'POST',
  rowKey:'supplyId'
};

export const supplyList = {
  url: '/supply/list',
  method: 'POST',
  rowKey:'supplyId'
};


export const supplyBind = {
  url: '/supply/conditionList',
  method: 'POST',
  rowKey:'supplyId'
};


export const supplyListSelect = {
  url: '/supply/listSelect',
  method: 'POST',
  rowKey:'supplyId'
};

