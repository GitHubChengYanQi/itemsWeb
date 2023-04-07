/**
 * 系统租户表路由文件
 *
 * @author Captain_Jazz
 * @Date 2023-04-07 09:26:48
 */

import React, {lazy} from 'react';

export const TenantRouter = [
  {
    path: '/tenant',
    component: lazy(() => import('../tenantList')),
    fallback: <div>loading...</div>,
    exact: true,
  }
];
