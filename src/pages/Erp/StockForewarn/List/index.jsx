import React from 'react';
import {Button, Input, Select, Table as AntTable} from 'antd';
import Table from '@/components/Table';
import Breadcrumb from '@/components/Breadcrumb';
import Form from '@/components/Form';

const {Column} = AntTable;
const data = [
  {
    key: '1',
    standard: '40000001223',
    classification: '标准件',
    spu: '六角头螺栓(全螺纹)/GB/T5783-2000/M16X80-12.9',
    stockNumber: '100',
    stockup: 100,
    stockdown: '500',
    type: '已采购',
    createTime: '2022年12月1日',
  },
];

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
        label="物料名称："
        placeholder="请输入"
        style={{width: '300px'}}
        name="q"
        component={Input}/>
      <FormItem
        label="物料分类："
        name="a"
        style={{width: '300px'}}
        placeholder="请选择"
        component={Select}/>
      <FormItem
        label="预警状态："
        name="b"
        style={{width: '300px'}}
        placeholder="请选择"
        component={Select}/>
      <FormItem
        label="采购状态："
        name="c"
        style={{width: '300px'}}
        placeholder="请选择"
        component={Select}/>
    </>
  );
};
const actions = () => {

  return <>
    <Button type='primary' onClick={() => {
    }}>预警设置</Button>
  </>;
};


const List = () => {

  return <>

    <Table
      tableKey='stockForewarn'
      title={<Breadcrumb/>}
      rowKey="instockOrderId"
      searchForm={searchForm}
      actions={actions()}
      dataSource={data}
      footer={footer}
      actionButton={<>
        <Button type='link' onClick={() => {
        }}>导出全部</Button>
        <Button type='link' onClick={() => {
        }}>导出选中</Button>
      </>}
    >
      <Column title="物料编码" dataIndex="standard"/>
      <Column title="物料分类" dataIndex="classification"/>
      <Column title="物料" dataIndex="spu"/>
      <Column title="库存数量" dataIndex="stockNumber"/>
      <Column title="库存下限" dataIndex="stockup"/>
      <Column title="库存上限" dataIndex="stockdown"/>
      <Column title="采购状态" dataIndex="type"/>
      <Column title="报警时间" dataIndex="createTime"/>
      <Column title="操作" align="center" render={(value, record) => {
        return (
          <>
            <Button type='link' onClick={() => {}}>申请采购</Button>
          </>
        );
      }} width={300}/>
    </Table>
  </>;
};

export default List;
