import React, {useRef} from 'react';
import {createFormActions} from '@formily/antd';
import {Space} from 'antd';
import Form from '@/components/Form';
import * as SysField from '@/pages/Crm/business/crmBusinessSalesProcess/crmBusinessSalesProcessField';
import Table from '@/components/Table';
import ThousandsSeparator from '@/components/ThousandsSeparator';
import Render from '@/components/Render';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';

const {FormItem} = Form;

const formActionsPublic = createFormActions();

const OrderDetailTable = ({orderId}) => {
  const tableRef = useRef(null);

  const searchForm = () => {
    return (
      <>
        <FormItem hidden value={orderId} name="orderId" component={SysField.SalesId} />
      </>
    );
  };

  const columns = [
    {title: '物料编码', dataIndex: 'skuResult', render: (value) => <Render text={value && value.standard} />},
    {
      title: '物料信息',
      dataIndex: 'skuResult',
      render: (value) => <Render text={SkuResultSkuJsons({skuResult: value})} />
    },
    {title: '品牌', dataIndex: 'brandResult', render: (value) => <Render text={value && value.brandName || '无'} />},
    {
      title: '数量价格',
      dataIndex: 'totalPrice',
      align: 'right',
      sorter: true,
      render: (value, record) => <Space style={{marginBottom: -12}}>
        <ThousandsSeparator
          prefix={record.sign}
          value={record.onePrice}
          style={{paddingBottom: 8}}
          shopNumber
        />
        x
        <div>{record.purchaseNumber} {record.unit?.unitName}</div>
        =
        <ThousandsSeparator
          prefix={record.sign}
          valueStyle={{color: 'red'}}
          style={{paddingBottom: 8}}
          shopNumber
          value={record.totalPrice}
        />
      </Space>
    },
    {
      title: '已到货',
      align: 'right',
      width: 120,
      sorter: true,
      dataIndex: 'arrivalNumber',
      render: (value, record) => {
        return <Render style={{color: '#1677ff'}}>{value} {record.unit?.unitName}</Render>;
      }
    },
    {
      title: '已入库',
      align: 'right',
      width: 120,
      sorter: true,
      dataIndex: 'inStockNumber',
      render: (value, record) => {
        return <Render style={{color: '#52c41a'}}>{value} {record.unit?.unitName}</Render>;
      }
    }
  ];

  return (
    <div>
      <Table
        columns={columns}
        bordered={false}
        noRowSelection
        contentHeight={orderId && 'auto'}
        bodyStyle={{padding: 0}}
        headStyle={{display: 'none'}}
        api={{
          url: '/orderDetail/list',
          method: 'POST'
        }}
        maxHeight="auto"
        unsetOverflow
        formActions={formActionsPublic}
        rowKey="detailId"
        showSearchButton={false}
        searchForm={searchForm}
        ref={tableRef}
      />
    </div>
  );
};

export default OrderDetailTable;
