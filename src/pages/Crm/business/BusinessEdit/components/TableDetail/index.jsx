import React, {useRef, useState, useEffect} from 'react';
import {Button, Table as AntTable} from 'antd';
import Table from "@/pages/Crm/customer/CustomerDetail/compontents/Table";
import {crmBusinessDetailedDelete, crmBusinessDetailedList} from "@/pages/Crm/business/BusinessUrl";
import EditButton from "@/components/EditButton";
import DelButton from "@/components/DelButton";
import Drawer from "@/components/Drawer";
import * as SysField from "@/pages/Crm/business/BusinessField";
import Form from "@/components/Form";
import Items from "@/pages/Erp/instock/InstockEdit/components/Items";
import {useRequest} from "@/util/Request";
import CrmBusinessDetailedEdit from "@/pages/Crm/business/crmBusinessDetailed/crmBusinessDetailedEdit";
import ItemPackage from "@/pages/Crm/business/BusinessEdit/components/ItemPackage";

const {FormItem} = Form;
const {Column} = AntTable;


const TableDetail = (props) => {
  const {value} = props;
  const ref = useRef(null);
  const tableRef = useRef(null);
  const refAddOne = useRef();
  const refAddAll = useRef();

  const [da,setDa] = useState();
  const {data,run} = useRequest({url: '/crmBusinessDetailed/add',method: 'POST',data:da},{manual:true});

  const searchForm = () => {
    return (
      <>
        <FormItem style={{'display': 'none'}} name="businessId" value={value} component={SysField.BusinessId}/>
        <FormItem label='产品名称' name="itemId" component={SysField.itemId}/>
      </>
    );
  };

  return (
    <>
      <div style={{textAlign:'right'}}>
        <Button type="primary" className='placeName' onClick={()=>{
          refAddOne.current.open(false);}}>
          添加产品
        </Button>
        <Drawer width={1900} title="选择" component={Items}  onSuccess={() => {
          refAddOne.current.open(false);
        }} ref={refAddOne}
        allData={(data) => {
          run(
            {
              data:{
                businessId: value,
                itemId: data.itemId,
                salePrice: 0,
                totalPrice: 0,
                quantity: 0
              }
            });
          refAddOne.current.close();
          tableRef.current.refresh();
        }}/>
        <Button type="primary" className='placeName' onClick={()=>{
          refAddAll.current.open(false);}}>
          添加产品套餐
        </Button>
        <Drawer width={800} title="选择" component={ItemPackage}  onSuccess={() => {
          refAddAll.current.close();
        }} ref={refAddAll}
        allData={(data) => {
          const origin = data.map((val) => {
            return {
              businessId: value,
              itemId: val.itemId,
              salePrice: 0,
              totalPrice: 0,
              quantity: 0
            };

          });
          run(origin);
          refAddOne.current.close();
          tableRef.current.refresh();
        }}/>

      </div>
      <Table
        api={crmBusinessDetailedList}
        rowKey="id"
        searchForm={searchForm}
        ref={tableRef}
      >
        <Column title="产品名称" dataIndex="items" render={(value, record)=>{
          return (
            <div>
              {
                record.itemsResult ? record.itemsResult.name : null
              }
            </div>
          );
        }} />
        <Column title="销售单价" dataIndex="salePrice"/>
        <Column title="数量" dataIndex="quantity"/>
        <Column title="小计" dataIndex="totalPrice"/>
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.id);
              }}/>
              <DelButton api={crmBusinessDetailedDelete} value={record.id} onSuccess={() => {
                tableRef.current.refresh();
              }}/>
            </>
          );
        }} width={300}/>
      </Table>
      <Drawer width={800} title="编辑" component={CrmBusinessDetailedEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref}/>
    </>
  );
};
export default TableDetail;
