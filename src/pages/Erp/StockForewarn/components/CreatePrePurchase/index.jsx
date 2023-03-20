import React from 'react';
import {Button, List, Popconfirm, Select, Space} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {UseStockForewarn} from 'MES-Apis/lib/StockForewarn/hooks';
import InputNumber from '@/components/InputNumber';
import Note from '@/components/Note';
import {SkuRender} from '@/pages/Erp/sku/components/SkuRender';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';

export const purchaseListAdd = {url: '/purchaseList/add', method: 'POST'};
export const purchaseListEdit = {url: '/purchaseList/edit', method: 'POST'};
export const purchaseListListBySkuId = {url: '/purchaseList/listBySkuId', method: 'GET'};
export const getSupplyBySkuIds = {url: '/supply/getSupplyBySkuIds', method: 'POST'};

const CreatePrePurchase = ({
  sku,
  onCancel = () => {
  },
  onSuccess = () => {
  },
  purchaseListList = []
}) => {

  const {
    purchaseNumber = 0,
    data = {},
    setData = () => {
    },
    supplys,
    brands,
    select,
    edit,
    selectBrandId,
    openBrand,
    action,
    selectCustomerId,
    openCustomer,
    addPickPurchase,
    addLoading,
    editLoading,
    open,
    setOpen,
    setAction,
    startReserve,
    setEdit,
    waitNumber,
  } = UseStockForewarn.Reserve({sku, purchaseListList, onSuccess});

  if (waitNumber && !action) {
    return <div>
      <List
        size="small"
        header={<Space style={{color: '#000', fontSize: 16}}><ExclamationCircleOutlined style={{color: '#257bde'}} />已备物料</Space>}
        footer={<Button onClick={() => {
          setAction('add');
          const number = purchaseNumber - sku.floatingCargoNumber > 0 ? purchaseNumber - sku.floatingCargoNumber : 1;
          setData({number: number - (sku.purchaseNumber || 0) > 0 ? number - (sku.purchaseNumber || 0) : number});
        }}>
          新增待采购
        </Button>}
        dataSource={[{}, ...purchaseListList]}
        renderItem={(item, index) => {
          if (index === 0) {
            return <List.Item>
              <Space>
                <Note width={200}>物料</Note>
                <Note width={100}>品牌</Note>
                <Note width={100}>供应商</Note>
                <Note width={50}>数量</Note>
              </Space>
            </List.Item>;
          }
          return <List.Item
            actions={[<Button type="link" onClick={() => {
              setAction('edit');
              setEdit(item);
              setData({...item});
            }}>
              修改
            </Button>]}
          >
            <Space>
              <Note width={200}>{SkuRender(item.skuResult)}</Note>
              <Note width={100}>{item.brandResult?.brandName || '任意'}</Note>
              <Note width={100}>{item.customerResult?.customerName || '任意'}</Note>
              <Note width={50}>{item.number || 0}</Note>
            </Space>
          </List.Item>;
        }}
      />
    </div>;
  }

  return <>
    <div>
      <div style={{padding: '12px 50px', display: 'flex', alignItems: 'center'}}>
        <div style={{width: 100, textAlign: 'right'}}><span style={{color: 'red'}}> * </span>物料：</div>
        {SkuResultSkuJsons({skuResult: sku.skuResult})}
      </div>
      <div style={{padding: '12px 50px', display: 'flex', alignItems: 'center'}}>
        <div style={{width: 100, textAlign: 'right'}}><span style={{color: 'red'}}> * </span>采购数量：</div>
        <InputNumber
          min={1}
          value={data.number}
          style={{width: 200}}
          placeholder="请输入采购数量"
          onChange={(number) => {
            setData({...data, number});
          }}
        />
      </div>
      <div style={{padding: '12px 50px', display: 'flex', alignItems: 'center'}}>
        <div style={{width: 100, textAlign: 'right'}}>品牌：</div>
        <div hidden={action === 'edit'}>
          {select.brand ?
            <Select
              allowClear
              value={data.brandId}
              style={{width: 200}}
              placeholder="请选择品牌"
              options={brands.map(item => ({label: item.brandResult?.brandName, value: item.brandId}))}
              onChange={(brandId) => {
                selectBrandId(brandId);
              }}
            />
            :
            <Button style={{padding: 0}} type="link" onClick={() => {
              openBrand();
            }}>请选择品牌</Button>}
        </div>
        <div hidden={action !== 'edit'}>
          {edit.brandResult?.brandName || '任意'}
        </div>
      </div>
      <div style={{padding: '12px 50px', display: 'flex', alignItems: 'center'}}>
        <div style={{width: 100, textAlign: 'right'}}>供应商：</div>
        <div hidden={action === 'edit'}>
          {select.customer ?
            <Select
              allowClear
              options={supplys.map(item => ({value: item.customerId, label: item.customerResult?.customerName}))}
              value={data.customerId}
              style={{width: 200}}
              placeholder="请选择供应商"
              onChange={(customerId) => {
                selectCustomerId(customerId);
              }}
            />
            :
            <Button
              style={{padding: 0}}
              type="link"
              onClick={() => {
                openCustomer();
              }}>请选择供应商</Button>}
        </div>
        <div hidden={action !== 'edit'}>
          {edit.customerResult?.customerName || '任意'}
        </div>
      </div>
      <div style={{textAlign: 'center', paddingTop: 8}}>
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Popconfirm
            open={open}
            placement="top"
            title={open}
            onConfirm={() => {
              setOpen(false);
              addPickPurchase();
            }}
            onCancel={() => {
              setAction(null);
              setOpen(false);
            }}
            okText="是"
            cancelText="否"
          >
            <Button
              type="primary"
              loading={addLoading || editLoading}
              onClick={() => {
                startReserve();
              }}
            >确定</Button>
          </Popconfirm>
        </Space>
      </div>
    </div>
  </>;
};

export default CreatePrePurchase;
