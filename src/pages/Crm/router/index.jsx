import React, {lazy} from 'react';
import CrmLayout from '@/pages/Crm';
import {BusinessRouter} from '@/pages/Crm/business/BusinessRouter';
import {OriginRouter} from '@/pages/Crm/origin/OriginRouter';
import {TemplateRouter} from '@/pages/Crm/template/TemplateRouter';
import {ContractRouter} from '@/pages/Crm/contract/ContractRouter';
import {CustomerRouter} from '@/pages/Crm/customer/CustomerRouter';
import {CrmCustomerLevelRouter} from '@/pages/Crm/customer/crmCustomerLevel/crmCustomerLevelRouter';
import {CrmIndustryRouter} from '@/pages/Crm/crmIndustry/crmIndustryRouter';
import {ContactsRouter} from '@/pages/Crm/contacts/ContactsRouter';
import {CompetitorRouter} from '@/pages/Crm/competitor/competitorRouter';
import {CompetitorQuoteRouter} from '@/pages/Crm/competitorQuote/competitorQuoteRouter';
import {DataRouter} from '@/pages/Crm/data/dataRouter';
import {SpeechcraftRouter} from '@/pages/Crm/speechcraft/speechcraftRouter';
import {OutstockApplyRouter} from '@/pages/Erp/outstockApply/outstockApplyRouter';
import {BusinessTrackRouter} from '@/pages/Crm/Track/businessTrackRouter';


const CrmRouterConfig = [
  {
    path: '/CRM',
    name: '营销中心',
    component: CrmLayout,
    children: [
      ...CustomerRouter,
      ...BusinessRouter,
      ...OriginRouter,
      ...TemplateRouter,
      ...ContractRouter,
      ...CrmCustomerLevelRouter,
      ...CrmIndustryRouter,
      ...ContactsRouter,
      ...CompetitorRouter,
      ...CompetitorQuoteRouter,
      ...DataRouter,
      ...SpeechcraftRouter,
      ...OutstockApplyRouter,
      ...BusinessTrackRouter,
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
      },
      {
        path: '/orderStatistics',
        component: lazy(() => import('../../Order/Statistics')),
        fallback: <div>loading...</div>,
        exact: true,
      },
      {
        redirect: '/CRM/customer',
      },
    ]
  }
];
export default CrmRouterConfig;
