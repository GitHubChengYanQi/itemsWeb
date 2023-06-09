/**
 * 产品订单详情路由文件
 *
 * @author song
 * @Date 2021-10-20 16:18:02
 */

import React, {lazy} from 'react';

export const ProductOrderDetailsRouter = [
  {
    path: '/productOrderDetails',
    component: lazy(() => import('../productOrderDetailsList')),
    fallback: <div>loading...</div>,
    exact: true,
  }
];
