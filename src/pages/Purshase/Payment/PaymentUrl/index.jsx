/**
 * 接口配置
 *
 * @author song
 * @Date 2022-02-24 14:55:10
 */

export const paymentAdd = {
  url: '/paymentRecord/add',
  method: 'POST',
  rowKey: 'recordId'
};

export const paymentEdit = {
  url: '/paymentRecord/edit',
  method: 'POST',
  rowKey: 'recordId'
};

export const paymentDelete = {
  url: '/paymentRecord/delete',
  method: 'POST',
  rowKey: 'recordId',
};

export const paymentDetail = {
  url: '/paymentRecord/detail',
  method: 'POST',
  rowKey: 'recordId'
};

export const paymentList = {
  url: '/paymentRecord/list',
  method: 'POST',
  rowKey: 'recordId'
};

export const paymentListSelect = {
  url: '/paymentRecord/listSelect',
  method: 'POST',
  rowKey: 'recordId'
};

