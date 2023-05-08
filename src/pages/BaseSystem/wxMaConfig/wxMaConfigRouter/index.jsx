/**
 * 微信小程序配置表（对应租户）路由文件
 *
 * @author Captain_Jazz
 * @Date 2023-04-25 09:53:02
 */

import React, {lazy} from 'react';

export const WxMaConfigRouter = [
  {
    path: '/wxMaConfig',
    component: lazy(() => import('../wxMaConfigList')),
    fallback: <div>loading...</div>,
    exact: true,
  }
];
