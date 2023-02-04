/**
 * 编码规则分类路由文件
 *
 * @author song
 * @Date 2021-10-22 17:20:05
 */

import React, {lazy} from 'react';

export const CodingRulesClassificationRouter = [
  {
    path: '/codingRulesClassification',
    component: lazy(() => import('../codingRulesClassificationList')),
    fallback: <div>loading...</div>,
    exact: true,
  }
];
