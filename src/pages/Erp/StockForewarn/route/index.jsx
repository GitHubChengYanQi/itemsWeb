/**
 * 库存预警路由文件
 *
 * @author song
 * @Date 2021-07-17 10:46:08
 */

import React, {lazy} from 'react';

export const StockForewarnRouter = [
  {
    path: '/stockForewarn',
    name: '库存预警',
    component: lazy(() => import('../Set/index')),
    fallback: <div>loading...</div>,
    exact: true,
  }
];
