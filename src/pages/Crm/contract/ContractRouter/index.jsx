/**
 * 合同表路由文件
 *
 * @author
 * @Date 2021-07-21 13:36:21
 */

import React, {lazy} from 'react';

export const ContractRouter = [
  {
    path: '/contract',
    name: '合同管理',
    component: lazy(() => import('../ContractList/index')),
    fallback: <div>loading...</div>,
    exact: true,
  },{
    path: '/contract/detail',
    name: '合同详情',
    component: lazy(() => import('../Detail')),
    fallback: <div>loading...</div>,
    exact: true,
  },
];
