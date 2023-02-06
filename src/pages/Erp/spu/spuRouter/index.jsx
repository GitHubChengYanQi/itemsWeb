/**
 * 路由文件
 *
 * @author
 * @Date 2021-10-18 14:14:21
 */

import React, {lazy} from 'react';

export const SPUSRouter = [
  {
    path: '/SPUS',
    name:'产品管理',
    component: lazy(() => import('../spuList')),
    fallback: <div>loading...</div>,
    exact: true,
  },
  {
    path: '/SPUS/detail/:cid',
    component: lazy(() => import('../components/SpuDetail/index')),
    fallback: <div>loading...</div>,
    exact: true,
  }
];
