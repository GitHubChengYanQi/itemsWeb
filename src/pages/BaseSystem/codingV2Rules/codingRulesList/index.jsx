/**
 * 编码规则列表页
 *
 * @author song
 * @Date 2021-10-22 17:20:05
 */

import React, {useRef} from 'react';
import {createFormActions} from '@formily/antd';
import {Button, Radio, Table as AntTable} from 'antd';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import AddButton from '@/components/AddButton';
import EditButton from '@/components/EditButton';
import Form from '@/components/Form';
import {codingRulesV2Delete, codingRulesV2Edit, codingRulesV2List} from '../codingRulesUrl';
import CodingRulesEdit from '../codingRulesEdit';
import * as SysField from '../codingRulesField';
import Breadcrumb from '@/components/Breadcrumb';
import Modal from '@/components/Modal';
import {useRequest} from '@/util/Request';
import {isArray} from '@/util/Tools';
import store from '@/store';

const formActionsPublic = createFormActions();
const {Column} = AntTable;
const {FormItem} = Form;

const CodingRulesList = () => {
  const ref = useRef(null);
  const formRef = useRef(null);
  const tableRef = useRef(null);

  const [state] = store.useModel('dataSource');

  const rules = state.codingRules || {};

  const {run} = useRequest(codingRulesV2Edit, {
    manual: true,
    onSuccess: () => {
      tableRef.current.submit();
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

  const searchForm = () => {
    return (
      <>
        <FormItem label="编码规则名称" name="name" component={SysField.Name} />
      </>
    );
  };

  const module = (value) => {

    const moduleRules = isArray(rules?.modelRuleList).find(item => item.module === value);
    return moduleRules ? moduleRules.name : '-';
  };


  return (
    <>
      <Table
        noTableColumnSet
        title={<Breadcrumb title="编码规则管理" />}
        isModal
        formActions={formActionsPublic}
        api={codingRulesV2List}
        noRowSelection
        rowKey="codingRulesId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="规则名称" dataIndex="name" />
        <Column title="对应模块" width={100} dataIndex="module" render={(value) => {
          return module(value);
        }} />
        <Column title="默认规则" dataIndex="state" render={(value, record) => {
          return (
            <Radio.Group value={value} onChange={(value) => {
              run({
                data: {
                  codingRulesId: record.codingRulesId,
                  state: value.target.value
                }
              });
            }}>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          );
        }} />
        <Column title="规则设置" dataIndex="codingRules" render={(value) => {
          const array = value.split(',');
          let values = '';
          typeof array === 'object' && array.map((items, index) => {
            return values += items;
          });
          return (
            <>{values}</>
          );
        }} />
        <Column title="规则描述" dataIndex="note" />
        <Column title="操作" fixed="right" align="right" render={(value, record) => {
          return (
            <>
              <EditButton onClick={() => {
                ref.current.open(record.codingRulesId);
              }} />
              <DelButton api={codingRulesV2Delete} value={record.codingRulesId} onSuccess={() => {
                tableRef.current.refresh();
              }} />
            </>
          );
        }} />
      </Table>
      <Modal
        width={600}
        title="编码规则"
        compoentRef={formRef}
        footer={<>
          <Button
            type="primary"
            onClick={() => {
              formRef.current.formRef.current.submit();
            }}>保存</Button></>
        }
        rules={rules}
        component={CodingRulesEdit}
        onSuccess={() => {
          tableRef.current.refresh();
          ref.current.close();
        }} ref={ref} />

    </>
  );
};

export default CodingRulesList;
