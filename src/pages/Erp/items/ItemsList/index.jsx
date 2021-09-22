/**
 * 产品表列表页
 *
 * @author
 * @Date 2021-07-14 14:04:26
 */

import React, {useRef, useState} from 'react';
import Table from '@/components/Table';
import {useHistory} from "ice";
import {Button, message, Table as AntTable} from 'antd';
import DelButton from '@/components/DelButton';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {useRequest} from '@/util/Request';
import Modal2 from '@/components/Modal';
import Breadcrumb from '@/components/Breadcrumb';
import CheckButton from '@/components/CheckButton';
import {erpPackageTableAdd} from '@/pages/Erp/packageTable/packageTableUrl';
import {crmBusinessDetailedAdd} from '@/pages/Crm/business/crmBusinessDetailed/crmBusinessDetailedUrl';
import {MegaLayout} from '@formily/antd-components';
import {createFormActions, FormButtonGroup, Submit} from '@formily/antd';
import {SearchOutlined} from '@ant-design/icons';
import Icon from '@/components/Icon';
import * as SysField from '../ItemsField';
import ItemsEdit from '../ItemsEdit';
import {addAllPackages, addAllPackagesTable, batchAdd, batchDelete, itemsDelete, itemsList} from '../ItemsUrl';
import SelButton from '@/components/SelButton';
import {contractDetailAdd} from '@/pages/Crm/contract/contractDetail/contractDetailUrl';


