import {Message as AfdMessage} from '@alifd/next';
import {notification} from 'antd';

const defaultConfig = {
  title: '提示',
  hasMask: true,
  closeable: true,
  duration: 0
};

const success = (title) => {
  notification.success({
    message: title || '成功！',
  });
};
const warning = (title) => {
  notification.warning({
    message: title || '警告！',
  });
};
const error = (title) => {
  notification.error({
    message: title || '失败！',
  });
};

const notice = (config) => {
  const content = typeof config === 'object' ? config : {content: config};
  AfdMessage.notice({
    ...defaultConfig,
    title: '日志：',
    ...content,
  });
};
const help = (config) => {
  const content = typeof config === 'object' ? config : {content: config};
  AfdMessage.help({
    ...defaultConfig,
    title: '帮助：',
    ...content,
  });
};
const loading = (config) => {
  const content = typeof config === 'object' ? config : {content: config};
  AfdMessage.loading({
    ...defaultConfig,
    hasMask: false,
    title: '载入中：',
    ...content,
  });
};

const Message = {
  success,
  warning,
  error,
  notice,
  help,
  loading
};
export default Message;
