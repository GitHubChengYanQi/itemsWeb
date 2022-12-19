import React from 'react';
import {StorehouseRouter} from '@/pages/Erp/storehouse/StorehouseRouter';
import {StockRouter} from '@/pages/Erp/stock/StockRouter';
import {InstockRouter} from '@/pages/Erp/instock/InstockRouter';
import {OutstockRouter} from '@/pages/Erp/outstock/OutstockRouter';
import ErpLayout from '@/pages/Erp';
import {DeliveryRouter} from '@/pages/Erp/delivery/deliveryRouter';
import {InventoryRouter} from '@/pages/Erp/inventory/inventoryRouter';
import {StockForewarnRouter} from '@/pages/Erp/StockForewarn/route';

const ErpRouterConfig = [
  {
    path: '/ERP',
    name: '仓储管理',
    component: ErpLayout,
    children: [
      ...OutstockRouter,
      ...StorehouseRouter,
      ...StockRouter,
      ...InstockRouter,
      ...DeliveryRouter,
      ...InventoryRouter,
      ...StockForewarnRouter,
      {
        redirect: '/ERP/stock',
      }
    ]
  }
];
export default ErpRouterConfig;
