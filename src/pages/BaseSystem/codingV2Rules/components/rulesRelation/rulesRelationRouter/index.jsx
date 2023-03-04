/**
 * 编码规则和模块的对应关系路由文件
 *
 * @author song
 * @Date 2021-10-25 14:05:08
 */

import React, {lazy} from 'react';

export const RulesRelationRouter = [
  {
    path: '/rulesRelation',
    component: lazy(() => import('../rulesRelationList')),
    fallback: <div>loading...</div>,
    exact: true,
  }
];
