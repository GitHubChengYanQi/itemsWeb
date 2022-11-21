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
import {codingRulesDelete, codingRulesEdit, codingRulesList} from '../codingRulesUrl';
import CodingRulesEdit from '../codingRulesEdit';
import * as SysField from '../codingRulesField';
import Breadcrumb from '@/components/Breadcrumb';
import Modal from '@/components/Modal';
import {useRequest} from '@/util/Request';

const formActionsPublic = createFormActions();
const {Column} = AntTable;
const {FormItem} = Form;

const CodingRulesList = () => {
  const ref = useRef(null);
  const formRef = useRef(null);
  const tableRef = useRef(null);

  const {run} = useRequest(codingRulesEdit, {
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
    switch (value) {
      case 0:
        return '物料';
      case 1:
        return '入库';
      case 2:
        return '出库';
      case 3:
        return '质检';
      case 4:
        return '质检任务';
      case 5:
        return '采购申请';
      case 6:
        return '盘点任务';
      case 7:
        return '采购询价';
      case 8:
        return '作业指导编码';
      case 9:
        return '作业指导版本';
      case 10:
        return '工序编码';
      case 11:
        return '采购单';
      case 12:
        return '合同';
      case 13:
        return '生产计划';
      case 14:
        return '产品';
      case 15:
        return '入库异常';
      case 16:
        return '养护任务';
      case 17:
        return '调拨任务';
      case 18:
        return '生产任务';
      case 19:
        return '型号编码';
      case 20:
        return '生产卡片编码';
      default:
        break;
    }
  };


  return (
    <>
      <Table
        title={<Breadcrumb title="编码规则管理" />}
        isModal
        formActions={formActionsPublic}
        api={codingRulesList}
        noRowSelection
        rowKey="codingRulesId"
        searchForm={searchForm}
        actions={actions()}
        ref={tableRef}
      >
        <Column title="规则名称" dataIndex="name" />
        <Column title="对应模块" dataIndex="module" render={(value) => {
          return (
            <>{module(value)}</>
          );
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
              <DelButton api={codingRulesDelete} value={record.codingRulesId} onSuccess={() => {
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
        component={CodingRulesEdit}
        onSuccess={() => {
          tableRef.current.refresh();
          ref.current.close();
        }} ref={ref} />

    </>
  );
};

export default CodingRulesList;
