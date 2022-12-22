import React, {lazy} from 'react';

const ReportConfig = [
  {
    path: '/report',
    name: '图表管理',
    children: [
      {
        path: '/reportSetting',
        component: lazy(() => import('./ReportSetting/index')),
        fallback: <div>loading...</div>,
        exact: true,
      }
    ]
  }
];
export default ReportConfig;
