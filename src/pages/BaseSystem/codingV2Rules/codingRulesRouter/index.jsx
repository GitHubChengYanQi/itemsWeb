/**
 * 编码规则路由文件
 *
 * @author song
 * @Date 2021-10-22 17:20:05
 */

import React, {lazy} from 'react';

export const CodingV2RulesRouter = [
  {
    path: '/codingRule',
    component: lazy(() => import('../codingRulesList')),
    fallback: <div>loading...</div>,
    exact: true,
  }
];