const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const ItemsList = (props) => {

  const {choose} = props;

  const ref = useRef(null);
  const tableRef = useRef(null);
  const [ids, setIds] = useState([]);
  const [itemsId, setItemsId] = useState([]);
  const history = useHistory();

  const { run: add} = useRequest(erpPackageTableAdd, {
    manual: true,
    onError: (error) => {
      message.error(error.message);
    },
    onSuccess: () => {
      ref.current.close();
      props.onSuccess();
    }
  });

  const { run: addTc} = useRequest(crmBusinessDetailedAdd, {
    manual: true,
    onError: (error) => {
      message.error(error.message);
    },
    onSuccess: () => {
      ref.current.close();
      props.onSuccess();
    }
  });

  const { run: addHt} = useRequest(contractDetailAdd, {
    manual: true,
    onError: (error) => {
      message.error(error.message);
    },
    onSuccess: () => {
      ref.current.close();
      props.onSuccess();
    }
  });

  let disabled = true;
  if(props.disabled === undefined){
    disabled = true;
  }else{
    disabled = false;
  }

  let TcDisabled = true;
  if(props.TcDisabled === undefined){
    TcDisabled = true;
  }else{
    TcDisabled = false;
  }

  const footer = () => {
    /**
     * 批量删除例子，根据实际情况修改接口地址
     */
    return (
      <>
        {!TcDisabled && <SelButton api={{
          ...batchAdd
        }}onSuccess={()=>{
          tableRef.current.refresh();
          props.onSuccess();
        }
        } data ={{
          businessId: props.businessId,
          itemIds: ids,
          salePrice: 0,
          totalPrice: 0,
          quantity: 1
        }} >批量选择</SelButton>}

        {props.contractId && <SelButton api={{
          ...batchAdd
        }}onSuccess={()=>{
          tableRef.current.refresh();
          props.onSuccess();
        }
        } data ={{
          contractId: props.contractId,
          itemIds: ids,
          salePrice: 0,
          totalPrice: 0,
          quantity: 1
        }} >批量选择</SelButton>}


        {!disabled && <SelButton api={{
          ...addAllPackagesTable
        }}onSuccess={()=>{
          tableRef.current.refresh();
          props.onSuccess();
        }
        } data ={{
          packageId: props.packageId,
          itemIds: ids,
          salePrice: 0,
          totalPrice: 0,
          quantity: 1
        }} >批量选择</SelButton>}
        <DelButton api={{
          ...batchDelete
        }} onSuccess={()=>{
          // tableRef.current.refresh();
          props.onSuccess();
        }
        } value={ids}>批量删除</DelButton>
      </>
    );
  };

  const actions = () => {
    return (
      <>
        <AddButton onClick={() => {
          ref.current.open(false);
        }} />
      </>
    );
  };


  const [search,setSearch] = useState(false);

  const searchForm = () => {

    const formItem = () => {
      return (
        <>
          <FormItem mega-props={{span: 1}} placeholder="重要程度" name="important" component={SysField.Name} />
          <FormItem mega-props={{span: 1}} placeholder="产品重量" name="weight" component={SysField.Name} />
          <FormItem mega-props={{span: 1}} placeholder="材质" name="materialName" component={SysField.Name} />
          <FormItem mega-props={{span: 1}} placeholder="易损" name="vulnerability" component={SysField.Name} />
        </>
      );
    };

    return (
      <div style={{maxWidth:800}}>
        <MegaLayout responsive={{s: 1,m:2,lg:2}} labelAlign="left" layoutProps={{wrapperWidth:200}} grid={search} columns={4} full autoRow>
          <FormItem mega-props={{span: 1}} placeholder="产品名称" name="name" component={SysField.Name} />
          {search ? formItem() : null}

        </MegaLayout>
      </div>
    );
  };

  const Search = () => {
    return (
      <>
        <MegaLayout>
          <FormButtonGroup>
            <Submit><SearchOutlined />查询</Submit>
            <Button type='link' title={search ? '收起高级搜索' : '展开高级搜索'} onClick={() => {
              if (search) {
                setSearch(false);
              } else {
                setSearch(true);
              }
            }}>  <Icon type={search ? 'icon-shouqi' : 'icon-gaojisousuo'} />{search ? '收起' : '高级'}</Button>
          </FormButtonGroup>
        </MegaLayout>
      </>
    );
  };

  return (
    <>
      <Table
        title={<Breadcrumb />}
        api={itemsList}
        isModal={false}
        rowKey="itemId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
        SearchButton={Search()}
        layout={search}
        formActions={formActionsPublic}
        onChange={(keys)=>{
          setIds(keys);
        }}
        footer={footer}
      >
        <Column title="产品名字" fixed dataIndex="name" sorter
          render={(value, row) => {
            return (
              <Button type="link" onClick={() => {
                setItemsId(row.itemId);
                history.push(`/ERP/parts/${row.itemId}`);
              }}>{row.name}</Button>
            );
          }}/>

        <Column title="质保期" width={120} align='center' dataIndex="shelfLife" sorter/>
        <Column title="产品库存" width={120} align='center' dataIndex="inventory" sorter/>
        <Column title="生产日期" width={200} dataIndex="productionTime" sorter/>
        <Column title="重要程度" width={120} align='center' dataIndex="important" sorter/>
        <Column title="产品重量" width={120} align='center' dataIndex="weight" sorter />
        <Column title="材质" width={150} align='center' dataIndex="materialName" sorter render={(value,record)=>{
          return (
            <>
              {
                record.materialResult ? record.materialResult.name : null
              }
            </>
          );
        }}/>
        <Column title="成本" width={120} align='center' dataIndex="cost" sorter />
        <Column title="易损" width={120} align='center' dataIndex="vulnerability" render={(value)=>{
          return (
            <>
              {value === 0 ? '易损' : '不易损'}
            </>
          );
        }} sorter />
        <Column title="操作" fixed="right" width={ 200 }  align="right" render={(value, record) => {
          return (
            <>
              {choose ? <CheckButton onClick={()=>{
                choose(record);
                props.onSuccess();
              }} /> : null}
              {!disabled&&
              <CheckButton onClick={() => {
                add(
                  {
                    data: {
                      packageId: props.packageId,
                      itemId: record.itemId,
                      salePrice: 0,
                      totalPrice: 0,
                      quantity: 1
                    }
                  }
                );

              }}/>}
              {!TcDisabled&&
              <CheckButton onClick={() => {
                addTc(
                  {
                    data: {
                      businessId: props.businessId,
                      itemId: record.itemId,
                      salePrice: 0,
                      totalPrice: 0,
                      quantity: 1
                    }
                  }
                );
              }}/>}
              {props.contractId &&
              <CheckButton onClick={() => {
                addHt(
                  {
                    data: {
                      contractId: props.contractId,
                      itemId: record.itemId,
                      salePrice: 0,
                      totalPrice: 0,
                      quantity: 1
                    }
                  }
                );
              }}/>}
              <EditButton onClick={() => {ref.current.open(record.itemId);}} />
              <DelButton api={itemsDelete} value={record.itemId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} />
      </Table>
      <Modal2 width={800} component={ItemsEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref}/>
    </>
  );
};

export default ItemsList;
