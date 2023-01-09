/**
 * 库存预警路由文件
 *
 * @author song
 * @Date 2021-07-17 10:46:08
 */

import React, {lazy} from 'react';

export const SkuMoneyRouter = [
  {
    path: '/skuMoney',
    name: '物料金额',
    component: lazy(() => import('../index')),
    fallback: <div>loading...</div>,
    exact: true,
  },
];
