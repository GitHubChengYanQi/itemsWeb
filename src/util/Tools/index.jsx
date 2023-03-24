import moment from 'moment';

const randomString = (len) => {
  len = len || 32;

  // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1

  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = $chars.length;
  let str = '';
  for (let i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
};

// 返回空对象
const isObject = (object) => {
  return (object && typeof object === 'object') ? object : {};
};

// 返回空集合
const isArray = (array) => {
  return Array.isArray(array) ? array : [];
};

const decNum = (a) => { /* 获取小数位数 */
  let r = 0;
  if (a !== null && a !== undefined) {
    a = a.toString();
    if (a.indexOf('.') !== -1) r = a.split('.')[1].length;
  }
  return r;
};

const int = (a) => { /* 去除小数点并转成数值 */
  if (a !== null && a !== undefined) {
    if (Number(a) === 0) {
      // eslint-disable-next-line radix
      return parseInt('0');
    } else {
      // eslint-disable-next-line radix
      return parseInt(a.toString().replace('.', ''));
    }
  } else {
    // eslint-disable-next-line radix
    return parseInt('0');
  }
};

// 数学四则运算
const MathCalc = (a, b, type) => {// 加减乘除
  let r;
  const da = decNum(a);
  const db = decNum(b);
  let dsum = da + db;
  const dmin = Math.min(da, db);
  let dmax = Math.max(da, db);
  dsum += dmax - dmin;
  // eslint-disable-next-line no-restricted-properties
  dsum = Math.pow(10, dsum);
  // eslint-disable-next-line no-restricted-properties
  dmax = Math.pow(10, dmax);
  a = int(a);
  b = int(b);
  if (da > db) {
    // eslint-disable-next-line no-restricted-properties
    b *= Math.pow(10, da - db);
  } else {
    // eslint-disable-next-line no-restricted-properties
    a *= Math.pow(10, db - da);
  }

  switch (type) {
    case 'jia':
      r = (a + b) / dmax;
      break;
    case 'jian':
      r = (a - b) / dmax;
      break;
    case 'cheng':
      r = (a * b) / dsum;
      break;
    case 'chu':
      if (b === 0) {
        break;
      }
      r = a / b;
      break;
    default:
      break;
  }
  return Number(r.toFixed(2));
};

// 查找字符串返回 true / false
const queryString = (value = '', string) => {
  if (value.includes('\\')) {
    value = value.replaceAll('\\', '|');
  }
  const patt = new RegExp(value, 'i');
  return patt.test(string);
};

const ShowDate = (date) => {
  if (!date) {
    return '-';
  }

  return moment(date).format(moment(date).year() !== moment().year() ? 'YYYY年MM月DD日 HH:mm' : 'MM月DD日 HH:mm');
};

// 计算时间差
const timeDifference = (tmpTime) => {
  const mm = 1000;//1000毫秒 代表1秒
  const minute = mm * 60;
  const hour = minute * 60;
  let ansTimeDifference = 0;//记录时间差
  const tmpTimeStamp = tmpTime ? Date.parse(tmpTime.replace(/-/gi, '/')) : new Date().getTime();//将 yyyy-mm-dd H:m:s 进行正则匹配
  const nowTime = new Date().getTime();//获取当前时间戳
  const tmpTimeDifference = nowTime - tmpTimeStamp;//计算当前与需要计算的时间的时间戳的差值
  if (tmpTimeDifference < 0) {//时间超出，不能计算
    return '刚刚';
  }

  const twoDayTime = new Date().setDate(moment().date() - 2);
  const DifferebceDay = moment().date() - moment(tmpTime).date();
  const DifferebceHour = tmpTimeDifference / hour;//进行小时取整
  const DifferebceMinute = tmpTimeDifference / minute;//进行分钟取整

  if (moment(tmpTime).isBefore(moment(twoDayTime), 'day')) {
    ansTimeDifference = ShowDate(tmpTime);
  } else if (DifferebceDay === 2) {
    ansTimeDifference = `前天 ${moment(tmpTime).format('HH:mm')}`;
  } else if (DifferebceDay === 1) {
    ansTimeDifference = `昨天 ${moment(tmpTime).format('HH:mm')}`;
  } else if (DifferebceHour >= 3) {
    ansTimeDifference = moment(tmpTime).format('HH:mm');
  } else if (DifferebceHour >= 1) {
    ansTimeDifference = parseInt(DifferebceHour, 0) + '小时前';
  } else if (DifferebceMinute >= 1) {
    ansTimeDifference = parseInt(DifferebceMinute) + '分钟前';
  } else {
    ansTimeDifference = '刚刚';
  }
  return ansTimeDifference;
};

export {
  timeDifference,
  randomString,
  isObject,
  isArray,
  MathCalc,
  queryString,
};
