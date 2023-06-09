/**
 * 出库申请列表页
 *
 * @author song
 * @Date 2021-09-14 16:49:41
 */

import React, {useRef} from 'react';
import Table from '@/components/Table';
import {Button, Modal as AntModal, notification, Space, Table as AntTable} from 'antd';
import Modal from '@/components/Modal';
import DelButton from '@/components/DelButton';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {useRequest} from '@/util/Request';
import {outstockOrderDelete} from '@/pages/Erp/outstock/outstockOrder/outstockOrderUrl';
import Message from '@/components/Message';
import Icon from '@/components/Icon';
import Breadcrumb from '@/components/Breadcrumb';
import ApplyDetailsList from '@/pages/Erp/outstockApply/applyDetails/applyDetailsList';
import {useBoolean} from 'ahooks';
import {FormButtonGroup, Submit} from '@formily/antd';
import {SearchOutlined} from '@ant-design/icons';
import OutStockApply from '@/pages/Erp/outstockApply/components/OutStockApply';
import CreateOutStockApply from '@/pages/Erp/outstockApply/outstockApplyEdit/components/CreateOutStockApply';
import OutstockApplyEdit from '../outstockApplyEdit';
import * as SysField from '../outstockApplyField';
import {OutBound, outstockApplyEdit, outstockApplyList} from '../outstockApplyUrl';

const {Column} = AntTable;
const {FormItem} = Form;

const OutstockApplyList = () => {
  const ref = useRef(null);
  const refDetail = useRef(null);
  const refApply = useRef(null);
  const tableRef = useRef(null);


  const actions = () => {
    return (
      <>
        <AddButton onClick={() => {
          ref.current.open(false);
        }} />
      </>
    );
  };

  const [search, {toggle}] = useBoolean(false);

  const searchForm = () => {

    const formItem = () => {
      return (
        <>
          <FormItem mega-props={{span: 1}} placeholder="请选择负责人" name="userId" component={SysField.UserId} />
          <FormItem mega-props={{span: 1}} placeholder="请选择仓库" name="stockId" component={SysField.StoreHouse} />
          <FormItem mega-props={{span: 1}} placeholder="请选择客户" name="customerId" component={SysField.CustomerId} />
        </>
      );
    };


    return (
      <Space wrap>
          <FormItem mega-props={{span: 1}} placeholder="请输入发货申请单号" name="outstockApplyId" component={SysField.ApplyState} />
          {search ? formItem() : null}
      </Space>
    );
  };


  const Search = () => {
    return (
      <>
          <FormButtonGroup>
            <Submit><SearchOutlined />查询</Submit>
            <Button type="link" title={search ? '收起高级搜索' : '展开高级搜索'} onClick={() => {
              toggle();
            }}>
              <Icon type={search ? 'icon-shouqi' : 'icon-gaojisousuo'} />{search ? '收起' : '高级'}</Button>
              {/* <FormItem hidden name="status" component={SysField.Name} /> */}
              {/* <FormItem hidden name="classification" component={SysField.Name} /> */}
              {/* <FormItem hidden name="customerLevelId" component={SysField.Name} /> */}
          </FormButtonGroup>
      </>
    );
  };







  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: type === 'success' ? '申请成功！' : '已申请！',
    });
  };
  const {run} = useRequest(outstockApplyEdit, {
    manual: true, onSuccess: () => {
      openNotificationWithIcon('success');
      tableRef.current.refresh();
    },
    onError: (error) => {
      Message.error(error.message);
    }
  });


  const confirmOk = (record) => {
    AntModal.confirm({
      title: '发货申请',
      centered: true,
      content: '请确认是否同意发货申请操作!注意：同意之后不可恢复。',
      style: {margin: 'auto'},
      cancelText: '取消',
      onOk: async () => {
        await run(
          {
            data: {...record,applyState: 2}
          }
        );
      }
    });
  };


  return (
    <>
      <Table
        title={<Breadcrumb />}
        api={outstockApplyList}
        rowKey="outstockApplyId"
        searchForm={searchForm}
        tableKey='outstockApply'
        actions={actions()}
        ref={tableRef}
        SearchButton={Search()}
        layout={search}
      >
        <Column key={1} title="发货申请单号" width={120} dataIndex="outstockApplyId" render={(value,record)=>{
          return (
            <Button type='link' onClick={()=>{
              refDetail.current.open(record.outstockApplyId);
            }}>{value}</Button>
          );
        }} />
        <Column key={2} title="负责人" dataIndex="userId" render={(value,record)=>{
          return (
            <>
              {record.userResult && record.userResult.name}
            </>
          );
        }} />
        <Column key={3} title="客户" dataIndex="customerId" render={(value,record)=>{
          return (
            <>
              {record.customerResult && record.customerResult.customerName}
            </>
          );
        }}/>
        <Column key={4} title="地址" dataIndex="adressId" render={(value,record)=>{
          return (
            <>
              {record.adressResult && record.adressResult.location}
            </>
          );
        }}/>
        <Column key={5} title="联系人" dataIndex="contactsId" render={(value,record)=>{
          return (
            <>
              {record.contactsResult && record.contactsResult.contactsName}
            </>
          );
        }}/>
        <Column key={6} title="电话" dataIndex="phoneId" render={(value,record)=>{
          return (
            <>
              {record.phoneResult && record.phoneResult.phoneNumber}
            </>
          );
        }}/>
        <Column />
        <Column key={7} title="操作" align="right" render={(value, record) => {
          return (
            <>
              {record.applyState === 2 && <Button style={{margin: '0 10px'}} onClick={() => {
                refApply.current.open(record.outstockApplyId);
              }}><Icon type="icon-chuku" />一键发货</Button> }
              {record.applyState === 1 ? <Button style={{margin: '0 10px'}} onClick={() => {
                confirmOk(record);
              }}><Icon type="icon-chuku" />同意</Button> : null}
              {record.applyState === 1 ? <EditButton onClick={() => {
                ref.current.open(record.outstockApplyId);
              }} /> : null}
              {record.applyState === 1 ?
                <DelButton api={outstockOrderDelete} value={record.outstockApplyId} onSuccess={() => {
                  tableRef.current.refresh();
                }} /> : null}
            </>
          );
        }} width={300} />
      </Table>

      <CreateOutStockApply width={1400} ref={ref} onSuccess={()=>{
        tableRef.current.refresh();
        ref.current.close();
      }} />

      <Modal width={800}  component={ApplyDetailsList} onSuccess={() => {
        tableRef.current.refresh();
        refDetail.current.close();
      }} ref={refDetail} />

      <Modal width={1400}  component={OutStockApply} onSuccess={() => {
        tableRef.current.refresh();
        refApply.current.close();
      }} ref={refApply} />
    </>
  );
};

export default OutstockApplyList;
