import React, {useState} from 'react';
import {Button, List, Popconfirm, Select, Space} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import InputNumber from '@/components/InputNumber';
import {useRequest} from '@/util/Request';
import Message from '@/components/Message';
import Note from '@/components/Note';
import {SkuRender} from '@/pages/Erp/sku/components/SkuRender';

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

  const skuResult = sku.skuResult || {};

  const purchaseNumber = sku.inventoryFloor - sku.number;
  const waitNumber = purchaseListList.length > 0;

  const [data, setData] = useState({
    number: purchaseNumber - sku.floatingCargoNumber > 0 ? purchaseNumber - sku.floatingCargoNumber : 1,
  });

  const [select, setSelect] = useState({});

  const [numStatus, setNumStatus] = useState();

  const [action, setAction] = useState(waitNumber ? null : 'add');
  const [edit, setEdit] = useState({});

  const [open, setOpen] = useState(false);


  const {loading: supplyBrandLoading, data: supplyBrands = []} = useRequest({
    ...getSupplyBySkuIds,
    data: {skuId: sku.skuId}
  });

  const {loading: addLoading, run: add} = useRequest(purchaseListAdd, {
    manual: true,
    response: true,
    onSuccess(res) {
      if (res.errCode === 1001) {
        setOpen(res.message);
      } else {
        onSuccess();
      }
    }
  });

  const {loading: editLoading, run: editRun} = useRequest(purchaseListEdit, {
    manual: true,
    onSuccess
  });

  const supplys = [];
  supplyBrands.forEach(item => {
    const res =  data.brandId ? item.brandId === data.brandId : true;
    if (res && !supplys.find(supplysItem => supplysItem.customerId === item.customerId)) {
      supplys.push(item);
    }
  });
  const brands = [];
  supplyBrands.forEach(item => {
    const res = data.customerId ? item.customerId === data.customerId : true;
    if (res && !brands.find(brandItem => brandItem.brandId === item.brandId)) {
      brands.push(item);
    }
  });

  if (waitNumber && !action) {
    return <div>
      <List
        size="small"
        header={<Space style={{color: '#000', fontSize: 16}}><ExclamationCircleOutlined style={{color: '#257bde'}} />物料已经待采购！</Space>}
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
        <div style={{width: 100, textAlign: 'right'}}><span style={{color: 'red'}}> * </span>采购数量：</div>
        <InputNumber
          min={0}
          status={numStatus}
          value={data.number}
          style={{width: 200}}
          placeholder="请输入采购数量"
          onChange={(number) => {
            setNumStatus(number <= 0 && 'error');
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
                const supplys = supplyBrands.filter(item => item.brandId === brandId);
                setData({...data, brandId, customerId: supplys.length === 1 ? supplys[0].customerId : data.customerId});
                setSelect({...select,customer: supplys.length === 1 ? true : select.customer});
              }}
            />
            :
            <Button style={{padding: 0}} type="link" onClick={() => {
              const supplys = supplyBrands.filter(item => (brands.length === 1 ? item.brandId === brands[0].brandId : true));
              setData({
                ...data,
                brandId: brands.length === 1 ? brands[0].brandId : null,
                customerId: (brands.length === 1 && supplys.length === 1) ? supplys[0].customerId : data.customerId
              });
              setSelect({
                ...select,
                brand: true,
                customer: (brands.length === 1 && supplys.length === 1) ? true : select.customer
              });
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
                const brands = supplyBrands.filter(item => item.customerId === customerId);
                setData({
                  ...data,
                  customerId,
                  brandId: brands.length === 1 ? brands[0].brandId : data.brandId,
                });
                setSelect({...select,brand: brands.length === 1 ? true : select.brand});
              }}
            />
            :
            <Button
              style={{padding: 0}}
              type="link"
              onClick={() => {
                const brands = supplyBrands.filter(item => (supplys.length === 1 ? item.customerId === supplys[0].customerId : true));
                setData({
                  ...data,
                  customerId: supplys.length === 1 ? supplys[0].customerId : null,
                  brandId: (supplys.length === 1 && brands.length === 1) ? brands[0].brandId : data.brandId,
                });
                setSelect({
                  ...select,
                  customer: true,
                  brand: (supplys.length === 1 && brands.length === 1) ? true : select.brand
                });
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
              add({
                data: {...data, skuId: sku.skuId, checked: true}
              });
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
                if (data.number <= 0) {
                  setNumStatus('error');
                  Message.warning('请输入数量!');
                  return;
                }
                if (action === 'add') {
                  add({
                    data: {...data, skuId: sku.skuId, checked: false}
                  });
                } else {
                  editRun({
                    data: {...edit, ...data, checked: false}
                  });
                }
              }}
            >确定</Button>
          </Popconfirm>
        </Space>
      </div>
    </div>
  </>;
};

export default CreatePrePurchase;
