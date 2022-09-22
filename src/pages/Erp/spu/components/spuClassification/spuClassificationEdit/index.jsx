/**
 * SPU分类编辑页
 *
 * @author song
 * @Date 2021-10-25 17:52:03
 */

import React, {useRef} from 'react';
import {Popover, Space} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {createFormActions} from '@formily/antd';
import Form from '@/components/Form';
import {spuClassificationDetail, spuClassificationAdd, spuClassificationEdit} from '../spuClassificationUrl';
import * as SysField from '../spuClassificationField';
import store from '@/store';

const {FormItem} = Form;

const ApiConfig = {
  view: spuClassificationDetail,
  add: spuClassificationAdd,
  save: spuClassificationEdit
};

const formActionsPublic = createFormActions();

const SpuClassificationEdit = ({...props}) => {

  const formRef = useRef();

  const dispatchers = store.useModel('dataSource')[1];

  return (
    <Form
      {...props}
      ref={formRef}
      api={ApiConfig}
      formActions={formActionsPublic}
      fieldKey="spuClassificationId"
      onSuccess={() => {
        dispatchers.getSkuClass();
        props.onSuccess();
      }}
      onSubmit={(value) => {
        return {...value, type: 1};
      }}
    >
      <FormItem
        label='上级分类'
        name="pid"
        component={SysField.Pid}
        defaultParams={{data: {isNotproduct: 1}}}
        top
        required />
      <FormItem label="分类名称" name="name" component={SysField.Name} required />
      <FormItem
        label={<Space>分类码 <Popover content='分类码用于配置“编码规则”时使用'>
          <QuestionCircleOutlined style={{cursor: 'pointer'}} />
        </Popover></Space>}
        name="codingClass"
        component={SysField.CodingClass}
        rules={[{
          pattern: '^[A-Z\\d\\+\\-\\*\\/\\(\\)\\%（）]+$',
          message: '只能输入大写字母或数字！'
        }]} />
      <FormItem label="排序" name="sort" value={0} component={SysField.Sort} />
    </Form>
  );
};

export default SpuClassificationEdit;
