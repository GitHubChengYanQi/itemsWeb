import cookie from 'js-cookie';
import Base64 from 'crypto-js/enc-base64';
import utf8 from 'crypto-js/enc-utf8';
import moment from 'moment';


const GetUserInfo = (defaultToken) => {

  const token = defaultToken || cookie.get('tianpeng-token');

  /**
   * token 不存在就返回空
   */
  if (!token) {
    return {};
  }

  try {
    const [, data] = token.split('.');

    const base = Base64.parse(data);

    const userInfo = JSON.parse(base.toString(utf8));

    const tokenMinute = moment(new Date()).diff(moment.unix(userInfo.iat), 'minute');


    return {
      token,
      userInfo,
      tokenMinute,
    };

  } catch (e) {
    console.error(e);
    return {};
  }

};
export default GetUserInfo;
