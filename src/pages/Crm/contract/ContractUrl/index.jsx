/**
 * 合同表接口配置
 *
 * @author
 * @Date 2021-07-21 13:36:21
 */

export const contractAdd = {
  url: '/contract/add',
  method: 'POST',
  rowKey: 'contractId'
};

export const contractEditContent = {
  url: '/contract/editContent',
  method: 'POST',
  rowKey: 'contractId'
};
export const contractEdit = {
  url: '/contract/edit',
  method: 'POST',
  rowKey: 'contractId'
};

export const contractDelete = {
  url: '/contract/delete',
  method: 'POST',
  rowKey: 'contractId'
};

export const contractBatchDelete = {
  url: '/contract/batchDelete',
  method: 'POST',
  rowKey: 'contractId'
};


export const contractDetail = {
  url: '/contract/detail',
  method: 'POST',
  rowKey: 'contractId'
};


export const contractExcel= {
  url: '/Excel/exportContract',
  method: 'GET',
};

export const contractList = {
  url: '/contract/list',
  method: 'POST',
  rowKey: 'contractId'
};

export const userIdSelect = {
  url: '/rest/mgr/listSelect',
  method: 'POST'
};

export const templateSelect = {
  url: '/template/listSelect',
  method: 'POST'
};


export const CustomerNameListSelect = {
  url: '/customer/listSelect',
  method: 'POST',
};
export const CuntactsListSelect = {
  url: '/contacts/listSelect',
  method: 'POST',
};
export const AdressListSelect = {
  url: '/adress/listSelect',
  method: 'POST',
};
