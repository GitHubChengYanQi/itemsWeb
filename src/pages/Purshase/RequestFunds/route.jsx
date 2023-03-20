/**
 * 询价任务路由文件
 *
 * @author cheng
 * @Date 2022-01-17 09:29:56
 */

import React, {lazy} from 'react';

export const RequestFundsRouter = [
  {
    path: '/requestFunds',
    name: '请款申请列表',
    component: lazy(() => import('./RequestFundsAdd/index')),
    fallback: <div>loading...</div>,
    exact: true,
  },
  {
    path: '/requestFundsAdd',
    name: '请款申请',
    component: lazy(() => import('./RequestFundsAdd/index')),
    fallback: <div>loading...</div>,
    exact: true,
  },
];
