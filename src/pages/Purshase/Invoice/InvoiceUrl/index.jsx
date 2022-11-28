/**
 * 接口配置
 *
 * @author song
 * @Date 2022-02-24 14:55:10
 */

export const invoiceAdd = {
  url: '/invoiceBill/add',
  method: 'POST',
  rowKey: 'invoiceBillId'
};

export const invoiceEdit = {
  url: '/invoiceBill/edit',
  method: 'POST',
  rowKey: 'invoiceBillId'
};

export const invoiceDelete = {
  url: '/invoiceBill/delete',
  method: 'POST',
  rowKey: 'invoiceBillId',
};

export const invoiceDetail = {
  url: '/invoiceBill/detail',
  method: 'POST',
  rowKey: 'invoiceBillId'
};

export const invoiceList = {
  url: '/invoiceBill/list',
  method: 'POST',
  rowKey: 'invoiceBillId'
};

export const invoiceListSelect = {
  url: '/invoiceBill/listSelect',
  method: 'POST',
  rowKey: 'invoiceBillId'
};

