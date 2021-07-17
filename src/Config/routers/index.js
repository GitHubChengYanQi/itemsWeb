import React, {lazy} from 'react';
import BasicLayout from '@/layouts/BasicLayout';
import baseSystem from './baseSystem';
import bomRouterConfig from '@/pages/DaoxinBOM/router';
import STOCKRouterConfig from '@/pages/DaoXinSTOCK/router';
import ClientRouterConfig from '@/pages/DaoXinClient/router';

const routerConfig = [
  {
    path: '/login',
    name: '登录',
    component: lazy(() => import((`@/pages/Login`))),// Login,
  },
  {
    path: '/logout',
    component: lazy(() => import((`@/pages/Logout`))),
  },
  {
    path: '/',
    name: 'Home',
    component: BasicLayout,
    children: [
      ...ClientRouterConfig,
      ...STOCKRouterConfig,
      ...baseSystem,
      ...bomRouterConfig,
      {
        path: '/member',
        component: lazy(() => import((`@/pages/Member`))),
      },
      {
        component: lazy(() => import((`@/pages/NotFound`))),
      }
    ],
  },
];

export default routerConfig;
