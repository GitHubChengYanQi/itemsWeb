import {Button, Input, message, Table as AntTable} from 'antd';
import Form from '@/components/Form';
import React, {useRef, useState} from 'react';
import * as SysField from '@/pages/Erp/items/ItemsField';
import CheckButton from '@/components/CheckButton';
import {batchDelete, erpPackageDelete, erpPackageList} from '@/pages/Erp/package/packageUrl';
import {useRequest} from "@/util/Request";
import TableList from "@/pages/Erp/package/packageList/components/TableList";
import {erpPackageTableList} from "@/pages/Erp/packageTable/packageTableUrl";
import {crmBusinessDetailedAdd} from "@/pages/Crm/business/crmBusinessDetailed/crmBusinessDetailedUrl";
import Modal2 from "@/components/Modal";
import Table from '@/components/Table';
import AddButton from '@/components/AddButton';
import DelButton from '@/components/DelButton';
import EditButton from '@/components/EditButton';
import Modal from '@/components/Modal';
import ErpPackageEdit from '@/pages/Erp/package/packageEdit';
import {addAllPackages, batchAdd} from '@/pages/Erp/items/ItemsUrl';
import SelButton from '@/components/SelButton';

const {Column} = AntTable;
const {FormItem} = Form;

const ItemPackage = (props) => {

  const [ids, setIds] = useState([]);
  const [PackageId, setPackageId] = useState();
  const searchForm = () => {
    return (
      <>
        <FormItem label="套餐名称" name="name" component={SysField.Name} />
      </>
    );
  };

  const ref = useRef(null);
  const tableRef = useRef(null);
  const MxRef = useRef(null);
  const {run:add} = useRequest(crmBusinessDetailedAdd,{manual:true,
    onError: (error) => {
      message.error(error.message);
    },
    onSuccess: () => {
      MxRef.current.close();
      // props.onChange(props.businessId);
      props.onSuccess();
    }});

  const {run:select} = useRequest(erpPackageTableList,
    {manual: true,
      onError: (error) => {
        message.error(error.message);
      },
      onSuccess: (response) => {
        response.forEach((value) => {
          add({
            data:{
              businessId: props.businessId,
              itemId: value.itemId,
              salePrice: 0,
              totalPrice: 0,
              quantity: 0
            }
          });
        });
      }
    });

  const actions = () => {
    return (
      <>
        <AddButton onClick={() => {
          ref.current.open(false);
        }} />
      </>
    );
  };

  const footer = () => {
    /**
     * 批量删除例子，根据实际情况修改接口地址
     */
    return (
      <>
        <SelButton api={{
          ...addAllPackages
        }}onSuccess={()=>{
          tableRef.current.refresh();
          props.onSuccess();
        }
        } data ={{
          businessId: props.businessId,
          packagesIds: ids,
          salePrice: 0,
          totalPrice: 0,
          quantity: 0
        }} >批量选择</SelButton>
        <DelButton api={{
          ...batchDelete
        }} value={ids}>批量删除</DelButton>
      </>
    );
  };

  return (
    <>
      <Table
        api={erpPackageList}
        rowKey="packageId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
        listHeader={false}
        footer={footer}
        onChange={(keys)=>{
          setIds(keys);
        }}

      >
        <Column title="套餐名称" dataIndex="productName" render={(value, record) => {
          return (
            <Button type="link" onClick={() => {
              setPackageId(record.packageId);
              MxRef.current.open(false);
            }}>{record.productName}</Button>
          );
        }}/>
        <Column title="操作" align="right" render={(value, record) => {
          return (
            <>
              <CheckButton onClick={() => {
                select({data:{packageId:record.packageId}});
              }}/>
              <EditButton onClick={() => {
                ref.current.open(record.packageId);
              }} />
              <DelButton api={erpPackageDelete} value={record.packageId} onSuccess={() => {
                // run(record.packageId);
                tableRef.current.refresh();
              }} />
            </>
          );
        }}/>
      </Table>
      <Modal width={900} title="套餐" component={ErpPackageEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref} />
      <Modal2 width={900}  title="套餐明细" component={TableList} packageId={PackageId} onSuccess={() => {
        // ref.current.refresh();
        ref.current.close();
      }} ref={MxRef} />
    </>
  );
};

export default ItemPackage;
