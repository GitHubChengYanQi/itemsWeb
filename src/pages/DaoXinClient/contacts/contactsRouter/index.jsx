/**
 * 联系人表路由文件
 *
 * @author 
 * @Date 2021-07-23 10:06:12
 */

import React, {lazy} from 'react';

export const ContactsRouter = [
  {
    path: '/contacts',
    component: lazy(() => import('../contactsList')),
    fallback: <div>loading...</div>,
    exact: true,
  }
];
