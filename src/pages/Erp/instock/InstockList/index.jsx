/**
 * 入库表列表页
 *
 * @author song
 * @Date 2021-07-17 10:46:08
 */

import React, {useRef} from 'react';
import {Badge, Button, Space, Table as AntTable} from 'antd';
import {useBoolean} from 'ahooks';
import {FormButtonGroup, Submit} from '@formily/antd';
import {SearchOutlined} from '@ant-design/icons';
import Table from '@/components/Table';
import AddButton from '@/components/AddButton';
import Form from '@/components/Form';
import Breadcrumb from '@/components/Breadcrumb';
import Icon from '@/components/Icon';
import {instockOrderList} from '../InstockUrl';
import * as SysField from '../InstockField';
import Code from '@/pages/Erp/spu/components/Code';
import Documents from '@/pages/Workflow/Documents';
import Render from '@/components/Render';
import {DocumentEnums} from '@/pages/BaseSystem/Documents/Enums';

const {Column} = AntTable;
const {FormItem} = Form;

const InstockList = () => {

  const ducomentRef = useRef(null);
  const tableRef = useRef(null);

  const actions = () => {
    return (
      <>
        <AddButton onClick={() => {
          ducomentRef.current.create(DocumentEnums.instockOrder);
        }} />
      </>
    );
  };

  const [search, {toggle}] = useBoolean(false);

  const searchForm = () => {

    const formItem = () => {
      return (
        <>
          <FormItem mega-props={{span: 1}} placeholder="负责人" name="itemId" component={SysField.UserId} />
        </>
      );
    };

    return (
      <Space wrap>
          <FormItem
            mega-props={{span: 1}}
            placeholder="仓库名称"
            name="storehouseId"
            component={SysField.StoreHouseSelect} />
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
          </FormButtonGroup>
      </>
    );
  };


  return (
    <>
      <Table
        title={<Breadcrumb />}
        api={instockOrderList}
        rowKey="instockOrderId"
        isModal={false}
        tableKey="instock"
        SearchButton={Search()}
        layout={search}
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
        noRowSelection
      >
        <Column key={1} title="入库单号" dataIndex="coding" render={(text, record) => {
          return (
            <>
              <Code source="instock" id={record.instockOrderId} />
              <a onClick={() => {
                ducomentRef.current.action(false, record.instockOrderId, DocumentEnums.instockOrder);
              }}>
                {text}
              </a>
            </>
          );
        }} />
        <Column key={4} title="状态" width={200} dataIndex="state" sorter render={(value) => {
          switch (value) {
            case 0:
              return <Badge text="待入库" color="red" />;
            case 1:
              return <Badge text="未完成" color="blue" />;
            case 2:
              return <Badge text="已完成" color="green" />;
            default:
              return null;
          }
        }} />
        <Column key={3} title="创建时间" width={200} dataIndex="createTime" />
        <Column key={3} title="入库类型" width={150} dataIndex="type" />
        <Column key={5} title="送料人员" dataIndex="userResult" render={(value) => {
          return <Render width={70}>{value && value.name}</Render>;
        }} />
        <Column key={5} title="送料时间" width={200} dataIndex="registerTime" />
        <Column key={5} title="库管人员" dataIndex="registerTime" render={(value) => {
          return <Render width={70}>{value && value.name}</Render>;
        }} />
        <Column key={5} title="入库物料" align="center" width={100} dataIndex="enoughNumber" />
        <Column key={5} title="已入库" align="center" width={100} dataIndex="notNumber" />
        <Column key={5} title="未入库" align="center" width={100} dataIndex="realNumber" />
        <Column />
        <Column title="操作" align="center" width={100} dataIndex="instockOrderId" render={(value) => {
          return <Space>
            <Button type="link" onClick={() => {
              ducomentRef.current.action(false, value, DocumentEnums.instockOrder);
            }}>查看</Button>
          </Space>;
        }} />
      </Table>

      <Documents ref={ducomentRef} onSuccess={() => {
        tableRef.current.submit();
      }} />

    </>
  );
};

export default InstockList;
