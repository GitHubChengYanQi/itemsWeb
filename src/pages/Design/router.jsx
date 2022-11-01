import React, {lazy} from 'react';


const DesignConfig = [
  {
    path: '/Design',
    name: '设计中心',
    component: lazy(() => import('./index')),
    exact: true,
  },
  {
    path: '/Design/setting',
    name:'设计中心',
    component: lazy(() => import('../BaseSystem/Documents/Setting/index')),
    fallback: <div>loading...</div>,
    exact: true,
  },{
    path: '/Design/permissions',
    name:'设计中心',
    component: lazy(() => import('../BaseSystem/Documents/Permissions/index')),
    fallback: <div>loading...</div>,
    exact: true,
  }
];
export default DesignConfig;
