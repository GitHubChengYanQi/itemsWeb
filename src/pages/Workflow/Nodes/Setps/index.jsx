import React from 'react';
import {
  Form,
  FormItem,
  FormEffectHooks,
  createFormActions,
  Submit,
  FormButtonGroup,
} from '@formily/antd';
import {Button, Input, Radio} from 'antd';
import {ActionIds, Actions, Rule, StautsId} from '@/pages/Workflow/Nodes/Setps/components/SetpsField';

const actions = createFormActions();


const Setps = ({
  value = {},
  onClose = () => {
  },
  onChange = () => {
  },
  type,
  module,
}) => {

  return (
    <Form
      labelCol={4}
      wrapperCol={12}
      actions={actions}
      effects={($, {setFieldState, getFieldState}) => {

        FormEffectHooks.onFieldValueChange$('type').subscribe(({value, inputed}) => {
          setFieldState('documentsStatusId', state => {
            state.props.actionType = value;
            if (inputed) {
              state.value = null;
            }
          });

          setFieldState('actionStatuses', state => {
            state.visible = value === 'status';
          });

          setFieldState('stepsName', state => {
            state.visible = value === 'status';
          });

        });

        FormEffectHooks.onFieldValueChange$('documentsStatusId').subscribe(({value}) => {
          const type = getFieldState('type');
          const actions = (value && value.actions) || [];
          setFieldState('auditRule', state => {
            const hidden = actions.filter(item => ['check'].includes(item.action)).length > 0;
            state.visible = !(type && type.value === 'status' && hidden);
          });

          if (type && type.value === 'status' && value) {
            setFieldState('actionStatuses', state => {
              const visible = value.actions;
              state.visible = visible;
              state.props.actions = visible ? actions : [];
              state.value = actions.map((item,index) => {
                return {...item, checked: index === 0};
              }) || [];
            });
          }
        });

      }}
      defaultValue={{
        type: value.type || 'audit',
        ...value,
      }}
      onSubmit={(values) => {
        onChange({...values, documentsStatusId: values.documentsStatusId && values.documentsStatusId.value});
      }}
    >

      <FormItem
        required
        label="类型"
        name="type"
        component={Radio.Group}
        options={[
          {label: '审批', value: 'audit'},
          {label: '状态', value: 'status'},
        ]} />
      <FormItem
        type={type}
        visible={false}
        label="状态名称"
        name="stepsName"
        component={Input}
        placeholder="请输入状态名称"
        required
      />
      <FormItem
        type={type}
        label="单据状态"
        name="documentsStatusId"
        component={StautsId}
        required
      />
      <FormItem
        visible={false}
        label="单据动作"
        defaultValue={value.actionStatuses}
        name="actionStatuses"
        component={ActionIds}
      />

      <FormItem
        label="人员范围"
        required
        name="auditRule"
        component={Rule}
      />
      <FormItem
        label="审批操作"
        name="action"
        component={Actions}
      />

      <div style={{marginTop: 16}}>
        <FormButtonGroup offset={8} sticky>
          <Submit>确定</Submit>
          <Button onClick={() => {
            onClose();
          }}>取消</Button>
        </FormButtonGroup>
      </div>
    </Form>
  );
};

export default Setps;
