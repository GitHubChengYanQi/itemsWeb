import React, {lazy} from 'react';
import {PurchaseAskRouter} from '@/pages/Purshase/purchaseAsk/purchaseAskRouter';
import PurshaseLayout from '@/pages/Purshase';
import {SupplyListingRouter} from '@/pages/Purshase/Supply/router';
import {ToBuyPlanRouter} from '@/pages/Purshase/ToBuyPlan/router';
import {ProcurementPlanRouter} from '@/pages/Purshase/procurementPlan/procurementPlanRouter';
import {PurchaseQuotationRouter} from '@/pages/Purshase/purchaseQuotation/purchaseQuotationRouter';
import {InquiryTaskRouter} from '@/pages/Purshase/inquiryTask/inquiryTaskRouter';

const PurshaseRouterConfig = [
  {
    path: '/purchase',
    name: '采购管理',
    component: PurshaseLayout,
    children: [
      ...PurchaseAskRouter,
      ...SupplyListingRouter,
      ...ToBuyPlanRouter,
      ...ProcurementPlanRouter,
      ...PurchaseQuotationRouter,
      ...InquiryTaskRouter,
      {
        path: '/order',
        component: lazy(() => import('../../Order/Table/index')),
        fallback: <div>loading...</div>,
        exact: true,
      }, {
        path: '/order/createOrder',
        component: lazy(() => import('../../Order/CreateOrder/index')),
        fallback: <div>loading...</div>,
        exact: true,
      }, {
        path: '/order/detail',
        component: lazy(() => import('../../Order/Detail')),
        fallback: <div>loading...</div>,
        exact: true,
      }, {
        path: '/orderStatistics',
        component: lazy(() => import('../../Order/Statistics')),
        fallback: <div>loading...</div>,
        exact: true,
      }, {
        redirect: '/purchase/supply',
      },
    ]
  }
];
export default PurshaseRouterConfig;
