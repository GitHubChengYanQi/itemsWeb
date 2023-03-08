import {Button, Input, message, Modal as AntModal, Table as AntTable} from 'antd';
import Form from '@/components/Form';
import React, {useRef, useState} from 'react';
import * as SysField from '@/pages/Erp/items/ItemsField';
import CheckButton from '@/components/CheckButton';
import {batchDelete, erpPackageDelete, erpPackageList} from '@/pages/Erp/package/packageUrl';
import {useRequest} from '@/util/Request';
import TableList from '@/pages/Erp/package/packageList/components/TableList';
import {erpPackageTableList} from '@/pages/Erp/packageTable/packageTableUrl';
import {crmBusinessDetailedAdd} from '@/pages/Crm/business/crmBusinessDetailed/crmBusinessDetailedUrl';
import Table from '@/components/Table';
import AddButton from '@/components/AddButton';
import DelButton from '@/components/DelButton';
import EditButton from '@/components/EditButton';
import Modal from '@/components/Modal';
import ErpPackageEdit from '@/pages/Erp/package/packageEdit';
import {addAllPackages, batchAdd} from '@/pages/Erp/items/ItemsUrl';
import SelButton from '@/components/SelButton';
import {createFormActions} from '@formily/antd';
import {contractDetailAdd} from '@/pages/Crm/contract/contractDetail/contractDetailUrl';
import {SelectOutlined} from '@ant-design/icons';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

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
  const {run: add} = useRequest(crmBusinessDetailedAdd, {
    manual: true,
    onError: (error) => {
      message.error(error.message);
    },
    onSuccess: () => {
      MxRef.current.close();
      // props.onChange(props.businessId);
      props.onSuccess();
    }
  });
  // const {run: addContract} = useRequest(contractDetailAdd, {
  //   manual: true,
  //   onError: (error) => {
  //     message.error(error.message);
  //   },
  //   onSuccess: () => {
  //     MxRef.current.close();
  //     // props.onChange(props.businessId);
  //     props.onSuccess();
  //   }
  // });

  // const {run: select} = useRequest(erpPackageTableList,
  //   {
  //     manual: true,
  //     onError: (error) => {
  //       message.error(error.message);
  //     },
  //     onSuccess: (response) => {
  //       response.forEach(async (value) => {
  //         props.contractId ? await addContract({
  //           data: {
  //             contractId: props.contractId,
  //             itemId: value.itemId,
  //             salePrice: 0,
  //             totalPrice: 0,
  //             quantity: 1
  //           }
  //         }) : await add({
  //           data: {
  //             businessId: props.businessId,
  //             itemId: value.itemId,
  //             salePrice: value.salePrice,
  //             totalPrice: value.totalPrice,
  //             quantity: value.quantity
  //           }
  //         });
  //       });
  //     }
  //   });
  const {run: addPackage} = useRequest(addAllPackages, {
    manual: true,
    onError: (error) => {
      message.error(error.message);
    },
    onSuccess: () => {
      MxRef.current.close();
      // props.onChange(props.businessId);
      props.onSuccess();
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
        <SelButton
          onClick={()=>{

            if(ids !== null && ids.length > 0){
              addPackage({data:{
                businessId: props.businessId,
                packagesIds: ids,
              }});
            }
            else{
              AntModal.confirm({
                title: '提示',
                content: '请至少选择一条数据!',
                confirmLoading: true,
                style: {marginTop: '15%'},
                onOk: async () => {
                },
                onCancel: () => {
                }
              });
            }
          }}
          onSuccess={() => {
            tableRef.current.refresh();
            props.onSuccess();
          }}
          icon={<SelectOutlined />}
          type="primary" >批量选择
        </SelButton>
        <DelButton api={{
          ...batchDelete
        }} onSuccess={() => {
          tableRef.current.refresh();
          // props.onSuccess();
        }} value={ids}>批量删除</DelButton>
      </>
    );
  };

  const height = () => {
    if (window.document.body.clientHeight < 1088) {
      return 'calc(100vh - 206px)';
    }
    return 800;
  };

  return (
    <>
      <div style={{height: height()}}>
        <Table
          api={erpPackageList}
          rowKey="packageId"
          searchForm={searchForm}
          formActions={formActionsPublic}
          actions={actions()}
          ref={tableRef}
          listHeader={false}
          footer={footer}
          selectedRowKeys={ids}
          onChange={(keys) => {
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
          }} />
          <Column title="操作" align="right" render={(value, record) => {
            return (
              <>
                {/*<CheckButton onClick={() => {*/}
                {/*  select({data: {packageId: record.packageId}});*/}
                {/*}} />*/}
                <EditButton onClick={() => {
                  ref.current.open(record.packageId);
                }} />
                <DelButton api={erpPackageDelete} value={record.packageId} onSuccess={() => {
                  // run(record.packageId);
                  tableRef.current.refresh();
                }} />
              </>
            );
          }} />
        </Table>
        <Modal width={900} title="套餐" component={ErpPackageEdit} onSuccess={() => {
          tableRef.current.refresh();
          ref.current.close();
        }} ref={ref} />
        <Modal width={900} title="套餐明细" component={TableList} packageId={PackageId}
          disable={false}
          onSuccess={() => {
          // ref.current.refresh();
            ref.current.close();
          }} ref={MxRef} />
      </div>
    </>
  );
};

export default ItemPackage;
