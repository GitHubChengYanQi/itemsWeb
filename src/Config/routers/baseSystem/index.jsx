import { lazy } from 'react';
import BaseSystem from '@/pages/BaseSystem';
import { GenRouter } from '@/pages/BaseSystem/gen/GenRouter';
import { LoginLogRouter } from '@/pages/BaseSystem/loginLog/loginLogRouter';
import { SysDeptRouter } from '@/pages/BaseSystem/sysDept/sysDeptRouter';
import {ConfigRouter} from '@/pages/BaseSystem/config/configRouter';
import {CodingRulesRouter} from '@/pages/BaseSystem/codingRules/codingRulesRouter';
import {OperationLogRouter} from '@/pages/BaseSystem/operationLog/operationLogRouter';
import {ProductionStationRouter} from '@/pages/BaseSystem/productionStation/productionStationRouter';
import DesignConfig from '@/pages/Design/router';

const systemConfig = [

  {
    path: '/BASE_SYSTEM',
    name: '设置',
    component: BaseSystem,
    children: [
      ...SysDeptRouter,
      ...LoginLogRouter,
      ...GenRouter,
      ...ConfigRouter,
      ...CodingRulesRouter,
      ...OperationLogRouter,
      ...ProductionStationRouter,
      ...DesignConfig,
      {
        path: '/enterprise',
        name: '企业信息',
        component: lazy(() => import('@/pages/BaseSystem/Enterprise/index')),
        exact: true,
      },
      {
        path: '/mgr',
        name: '用户管理',
        component: lazy(() => import('@/pages/BaseSystem/user/UserList')),
        exact: true,
      },
      {
        path: '/role',
        name: '用户管理',
        component: lazy(() => import('@/pages/BaseSystem/role/RoleList')),
        exact: true,
      },
      {
        path: '/dept',
        name: '部门管理',
        component: lazy(() => import('@/pages/BaseSystem/dept/DeptList')),
        exact: true,
      },
      {
        path: '/position',
        name: '职位管理',
        component: lazy(() => import('@/pages/BaseSystem/position/PositionList')),
        exact: true,
      },
      {
        path: '/menu',
        name: '菜单管理',
        component: lazy(() => import('@/pages/BaseSystem/menu/MenuList')),
        exact: true,
      },

      {
        path: '/dictType',
        name:'字典管理',
        component: lazy(() => import('@/pages/BaseSystem/dictType/List')),
        exact: true,
      },
      {
        path: '/dictType/purchaseConfig',
        name:'采购配置管理',
        component: lazy(() => import('@/pages/BaseSystem/dictType/components/purchaseConfig/purchaseConfigList')),
      },
      {
        path: '/dictType/:dictTypeId',
        name:'字典管理',
        component: lazy(() => import('@/pages/BaseSystem/dictType/dict/List')),
      },
      {
        path: '/swagger',
        name: '接口文档',
        component: lazy(() => import('@/pages/BaseSystem/swagger')),
        exact: true
      },
      {
        path: '/swagger/:module/:action',
        name: '接口文档',
        component: lazy(() => import('@/pages/BaseSystem/swagger')),
      },
      {
        redirect: '/BASE_SYSTEM/enterprise',
      }
    ]
  },
];
export default systemConfig;
