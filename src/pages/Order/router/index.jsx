/**
 * 订单路由文件
 *
 * @author song
 * @Date 2021-12-15 09:35:37
 */

import React, {lazy} from 'react';

export const OrderRouter = [
  {
    path: '/order',
    component: lazy(() => import('../Table/index')),
    fallback: <div>loading...</div>,
    exact: true,
  },
  {
    path: '/order/createOrder',
    name: '预购管理',
    component: lazy(() => import('../CreateOrder/index')),
    fallback: <div>loading...</div>,
    exact: true,
  }
];
