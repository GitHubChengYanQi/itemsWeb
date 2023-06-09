/**
 * 接口配置
 *
 * @author
 * @Date 2021-09-07 09:50:09
 */

export const competitorAdd = {
  url: '/competitor/add',
  method: 'POST',
  rowKey:'competitorId'
};

export const competitorEdit = {
  url: '/competitor/edit',
  method: 'POST',
  rowKey:'competitorId'
};

export const competitorDelete = {
  url: '/competitor/delete',
  method: 'POST',
  rowKey:'competitorId'
};

export const competitorDetail = {
  url: '/competitor/detail',
  method: 'POST',
  rowKey:'competitorId'
};

export const competitorList = {
  url: '/competitor/list',
  method: 'POST',
  rowKey:'competitorId'
};
export const deleteByIds = {
  url: '/competitor/deleteByIds',
  method: 'POST',
  rowKey:'competitorId'
};

export const commonArea = {
  url: '/commonArea/treeView',
  method: 'POST',
};
export const BusinessId = {
  url: '/crmBusiness/listSelect',
  method: 'POST',
};
export const businessCompetition = {
  url: '/businessCompetition/listCompetition',
  method: 'POST',
};


