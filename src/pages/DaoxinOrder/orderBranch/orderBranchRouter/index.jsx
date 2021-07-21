/**
 * 订单分表路由文件
 *
 * @author ta
 * @Date 2021-07-20 16:22:28
 */

import React, {lazy} from 'react';

export const OrderBranchRouter = [
  {
    path: '/orderBranch',
    component: lazy(() => import('../orderBranchList')),
    fallback: <div>loading...</div>,
    exact: true,
  }
];
