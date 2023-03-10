import {config, useHistory} from 'ice';
import cookie from 'js-cookie';
import axios from 'axios';
import {message, Modal} from 'antd';
import {Init} from 'MES-Apis/src/Init';

const baseURI = config.baseURI || window.sing.sysURI;

const GotoLogin = () => {
  const history = useHistory();
  history.push('/login');
};

Init.initBaseURL(baseURI.substring(0, baseURI.length - 1));

try {
  Init.responseConfig({
    loginTimeOut: () => {
      Modal.error({
        title: '提示',
        content: '您已登录超时，请重新登录。',
        okText: '重新登录',
        onOk: () => {
          Modal.destroyAll();
          try {
            GotoLogin();
          } catch (e) {
            window.location.href = `/#/login?backUrl=${encodeURIComponent(window.location.href)}`;
          }
        }
      });
    },
    errorMessage: (res) => {
      message.error(res);
    },
  });
}catch (e) {

}

const ajaxService = axios.create({
  baseURL: baseURI,
  withCredentials: true,
  headers: {
    // 'Content-Type':'application/json;charset=UTF-8',
  }
});

ajaxService.interceptors.request.use((config) => {
  const token = cookie.get('tianpeng-token');
  config.headers.common.Authorization = token || '';
  return config;
}, (error) => {
  return error;
});

ajaxService.interceptors.response.use((response) => {
  if (response.status !== 200) {
    throw new Error('网络错误');
  }
  response = response.data;
  const errCode = typeof response.errCode !== 'undefined' ? parseInt(response.errCode, 0) : 0;
  if (errCode !== 0) {
    if (errCode === 1502) {
      // cookie.remove('tianpeng-token');
      Modal.error({
        title: '提示',
        content: '您已登录超时，请重新登录。',
        okText: '重新登录',
        onOk: () => {
          Modal.destroyAll();
          try {
            GotoLogin();
          } catch (e) {
            window.location.href = `/#/login?backUrl=${encodeURIComponent(window.location.href)}`;
          }
        }
      });
      throw new Error(response.message);
    } else if (errCode === 1001) {
      return response;
    } else if (errCode !== 200) {
      message.error(response.message);
    }
    throw new Error(response.message);
  }
  return response;
}, (error) => {
  // message.error('请求超时！');
  // if (error.errCode !== 0) {
  throw new Error(error.message);
  // }
  // return error;
});

const requestService = () => {
  return {
    ajaxService
  };
};

export const request = ajaxService;
export default requestService;
