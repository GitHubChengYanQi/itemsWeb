import React from 'react';
import {Button, Input, Select} from 'antd';
import {useHistory} from 'ice';
import Table from '@/components/Table';
import Breadcrumb from '@/components/Breadcrumb';
import Form from '@/components/Form';
import {warningSku} from '@/pages/Erp/StockForewarn/url';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';


const footer = () => {
  return (
    <Button type='link'>
      申请采购
    </Button>
  );
};

const {FormItem} = Form;
const searchForm = () => {
  return (
    <>
      <FormItem
        label="物料："
        placeholder="请输入"
        style={{width: '300px'}}
        name="material"
        component={Input}/>
      <FormItem
        label="物料分类："
        name="classification"
        style={{width: '300px'}}
        placeholder="请选择"
        component={Select}/>
      <FormItem
        label="预警状态："
        name="earlyWarning"
        style={{width: '300px'}}
        placeholder="请选择"
        component={Select}/>
      <FormItem
        label="采购状态："
        name="purchase"
        style={{width: '300px'}}
        placeholder="请选择"
        component={Select}/>
    </>
  );
};


const List = () => {

  const history = useHistory(null);

  const columns = [
    {
      title: '物料编码',width:'15%',dataIndex: 'number', render: (value, record) => {
        return (<>{record.skuResult.standard}</>);
      }
    },
    {title: '物料分类',width:'10%',dataIndex: 'name',render:(value,record)=>{
      try {
        return (record.skuResult.spuResult.spuClassificationResult.name);
      }catch (e){
        return null;
      }
    }},
    {
      title: '物料',width:'25%',dataIndex: 'skuResult', render: (value) => {
        return SkuResultSkuJsons({skuResult:value});

      }
    },
    {title: '库存数量',width:'12%',dataIndex: 'number',render(value,record){
      return record.number;
    }},
    {title: '库存下限',width:'12%', dataIndex: 'inventoryFloor'},
    {title: '库存上限',width:'12%',dataIndex: 'inventoryCeiling'},
    {title: '报警时间',width:'14%', dataIndex: 'createTime'},
    // {
    //   title: '操作',width:'10%', dataIndex: '', align: 'center', render: () => {
    //     // return (
    //     //   <>
    //     //     <Button type='link' onClick={() => {
    //     //     }}>申请采购</Button>
    //     //   </>
    //     // );
    //   }
    // }

  ];

  const actions = () => {
    return <>
      <Button type='primary' onClick={() => {
        history.push('/ERP/stockForewarn/Set');
      }}>预警设置</Button>
    </>;
  };

  return <>

    <Table
      api={warningSku}
      title={<Breadcrumb/>}
      columns={columns}
      rowKey="skuId"
      searchForm={searchForm}
      actions={actions()}
      // footer={footer}
      actionButton={<>
        <Button type='link' onClick={() => {
        }}>导出全部</Button>
        <Button type='link' onClick={() => {
        }}>导出选中</Button>
      </>}
    />
  </>;
};

export default List;
