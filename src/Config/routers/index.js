import React, {lazy} from 'react';
import CrmRouterConfig from '@/pages/Crm/router';
import ErpRouterConfig from '@/pages/Erp/router';
import BasicLayout from '@/layouts/BasicLayout';
import ProtalRouterConfig from '@/pages/Portal/router';
import ShopRouterConfig from '@/pages/Shop/router';
import UserInfoRouterConfig from '@/pages/UserInfo/router';
import RepairRouterConfig from '@/pages/Repair/router';
import ProductionRouterConfig from '@/pages/Production/router';
import SpuRouterConfig from '@/pages/SPU/router';
import WorkflowConfig from '@/pages/Workflow/router';
import baseSystem from './baseSystem';
import PurshaseRouterConfig from '@/pages/Purshase/router';
import ProcessRouterConfig from '@/pages/Process/route';
import ResearchRouterConfig from '@/pages/ReSearch/route';


const routerConfig = [
  {
    path: '/login',
    name: '登录',
    component: lazy(() => import(('@/pages/Login'))),// Login,
  },
  {
    path: '/logout',
    component: lazy(() => import(('@/pages/Logout'))),
  },
  {
    path: '/',
    name: 'Home',
    component: BasicLayout,
    children: [
      ...WorkflowConfig,
      ...CrmRouterConfig,
      ...ErpRouterConfig,
      ...baseSystem,
      ...ProtalRouterConfig,
      ...ShopRouterConfig,
      ...UserInfoRouterConfig,
      ...RepairRouterConfig,
      ...ProductionRouterConfig,
      ...SpuRouterConfig,
      ...PurshaseRouterConfig,
      ...ProcessRouterConfig,
      ...ResearchRouterConfig,
      {
        path: '/test',
        component: lazy(() => import('@/pages/Test')),
        fallback: <div>loading...</div>,
        exact: true,
      },
      {
        path: '/form/config',
        name: '表单设置',
        component: lazy(() => import('@/pages/Form/DiyForm')),
        exact: true,
      },
      {
        path: '/member',
        component: lazy(() => import(('@/pages/Member'))),
      },
      {
        path: '/',
        component: lazy(() => import(('@/pages/Overview'))),
      },
      {
        component: lazy(() => import(('@/pages/NotFound'))),
      }
    ],
  },
];

export default routerConfig;
