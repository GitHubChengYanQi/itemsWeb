/**
 * 合同表列表页
 *
 * @author
 * @Date 2021-07-21 13:36:21
 */

import React, {useEffect, useRef, useState} from 'react';
import {useHistory} from 'ice';
import {createFormActions, FormButtonGroup, Submit} from '@formily/antd';
import {ExclamationCircleOutlined, SearchOutlined} from '@ant-design/icons';
import {useBoolean} from 'ahooks';
import {Button, notification, Modal as AntModal, Table as AntTable, Divider, Space} from 'antd';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import AddButton from '@/components/AddButton';
import Form from '@/components/Form';
import {contractBatchDelete, contractDelete, contractEdit, contractList,} from '../../../ContractUrl';
import * as SysField from '../../../ContractField';
import Breadcrumb from '@/components/Breadcrumb';
import Modal from '@/components/Modal';
import Contract from '@/pages/Crm/contract/components/components/Contract';
import BadgeState from '@/pages/Crm/customer/components/BadgeState';
import Icon from '@/components/Icon';
import {useRequest} from '@/util/Request';

const {Column} = AntTable;
const {FormItem} = Form;

const formActionsPublic = createFormActions();

const ContractTable = (props) => {

  const {state, customerId, ...other} = props;

  const history = useHistory();

  const ref = useRef(null);
  const content = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    if (state) {
      tableRef.current.formActions.setFieldValue('audit', state ? state[0] : null);
      tableRef.current.refresh();
    }
  }, [state]);

  const [search, {toggle}] = useBoolean(false);


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

    const formItem = () => {
      return (
        <>
          <FormItem
            mega-props={{span: 1}}
            placeholder="请选择乙方"
            name="partyB"
            component={SysField.CustomerNameListSelect} />
          {
            customerId ?
              null
              :
              <FormItem
                mega-props={{span: 1}}
                placeholder="请选择乙方"
                value={customerId || null}
                name="partyB"
                component={SysField.CustomerNameListSelect} />
          }
        </>
      );
    };
    return (
      <Space wrap>
        <FormItem mega-props={{span: 1}} placeholder="请输入合同名称" name="name" component={SysField.Name} />
        {search ? formItem() : null}
      </Space>
    );
  };

  const Search = () => {
    return (
      <div style={{width: 800}}>
        <FormButtonGroup>
          <Submit><SearchOutlined />查询</Submit>
          <Button type="link" title={search ? '收起高级搜索' : '展开高级搜索'} onClick={() => {
            toggle();
          }}>
            <Icon type={search ? 'icon-shouqi' : 'icon-gaojisousuo'} />{search ? '收起' : '高级'}</Button>
          <FormItem hidden name="audit" component={SysField.Name} />
          {
            customerId ?
              <FormItem
                mega-props={{span: 1}}
                placeholder="请选择甲方"
                hidden
                value={customerId || ' '}
                name="partyA"
                component={SysField.CustomerNameListSelect} /> : null
          }
        </FormButtonGroup>
      </div>
    );
  };

  const [ids, setIds] = useState([]);


  const footer = () => {
    /**
     * 批量删除例子，根据实际情况修改接口地址
     */
    return (<DelButton api={{
      ...contractBatchDelete
    }} onSuccess={() => {
      tableRef.current.refresh();
    }} value={ids}>批量删除</DelButton>);
  };

  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: type === 'success' ? '审核成功！' : '已审核！',
    });
  };

  const {run} = useRequest(contractEdit, {
    manual: true, onSuccess: () => {
      openNotificationWithIcon('success');
      tableRef.current.refresh();
    }
  });


  const confirmOk = (record) => {
    AntModal.confirm({
      title: '审核',
      centered: true,
      icon: <ExclamationCircleOutlined />,
      content: '确认审核',
      okText: '确认',
      style: {margin: 'auto'},
      cancelText: '取消',
      onOk: async () => {
        await run(
          {
            data: {
              contractId: record.contractId,
              audit: 1,
            }
          }
        );
      }
    });
  };

  return (
    <>
      <Table
        headStyle={customerId && {display: 'none'}}
        title={<Breadcrumb />}
        api={contractList}
        // actions={actions()}
        rowKey="contractId"
        tableKey="contract"
        isModal={false}
        searchForm={searchForm}
        ref={tableRef}
        footer={footer}
        formActions={formActionsPublic}
        SearchButton={Search()}
        layout={search}
        selectedRowKeys={ids}
        onChange={(value) => {
          setIds(value);
        }}
        {...other}
      >
        <Column key={2} title="甲方信息" dataIndex="partAName" render={(text, record) => {
          return (
            <div title="点击进入甲方详情" style={{cursor: 'pointer'}} onClick={() => {
              history.push(`/CRM/customer/${record.partyA}`);
            }}>
              <strong>{record.partA ? record.partA.customerName : null}</strong>
              <div>
                <em>联系人：{record.partyAContacts ? record.partyAContacts.contactsName : '--'}</em>&nbsp;&nbsp;/&nbsp;&nbsp;
                <em>电话：{record.phoneA ? record.phoneA.phoneNumber : '--'}</em></div>
              <div>
                <em>{record.partyAAdress ? record.partyAAdress.location : '---'}</em>
              </div>
            </div>
          );
        }} />
        <Column key={3} title="乙方信息" dataIndex="partAName" render={(text, record) => {
          return (
            <div title="点击进入乙方详情" style={{cursor: 'pointer'}} onClick={() => {
              history.push(`/CRM/customer/${record.partyB}`);
            }}>
              <strong>{record.partB ? record.partB.customerName : null}</strong>
              <div>
                <em>联系人：{record.partyBContacts ? record.partyBContacts.contactsName : '--'}</em>&nbsp;&nbsp;/&nbsp;&nbsp;
                <em>电话：{record.phoneB ? record.phoneB.phoneNumber : '--'}</em></div>
              <div>
                <em>{record.partyAAdress ? record.partyAAdress.location : '---'}</em>
              </div>
            </div>
          );
        }} />
        {/* <Column title="总金额" dataIndex="allMoney" /> */}
        <Column key={4} title="创建时间" width={200} dataIndex="createTime" sorter />
        <Column title="审核" width={120} align="left" render={(value, record) => {
          return (
            <BadgeState state={record.audit} text={['未审核', '已审核']} color={['red', 'green']} />
          );
        }} />
        <Column />
        <Column key={5} title="操作" fixed="right" align="right" render={(value, record) => {
          return (
            <>
              <>
                {record.audit === 0 && <Button type="link" onClick={() => {
                  confirmOk(record);
                }}>
                  <Icon type="icon-shenhe" />
                  审核
                </Button>}
                <Button type="link" onClick={() => {
                  history.push(`/CRM/contract/detail?sourceId=${record.sourceId}&source=${record.source}`);
                }}>详情</Button>
                {record.audit === 0 && <DelButton api={contractDelete} value={record.contractId} onSuccess={() => {
                  tableRef.current.submit();
                }} />}
              </>
            </>
          );
        }} />
      </Table>


      <Modal
        width={1250}
        component={Contract}
        onSuccess={() => {
          tableRef.current.submit();
          content.current.close();
        }}
        ref={content}
      />
    </>
  );
};

export default ContractTable;
