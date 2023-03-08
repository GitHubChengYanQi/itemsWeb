import React from 'react';
import {Form, Input, Button, Alert} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {useHistory, getSearchParams} from 'ice';
import cookie from 'js-cookie';
import {UseLogin} from 'MES-Apis/src/Login/hooks';


const FormItem = Form.Item;

export default function Login({submitText}) {

  const history = useHistory();
  const params = getSearchParams();

  const {run, data, error, loading} = UseLogin.login({
    manual: true
  });

  return (
    <Form
      size="large"
      initialValues={{remember: true}}
      onFinish={async (values) => {
        const response = await run({
          data: values
        });
        if (response && response.data) {
          cookie.set('tianpeng-token', response.data);
          setTimeout(() => {
            if (params.backUrl) {
              window.location.href = decodeURIComponent(params.backUrl);
            } else {
              history.replace('/');
            }
          }, 1500);
        }
      }}
    >
      <FormItem
        name="username"
        rules={[{required: true, message: '请填写：手机号/邮箱/账号'}]}
      >
        <Input
          prefix={<UserOutlined />}
          name="account"
          placeholder="手机号/邮箱/账号"
          autoComplete="off"
        />
      </FormItem>
      <FormItem
        name="password"
        validateTrigger="onBlur"
        rules={[
          {required: true, message: '请填写密码'},
          () => ({
            validator(rule, value) {
              if (!value || value.length >= 6) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('密码长度不应低于6位!'));
            },
          }),
        ]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder="请填写最低长度为6位的密码"
        />
      </FormItem>
      <FormItem>
        <Button size="large" type="primary" htmlType="submit" block loading={loading}>
          {submitText || '登 录'}
        </Button>
      </FormItem>
      {error && <Alert message={error.message} type="error" />}
      {data && <Alert message="登录成功，请稍候..." type="success" />}
    </Form>
  );
}

Login.propTypes = {};

Login.defaultProps = {};
