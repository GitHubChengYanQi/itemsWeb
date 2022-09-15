import React from 'react';
import { Card, Col, Input, Modal, Row, message } from 'antd';
import { Form, FormButtonGroup, FormItem, Submit, FormEffectHooks, createFormActions } from '@formily/antd';
import { useRequest } from '@/util/Request';
import { changePwd } from '@/Config/ApiUrl/system/user';

const { onFieldValueChange$ } = FormEffectHooks;
const actions = createFormActions();

const PassWord = (
  {
    visible,
    onClose = () => {
    }
  }
) => {

  const { run: save, loading } = useRequest(changePwd, {
    manual: true,
    onSuccess: () => {
      message.success('操作成功！');
      onClose();
    },
    onError: (error) => {
      message.error(error.message);
    }
  });

  return (
    <Modal
      title="修改密码"
      open={visible}
      onOk={async () => {
        await actions.submit();
      }}
      confirmLoading={loading}
      onCancel={() =>onClose()}
      destroyOnClose
    >
      <Form
        actions={actions}
        effects={($, { setFieldState, getFieldState }) => {
          onFieldValueChange$('*(passWord,newPassWord)').subscribe(({ name, value }) => {

            const otherName = name === 'newPassWord' ? 'passWord' : 'newPassWord';
            const otherValue = getFieldState(otherName, state => state.value);

            setFieldState('newPassWord', state => {
              if (value && otherValue && value !== otherValue) {
                state.errors = '两次密码输入不一致';
              } else {
                state.errors = '';
              }
            });
          });
        }}
        labelCol={6}
        wrapperCol={12}
        onSubmit={async (values) => {
          return await save({ data: values });
        }}>
        <FormItem component={Input.Password} label="原密码" required placeholder="请输入原密码" name="oldPassWord"/>
        <FormItem component={Input.Password} label="新密码" required placeholder="请输入新密码" name="passWord"/>
        <FormItem component={Input.Password} label="确认密码" required placeholder="请输入确认密码" name="newPassWord"/>
      </Form>
    </Modal>
  );
};

export default PassWord;
