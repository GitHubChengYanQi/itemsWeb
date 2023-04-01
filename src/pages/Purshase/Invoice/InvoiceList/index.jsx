/**
 * 列表页
 *
 * @author song
 * @Date 2022-02-24 14:55:10
 */

import React, {useRef, useState} from 'react';
import {createFormActions} from '@formily/antd';
import {Button, Input, Space} from 'antd';
import {FileOutlined} from '@ant-design/icons';
import Table from '@/components/Table';
import Drawer from '@/components/Drawer';
import AddButton from '@/components/AddButton';
import {invoiceList, invoiceDelete} from '@/pages/Purshase/Invoice/InvoiceUrl';
import InvoiceEdit from '@/pages/Purshase/Invoice/InvoiceEdit';
import EditButton from '@/components/EditButton';
import DelButton from '@/components/DelButton';
import ThousandsSeparator from '@/components/ThousandsSeparator';
import Modal from '@/components/Modal';
import {isArray} from '@/util/Tools';
import Form from '@/components/Form';
import FileUpload from '@/components/FileUpload';

const formActionsPublic = createFormActions();
const {FormItem} = Form;

const InvoiceList = ({orderId}) => {

  const showFileRef = useRef(null);

  const [item, setItem] = useState({});

  const ref = useRef(null);
  const tableRef = useRef(null);

  const compoentRef = useRef();

  const actions = () => {
    return (
      <>
        <AddButton onClick={() => {
          ref.current.open(false);
        }} />
      </>
    );
  };

  const searchForm = () => {
    return <>
      <FormItem label="发票名称" name="name" component={Input} placeholder="请输入发票名称" />
    </>;
  };

  let columns = [
    {dataIndex: 'name', title: '发票名称'},
    {dataIndex: 'invoiceBillNo', title: '发票号'},
    {
      dataIndex: 'money', title: '金额(人民币)', align: 'right', width: 120, render(value) {
        return <ThousandsSeparator prefix="￥" value={value} />;
      }
    },
    {
      dataIndex: 'enclosureId', title: '附件', align: 'center', width: 100, render: (value, record) => {
        return <Button type="link" onClick={() => {
          showFileRef.current.open(true);
          setItem(record);
        }}><FileOutlined /> x {isArray(record.mediaUrlResults).length}</Button>;
      }
    },
    {dataIndex: 'invoiceDate', title: '发票日期', width: 200, align: 'center'},
  ];

  if (!orderId) {
    columns = [...columns, {dataIndex: 'coding', title: '关联订单'}];
  }

  columns = [
    ...columns,
    {},
    {
      dataIndex: 'orderId', title: '操作', width: 100, align: 'center', render: (value, record) => {
        return <>
          <EditButton onClick={() => {
            ref.current.open(record.invoiceBillId);
          }} />
          <DelButton api={invoiceDelete} value={record.invoiceBillId} onSuccess={() => {
            tableRef.current.refresh();
          }} />
        </>;
      }
    },
  ];

  return (
    <>
      <Table
        emptyAdd={<Button type="link" onClick={() => ref.current.open(false)}>暂无数据，请添加</Button>}
        searchStyle={{padding: orderId && 0}}
        formSubmit={(values) => {
          return {...values, orderId};
        }}
        maxHeight="auto"
        unsetOverflow
        noTableColumnSet
        columns={columns}
        listHeader={false}
        cardHeaderStyle={{display: 'none'}}
        searchForm={searchForm}
        formActions={formActionsPublic}
        api={invoiceList}
        rowKey="invoiceBillId"
        noRowSelection
        contentHeight
        actions={actions()}
        ref={tableRef}
      />
      {orderId
        ?
        <Modal
          title="发票"
          orderId={orderId}
          compoentRef={compoentRef}
          component={InvoiceEdit}
          onSuccess={() => {
            tableRef.current.refresh();
            ref.current.close();
          }}
          footer={<Space>
            <Button onClick={() => {
              ref.current.close();
            }}>
              取消
            </Button>
            <Button type="primary" onClick={() => {
              compoentRef.current.submit();
            }}>
              确定
            </Button>
          </Space>}
          ref={ref}
        /> : <Drawer width={800} title="发票" orderId={orderId} component={InvoiceEdit} onSuccess={() => {
          tableRef.current.refresh();
          ref.current.close();
        }} ref={ref} />}

      <Modal
        headTitle="查看附件"
        ref={showFileRef}
      >
        <div style={{padding: 16}}>
          <FileUpload privateUpload show value={item.enclosureId} />
        </div>
      </Modal>
    </>
  );
};

export default InvoiceList;
