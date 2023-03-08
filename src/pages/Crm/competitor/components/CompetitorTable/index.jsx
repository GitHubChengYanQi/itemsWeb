/**
 * 列表页
 *
 * @author
 * @Date 2021-09-07 09:50:09
 */

import React, {useEffect, useRef, useState} from 'react';
import Table from '@/components/Table';
import {Button, Divider, Space, Table as AntTable, Tag} from 'antd';
import {useRequest} from '@/util/Request';
import DelButton from '@/components/DelButton';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {createFormActions, FormButtonGroup, Reset, Submit} from '@formily/antd';
import {SearchOutlined, InfoCircleOutlined} from '@ant-design/icons';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal';
import Breadcrumb from '@/components/Breadcrumb';
import CustomerLevel from '@/pages/Crm/customer/components/CustomerLevel';
import {useHistory} from 'ice';
import competitorTable from '@/pages/Crm/competitorQuote/components/competitorTable';
import {competitorDelete, competitorList, deleteByIds} from '../../competitorUrl';
import CompetitorEdit from '../../competitorEdit';
import * as SysField from '../../competitorField';
import {customerBatchDelete} from '@/pages/Crm/customer/CustomerUrl';
import store from '@/store';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const CompetitorTable = (props) => {

  const {competitionLevel, businessId, ...other} = props;

  const [data] = store.useModel('dataSource');

  const history = useHistory();
  const {run: getList} = useRequest({
    url: '/businessCompetition/listCompetition',
    method: 'POST'
  });


  const ref = useRef(null);
  const tableRef = useRef(null);
  const quoteRef = useRef(null);
  const submitRef = useRef(null);

  const actions = () => {
    return (
      <>
        <AddButton onClick={() => {
          ref.current.open(false);
        }} />
      </>
    );
  };

  useEffect(() => {

    if (competitionLevel) {
      tableRef.current.formActions.setFieldValue('competitionLevel', competitionLevel[0]);
      tableRef.current.submit();
    }
  }, [competitionLevel]);


  const [search, setSearch] = useState(false);

  const searchForm = () => {

    const formItem = () => {
      return (
        <>
          <FormItem mega-props={{span: 1}} placeholder="联系电话" name="phone" component={SysField.Phone} />
          <FormItem mega-props={{span: 1}} placeholder="员工规模" name="staffSize" component={SysField.StaffSize} />
          <FormItem mega-props={{span: 1}} placeholder="公司所有制" name="ownership" component={SysField.Ownership} />
          <FormItem mega-props={{span: 1}} placeholder="地区" name="region" options={data && data.area}
                    component={SysField.Region} />
          <FormItem mega-props={{span: 1}} placeholder="年销售" name="annualSales" component={SysField.AnnualSales} />
        </>
      );
    };

    return (
      <Space wrap>
        <FormItem mega-props={{span: 1}} placeholder="竞争对手企业名称" name="name" component={SysField.Name} />
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
            if (search) {
              setSearch(false);
            } else {
              setSearch(true);
            }
          }}>
            <Icon type={search ? 'icon-shouqi' : 'icon-gaojisousuo'} />{search ? '收起' : '高级'}</Button>
          <FormItem hidden name="competitionLevel" component={SysField.CompetitionLevel} />
          <FormItem hidden name="businessId" value={businessId || null} component={SysField.BusinessId} />
        </FormButtonGroup>
      </>
    );
  };

  const [ids, setIds] = useState([]);
  const footer = () => {
    /**
     * 批量删除例子，根据实际情况修改接口地址
     */
    return (<DelButton api={{
      ...deleteByIds
    }} onSuccess={() => {
      tableRef.current.refresh();
    }} value={ids}>批量删除</DelButton>);
  };

  return (
    <>
      <Table
        title={businessId ? false : <Breadcrumb />}
        api={competitorList}
        isModal={false}
        rowKey="competitorId"
        tableKey="competitor"
        searchForm={searchForm}
        headStyle={{display: businessId && 'none'}}
        SearchButton={Search()}
        formActions={formActionsPublic}
        layout={search}
        selectedRowKeys={ids}
        actions={actions()}
        ref={tableRef}
        footer={footer}
        onChange={(keys) => {
          setIds(keys);
        }}
        {...other}
      >
        <Column width={150} key={1} fixed title="基础信息" dataIndex="name" render={(value, record) => {
          return (
            <div style={{cursor: 'pointer'}} onClick={() => {
              history.push(`/CRM/competitor/${record.competitorId}`);
            }}><strong>{value}</strong>
              <div><em style={{}}>{record.phone || '--'}</em>&nbsp;&nbsp;/&nbsp;&nbsp;{record.email || '--'}</div>
              <div>
                <em>{
                  record.regionResult ? `${record.regionResult.countries
                  }-${record.regionResult.province
                  }-${record.regionResult.city
                  }-${record.regionResult.area}` : '---'}</em>
              </div>
              <a onClick={() => {
                // 点击查看报价。。。
                getList({data: {competitorId: record.competitorId}});
                quoteRef.current.open(record.competitorId);
              }}>
                报价信息
              </a>
            </div>
          );
        }} />
        <Column />
        <Column key={2} title="操作" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record);
              }} />
              <DelButton api={competitorDelete} value={record.competitorId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} width={200} fiexd />
      </Table>
      <Modal width={1000} title="竞争对手" component={CompetitorEdit} onSuccess={() => {
        tableRef.current.refresh();
        ref.current.close();
      }} ref={ref}
             compoentRef={submitRef}
             footer={
               <>
                 <Button type="primary" onClick={() => {
                   submitRef.current.formRef.current.submit();
                 }}>
                   保存
                 </Button>
                 <Button onClick={() => {
                   ref.current.close();
                 }}>
                   取消
                 </Button>
               </>}
      />
      <Modal width={1200} component={competitorTable} onSuccess={() => {
        tableRef.current.refresh();
        quoteRef.current.close();
      }} ref={quoteRef} businessId={businessId || null} />
    </>
  );
};

export default CompetitorTable;
