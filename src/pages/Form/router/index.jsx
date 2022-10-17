import {lazy} from 'react';


const FormConfig = [
  {
    path: '/form',
    name: '表单管理',
    component: lazy(() => import('../list.jsx')),
    exact: true,
  },
];
export default FormConfig;
