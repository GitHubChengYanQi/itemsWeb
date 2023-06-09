/**
 * 路由文件
 *
 * @author
 * @Date 2021-09-07 09:50:09
 */

import React, {lazy} from 'react';

export const CompetitorRouter = [
  {
    path: '/competitor',
    name: '竞争对手管理',
    component: lazy(() => import('../competitorList/index')),
    fallback: <div>loading...</div>,
    exact: true,
  },
  {
    path: '/competitor/:cid',
    name: '竞争对手管理详情',
    component: lazy(() => import('../competitorDetails/index')),
    fallback: <div>loading...</div>,
    exact: true,
  },
];
