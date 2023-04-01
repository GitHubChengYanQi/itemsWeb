import {lazy} from 'react';


const NetworkDiskConfig = [
  {
    path: '/networkDisk',
    name: '系统管理',
    component: lazy(() => import('./index')),
    exact: true,
  }
];
export default NetworkDiskConfig;
