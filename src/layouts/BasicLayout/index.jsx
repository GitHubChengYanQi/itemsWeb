import React, {useEffect, useState} from 'react';
import cookie from 'js-cookie';
import {logger, useHistory} from 'ice';
import {Alert, Spin, Layout} from 'antd';
import {Login} from 'MES-Apis/lib/Login/promise';
import {Init} from 'MES-Apis/lib/Init';
import Header from '@/layouts/BasicLayout/components/Header';
import store from '@/store';

import WindowOpenImg from '@/components/Editor/components/WindowOpenImg';
import WindowOpenPosition from '@/components/Editor/components/WindowOpenPosition';
import GetUserInfo from '@/util/GetUserInfo';
import WindowOpenInkind from '@/components/Editor/components/WindowOpenInkind';
import WindowOpenSku from '@/components/Editor/components/WindowOpenSku';

const {Content} = Layout;

export default function BasicLayout({children}) {

  const history = useHistory();
  const [state, dispatchers] = store.useModel('user');
  const dataDispatchers = store.useModel('dataSource')[1];

  const [loading, setLoading] = useState(true);

  const Initialize = async () => {
    window.document.title = '道昕智造（沈阳）网络科技有限公司';
    try {
      const token = cookie.get('tianpeng-token');
      if (!token) {
        throw new Error('本地登录信息不存在');
      }
      Init.setToken(token);
      const jwt = token.split('.');
      if (jwt.length !== 3) {
        throw new Error('本地登录信息错误');
      }
      if (GetUserInfo().tokenMinute >= 10) {
        const res = await Login.refreshToken({});
        if (res.errCode === 0 && GetUserInfo(res.data).token) {
          cookie.set('tianpeng-token', res.data);
        }
      } else {
        cookie.set('tianpeng-token', token);
      }
      await dispatchers.getUserInfo();
      await dataDispatchers.publicInfo();
      await dataDispatchers.getSkuClass();
      await dataDispatchers.getCodingRules();
      await dataDispatchers.getCustomerLevel();
      await dataDispatchers.getCommonArea();
      await dataDispatchers.getBusinessSale();
      await dataDispatchers.getOrigin();
      await dataDispatchers.getDataClass();
      await dataDispatchers.getSpeechcraftClass();
    } catch (e) {
      logger.error(e.message);
      cookie.remove('tianpeng-token');
      // TODO 登录超时处理
      history.push('/login');
    }
    setLoading(false);
  };

  useEffect(() => {
    Initialize();
  }, []);

  if (loading) {
    return <Spin size="large">
      <Alert
        message="加载中"
        description="系统正在初始化个人信息，请稍后..."
        type="info"
        showIcon
        style={{width: 500, margin: '100px auto'}}
      />
    </Spin>;
  }

  return (
    <>

      {Object.keys(state).length === 0 ?
        <Alert
          message="系统初始化失败"
          description="请联系管理员"
          type="error"
          showIcon
          style={{width: 500, margin: '100px auto'}}
        />
        :
        <>
          <Header />
          <Content className="web-content">
            {children}
          </Content>
        </>
      }


      <WindowOpenInkind />

      <WindowOpenSku />

      <WindowOpenPosition />

      <WindowOpenImg />

    </>
  );
}
