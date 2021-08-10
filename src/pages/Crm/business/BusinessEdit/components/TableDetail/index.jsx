import React, {useRef, useState, useEffect} from 'react';
import {Button, Table as AntTable} from 'antd';
import Table from "@/pages/Crm/customer/CustomerDetail/compontents/Table";
import {crmBusinessDetailedDelete, crmBusinessDetailedList} from "@/pages/Crm/business/BusinessUrl";
import EditButton from "@/components/EditButton";
import DelButton from "@/components/DelButton";
import Drawer from "@/components/Drawer";
import * as SysField from "@/pages/Crm/business/BusinessField";
import Form from "@/components/Form";
import Modal2 from '@/components/Modal';
import {useRequest} from "@/util/Request";
import CrmBusinessDetailedEdit from "@/pages/Crm/business/crmBusinessDetailed/crmBusinessDetailedEdit";
import ItemPackage from "@/pages/Crm/business/BusinessEdit/components/ItemPackage";
import ItemsList from "@/pages/Erp/items/ItemsList";
import ErpPackageList from "@/pages/Erp/erpPackage/erpPackageList";

const {FormItem} = Form;
const {Column} = AntTable;


const TableDetail = (props) => {
  const {value} = props;
  const ref = useRef(null);
  const tableRef = useRef(null);
  const refAddOne = useRef(null);
  const refAddAll = useRef(null);

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
        <Modal2 width={1900} title="选择" component={ItemsList}
          onSuccess={() => {
            refAddOne.current.close();
            tableRef.current.refresh();
          }} ref={refAddOne}
          businessId={value}
          TcDisabled={false}
        />
        <Button type="primary" className='placeName' onClick={()=>{
          refAddAll.current.open(false);
        }}>
          添加产品套餐
        </Button>
        <Modal2 width={800} title="选择" component={ErpPackageList}
          onSuccess={() => {
            refAddAll.current.close();
            tableRef.current.refresh();
          }} ref={refAddAll}
          disabled={false}
          businessId={value}
        />

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