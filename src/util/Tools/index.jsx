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


export {
  randomString,
  isObject,
  isArray,
  MathCalc,
  queryString,
};
