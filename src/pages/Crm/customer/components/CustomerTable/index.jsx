/**
 * 客户管理表列表页
 *
 * @author
 * @Date 2021-07-23 10:06:12
 */

import React, {lazy, useEffect, useRef, useState} from 'react';
import {Avatar, Button, Card, Col, Input, PageHeader, Row, Space, Table as AntTable, Tag, Tooltip, Upload} from 'antd';
import DelButton from '@/components/DelButton';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import Breadcrumb from '@/components/Breadcrumb';
import {MegaLayout} from '@formily/antd-components';
import {
  customerBatchDelete, customerDelete, customerEdit,
  customerList,
} from '@/pages/Crm/customer/CustomerUrl';
import * as SysField from '@/pages/Crm/customer/CustomerField';
import {config, useHistory} from 'ice';
import CustomerEdit from '@/pages/Crm/customer/CustomerEdit';
import Table from '@/components/Table';
import BadgeState from '@/pages/Crm/customer/components/BadgeState';
import CustomerLevel from '@/pages/Crm/customer/components/CustomerLevel';
import {ImportOutlined, SearchOutlined} from '@ant-design/icons';
import {FormButtonGroup, Submit} from '@formily/antd';
import Icon from '@/components/Icon';
import {useBoolean} from 'ahooks';
import CreateNewCustomer from '@/pages/Crm/customer/components/CreateNewCustomer';
import {useRequest} from '@/util/Request';
import cookie from 'js-cookie';
import UpdateSort from '@/components/Table/components/UpdateSort';

const {Column} = AntTable;
const {FormItem} = Form;

const {baseURI} = config;

const CustomerTable = (props) => {

  const {status, state, level, choose, supply, ...other} = props;
  const history = useHistory();

  const [sorts, setSorts] = useState([]);

  const ref = useRef(null);
  const tableRef = useRef(null);


  useEffect(() => {
    if (status || state || level) {
      tableRef.current.formActions.setFieldValue('status', status ? status[0] : null);
      tableRef.current.formActions.setFieldValue('classification', state ? state[0] : null);
      tableRef.current.formActions.setFieldValue('customerLevelId', level ? level[0] : null);
      tableRef.current.submit();
    }
  }, [status, state, level]);


  const actions = () => {
    return (
      <>
        <div style={{display: 'inline-block'}}>
          <Upload
            action={`${baseURI}Excel/crm/excel/importAdress`}
            headers={
              {Authorization: cookie.get('tianpeng-token')}
            }
            name="file"
            fileList={null}
          >
            <Button icon={<Icon type="icon-daoru" />}>{supply ? '导入供应商' : '导入客户'}</Button>
          </Upload>
        </div>
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
          <FormItem mega-props={{span: 1}} placeholder="公司类型" name="companyType" component={SysField.CompanyType} />
          {supply === 0 &&
          <FormItem mega-props={{span: 1}} placeholder="客户来源" name="originId" component={SysField.OriginId} />}
          <FormItem mega-props={{span: 1}} placeholder="负责人" name="userId" component={SysField.UserName} />
          <FormItem mega-props={{span: 1}} placeholder="行业" name="industryId" component={SysField.IndustryOne} />
        </>
      );
    };


    return (
      <div style={{maxWidth: 800}}>
        <MegaLayout
          responsive={{s: 1, m: 2, lg: 2}} labelAlign="left" layoutProps={{wrapperWidth: 200}} grid={search}
          columns={4} full autoRow>
          <FormItem
            mega-props={{span: 1}}
            placeholder={supply ? '供应商名称' : '客户名称'} name="customerName"
            component={SysField.Name} />
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
            <Button type="link" title={search ? '收起高级搜索' : '展开高级搜索'} onClick={() => {
              toggle();
            }}>
              <Icon type={search ? 'icon-shouqi' : 'icon-gaojisousuo'} />{search ? '收起' : '高级'}</Button>
            <MegaLayout inline>
              <FormItem hidden name="status" component={SysField.Name} />
              <FormItem hidden name="classification" component={SysField.Name} />
              <FormItem hidden name="customerLevelId" component={SysField.Name} />
              <FormItem hidden name="supply" value={supply} component={SysField.Name} />
            </MegaLayout>
          </FormButtonGroup>
        </MegaLayout>
      </>
    );
  };

  const [ids, setIds] = useState([]);

  const footer = () => {
    /**
     * 批量删除例子，根据实际情况修改接口地址
     */
    return (<Space>
      <UpdateSort
        disabled={sorts.length === 0}
        type="customer"
        sorts={sorts}
        success={() => {
          tableRef.current.submit();
          setSorts([]);
        }} />
      <DelButton api={{
        ...customerBatchDelete
      }} onSuccess={() => {
        tableRef.current.refresh();
      }} value={ids}>删除</DelButton>
    </Space>);
  };

  return (
    <>
      <Table
        title={<Breadcrumb />}
        api={customerList}
        rowKey="customerId"
        searchForm={searchForm}
        actions={actions()}
        tableKey="customer"
        sortList={(value) => {
          setSorts(value);
        }}
        isModal={false}
        ref={tableRef}
        footer={footer}
        layout={search}
        SearchButton={Search()}
        onChange={(keys) => {
          setIds(keys);
        }}
        {...other}
      >
        <Column key={1} title={supply ? '供应商信息' : '客户信息'} fixed dataIndex="customerName" render={(value, record) => {
          return (
            <Row gutter={24} wrap={false} style={{cursor: 'pointer'}} onClick={() => {
              history.push(`${supply === 1 ? '/purchase/supply/' : '/CRM/customer/'}${record.customerId}`);
            }}>
              <Col>
                <Avatar size={64} src={record.avatar}>{!record.avatar && value.substring(0, 1)}</Avatar>
              </Col>
              <Col>
                <strong>{value}</strong>
                <div>
                  <em>{record.classificationName || '--'}&nbsp;&nbsp;/&nbsp;&nbsp;{record.crmIndustryResult && record.crmIndustryResult.industryName || '--'}&nbsp;&nbsp;/&nbsp;&nbsp;{record.companyType || '--'}</em>
                </div>
                <div>
                  <em>负责人：{record.userResult && record.userResult.name || '未填写'}</em>
                </div>
              </Col>
            </Row>
          );
        }} />
        {supply === 0 && <Column key={2} title="客户状态" width={140} align="center" render={(text, record) => {
          return (
            <BadgeState state={record.status} text={['潜在客户', '正式客户']} color={['red', 'green']} />
          );
        }} />}
        <Column key={3} title={supply ? '供应商来源' : '客户来源'} width={300} align="center" dataIndex="customerName"
                render={(text, record) => {
                  return (
                    <div>
                      {record.originResult ? record.originResult.originName : '未填写'}
                    </div>
                  );
                }} />
        <Column key={4} title={supply ? '供应商级别' : '客户级别'} width={120} align="center" render={(text, record) => {
          const level = typeof record.crmCustomerLevelResult === 'object' ? record.crmCustomerLevelResult : {};
          return (
            <CustomerLevel
              level={level.rank}>{level.level}</CustomerLevel>);
        }} />
        <Column key={5} title="创建时间" width={200} align="center" dataIndex="createTime" sorter />
      </Table>
      <CreateNewCustomer title={supply ? '供应商' : '客户'} model={CustomerEdit} supply={supply} widths={1200}
                         onSuccess={() => {
                           tableRef.current.refresh();
                           ref.current.close();
                         }} ref={ref} />
    </>
  );
};

export default CustomerTable;
