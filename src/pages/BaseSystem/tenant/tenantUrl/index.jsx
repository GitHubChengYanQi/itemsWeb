/**
 * 系统租户表接口配置
 *
 * @author Captain_Jazz
 * @Date 2023-04-07 09:26:48
 */

export const tenantAdd = {
  url: '/tenant/add',
  method: 'POST',
  rowKey:'tenantId'
};

export const tenantEdit = {
  url: '/tenant/edit',
  method: 'POST',
  rowKey:'tenantId'
};

export const tenantDelete = {
  url: '/tenant/delete',
  method: 'POST',
  rowKey:'tenantId'
};

export const tenantDetail = {
  url: '/tenant/detail',
  method: 'POST',
  rowKey:'tenantId'
};

export const tenantList = {
  url: '/tenant/list',
  method: 'POST',
  rowKey:'tenantId'
};

