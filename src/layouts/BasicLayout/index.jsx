import React, {useEffect} from 'react';
import cookie from 'js-cookie';
import {logger, useHistory} from 'ice';
import {Alert, Spin, Layout} from 'antd';
import Header from '@/layouts/BasicLayout/components/Header';
import store from '@/store';

import WindowOpenImg from '@/components/Editor/components/WindowOpenImg';
import WindowOpenSku from '@/components/Editor/components/WindowOpenSku';
import WindowOpenPosition from '@/components/Editor/components/WindowOpenPosition';
import GetUserInfo from '@/util/GetUserInfo';
import {request as requestProivde} from '@/util/Service';

const {Content} = Layout;

export default function BasicLayout({children}) {

  const history = useHistory();
  const [state, dispatchers] = store.useModel('user');
  const dataDispatchers = store.useModel('dataSource')[1];

  const Initialize = async () => {
    window.document.title = '道昕智造（沈阳）网络科技有限公司';
    try {
      const token = cookie.get('tianpeng-token');
      if (!token) {
        throw new Error('本地登录信息不存在');
      }
      const jwt = token.split('.');
      if (jwt.length !== 3) {
        throw new Error('本地登录信息错误');
      }
      if (GetUserInfo().tokenMinute >= 10) {
        const res = await requestProivde({url: '/rest/refreshToken', method: 'GET'});
        if (res.errCode === 0 && GetUserInfo(res.data).token) {
          cookie.set('tianpeng-token', res.data);
        }
      }else {
        cookie.set('tianpeng-token',token);
      }
      dispatchers.getUserInfo();
      dataDispatchers.getSkuClass();
      dataDispatchers.getCustomerLevel();
      dataDispatchers.getCommonArea();
      dataDispatchers.getBusinessSale();
      dataDispatchers.getOrigin();
      dataDispatchers.getDataClass();
      dataDispatchers.getSpeechcraftClass();

    } catch (e) {
      logger.error(e.message);
      cookie.remove('tianpeng-token');
      // TODO 登录超时处理
      history.push('/login');
    }
  };

  useEffect(() => {
    Initialize();
  }, []);

  return (
    <>
      {Object.keys(state).length === 0 ?
        <Spin size="large">
          <Alert
            message="加载中"
            description="系统正在初始化个人信息，请稍后..."
            type="info"
            showIcon
            style={{width: 500, margin: '100px auto'}}
          />
        </Spin> :
        <>
          <Header />
          <Content className="web-content">
            {children}
          </Content>
        </>
      }


      <WindowOpenSku />

      <WindowOpenPosition />

      <WindowOpenImg />

    </>
  );
}
