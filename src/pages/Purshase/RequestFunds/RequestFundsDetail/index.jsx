import React, {useEffect} from 'react';
import {UseOrder} from 'MES-Apis/lib/Order';
import ProSkeleton from '@ant-design/pro-skeleton';
import moment from 'moment';
import * as Nzh from 'nzh';
import {Avatar, Badge, Divider, Spin, Steps} from 'antd';
import {CheckCircleFilled, UserOutlined, ExclamationCircleFilled} from '@ant-design/icons';
import ThousandsSeparator from '@/components/ThousandsSeparator';
import {isArray} from '@/util/Tools';
import styles from './index.module.less';
import Icon from '@/components/Icon';
import PrintTemplate from '@/pages/Purshase/RequestFunds/RequestFundsDetail/components/PrintTemplate';
import FileUpload from '@/components/FileUpload';

const RequestFundsDetail = (
  {
    record = {},
    onDetail = () => {
    }
  }
) => {

  const {loading: userLoading, data: userData = {}, run: userRun} = UseOrder.getUserResultByOpenIds({}, {manual: true});

  const {loading, data = {}, run} = UseOrder.requestFundsDetail({}, {
    manual: true,
    onSuccess: (res) => {
      onDetail(res?.data?.info);
      const spRecords = res?.data?.info?.spRecords || [];
      const notifiers = data?.data?.info?.notifiers || [];
      const userIds = [];
      spRecords.forEach((item) => {
        const details = item.details || [];
        details.forEach(userItem => userIds.push(userItem.approver.userId));
      });
      notifiers.forEach(item => {
        userIds.push(item.userId);
      });

      userRun({
        data: {openIds: userIds}
      });
    }
  });

  useEffect(() => {
    if (record.spNo) {
      run({data: {spNo: record.spNo}});
    }
  }, []);

  if (loading) {
    return <ProSkeleton />;
  }

  const contents = data?.data?.info?.applyData?.contents || [];

  const spRecords = data?.data?.info?.spRecords || [];

  const notifiers = data?.data?.info?.notifiers || [];

  const spStatus = data?.data?.info?.spStatus;

  const send = spStatus === 'PASSED';

  const contentRender = (item, label) => {
    switch (item.control) {
      case 'Text':
      case 'Textarea':
        return item?.value?.text;
      case 'Money':
        return item?.value?.newMoney ? <ThousandsSeparator value={item?.value?.newMoney || 0} suffix="元" /> : 0;
      case 'Selector':
        return isArray(item?.value?.selector?.options).length > 0 ? isArray(item.value.selector.options).map(item => item.values.find(item => item.lang === 'zh_CN')?.text) : null;
      case 'Date':
        return item?.value?.date?.timestamp ? moment.unix(item?.value?.date?.timestamp).format(item?.value?.date?.type === 'day' ? 'YYYY/MM/DD' : 'YYYY/MM/DD hh:mm') : null;
      case 'File':
        if (record.filed) {
          if (label) {
            return true;
          }
          return <FileUpload show value={record.filed} privateUpload />;
        } else {
          return null;
        }
      default:
        break;
    }
  };

  const statuRender = (item, index) => {
    let statusName = '';
    let status = '';
    let color = '';

    switch (item.status) {
      case 'AUDITING':

        if (index === 0) {
          statusName = '审批中';
        }

        if (index !== 0 && spRecords[index - 1].status === 'PASSED') {
          status = 'process';
          statusName = '审批中';
        } else {
          status = 'wait';
        }

        break;
      case 'PASSED':
        statusName = '已通过';
        status = 'finish';
        color = '#1677ff';
        break;
      case 'REJECTED':
        statusName = '已驳回';
        status = 'error';
        color = '#ff4d4f';
        break;
      case 'UNDONE':
        statusName = '已撤销';
        status = 'error';
        color = '#faad14';
        break;
      case 'PASS_UNDONE':
        statusName = '通过后撤销';
        status = 'error';
        color = '#faad14';
        break;
      case 'DELETED':
        statusName = '已删除';
        status = 'error';
        color = '#faad14';
        break;
      case 'ALREADY_PAY':
        statusName = '已支付';
        status = 'finish';
        color = '#1677ff';
        break;
      default:
        break;
    }
    return {
      statusName,
      status,
      color
    };
  };

  const userStatusRender = (userItem) => {
    let userStatusName = '';
    let userStatus = '';
    let userColor = '';

    switch (userItem.spStatus) {
      case 'AUDITING':
        break;
      case 'PASSED':
        userStatusName = '已同意';
        userStatus = 'success';
        userColor = '#1677ff';
        break;
      case 'REJECTED':
        userStatusName = '已驳回';
        userStatus = 'error';
        userColor = '#ff4d4f';
        break;
      case 'TURNED':
        userStatusName = '已转审';
        userStatus = 'success';
        userColor = '#faad14';
        break;
      default:
        break;
    }
    return {
      userStatusName,
      userStatus,
      userColor
    };
  };

  return <div>
    <div hidden>
      <PrintTemplate
        info={data?.data?.info || {}}
        record={record || {}}
        contentRender={contentRender}
        statuRender={statuRender}
        userStatusRender={userStatusRender}
        userData={userData}
      />
    </div>
    <div className={styles.detail}>
      <div className={styles.left}>
        {
          contents.map((item, index) => {
            const content = contentRender(item, true);
            if (content) {
              const label = isArray(item.titles).find(item => item.lang === 'zh_CN')?.text;
              return <div
                key={index}
                className={styles.leftItem}
                // item.control === 'File' &&
              >
                {label || '--'}
                <div hidden={item.control !== 'Money'} style={{height: 20}} />
              </div>;
            } else {
              return <div key={index} />;
            }
          })
        }
      </div>
      <div className={styles.right}>
        {
          contents.map((item, index) => {
            const nzhcn = Nzh.cn;
            const content = contentRender(item);
            if (content) {
              return <div
                key={index}
                className={styles.rightItem}
              >
                {content}
                <div
                  hidden={item.control !== 'Money'}
                  className={styles.describe}
                >大写：{nzhcn.encodeB(item?.value?.newMoney)}圆
                </div>
              </div>;
            } else {
              return <div key={index} />;
            }

          })
        }
      </div>

    </div>
    <div>
      <Divider />
      <Spin spinning={userLoading}>
        <div className={styles.process}>
          审批流程
          <Steps
            direction="vertical"
            items={[...spRecords.map((item, index) => {

              const {statusName, color, status} = statuRender(item, index);

              return {
                status,
                title: <div className={styles.auditStatus}>
                  审批人 {statusName ? `· ${statusName}` : ''}
                  <span
                    hidden={item.details.length === 1}
                    className={styles.auditType}
                  >{item.approverAttr === 'ONE_SIGN' ? '或签' : '依次审批'}</span>
                </div>,
                description: <div>
                  {
                    item.details.map((userItem, userIndex) => {

                      const {userStatus, userColor, userStatusName} = userStatusRender(userItem);

                      const users = userData?.data || [];
                      const user = users.find(item => item.openId === userItem.approver?.userId) || {};
                      return <div key={userIndex} className={styles.auditUser}>
                        <div className={styles.user}>
                          <Badge
                            count={userStatus &&
                            (userStatus === 'success' ?
                              <CheckCircleFilled style={{color: userColor}} /> :
                              <ExclamationCircleFilled style={{color: userColor}} />)
                            }
                          >
                            <Avatar
                              src={user.avatar}
                              style={{
                                borderRadius: 4,
                              }}
                              shape="square"
                              icon={<UserOutlined />}
                            />
                          </Badge>
                          {user.name || userItem?.approver?.userId}
                        </div>
                        <div hidden={!userStatusName} style={{color: '#000'}}>
                          {userStatusName} · {moment.unix(userItem.spTime).format('YYYY/MM/DD hh:mm')}
                        </div>
                      </div>;
                    })
                  }
                </div>,
                icon: <Avatar style={{backgroundColor: color}} size="small"><Icon type="icon-shenpi3" /></Avatar>
              };
            }), ...(notifiers.length > 0 ? [{
              status: send ? 'finish' : 'wait',
              title: <div className={styles.auditStatus}>
                抄送人 {send ? '· 已抄送' : ''}
              </div>,
              description: <div>
                {
                  notifiers.map((userItem, userIndex) => {

                    const users = userData?.data || [];
                    const user = users.find(item => item.openId === userItem.userId) || {};
                    return <div key={userIndex} className={styles.auditUser}>
                      <div className={styles.user}>
                        <Avatar
                          src={user.avatar}
                          style={{
                            borderRadius: 4,
                          }}
                          shape="square"
                          icon={<UserOutlined />}
                        />
                        {user.name || userItem?.userId}
                      </div>
                      <div hidden={!send} style={{color: '#000'}}>
                        已抄送
                        · {moment.unix(isArray(spRecords[spRecords.length - 1]?.details).find(item => item.spStatus === 'PASSED')?.spTime).format('YYYY/MM/DD hh:mm')}
                      </div>
                    </div>;
                  })
                }
              </div>,
              icon: <Avatar style={{backgroundColor: send && '#1677ff'}} size="small"><Icon
                type="icon-7" /></Avatar>
            }] : [])]}
          />
        </div>
      </Spin>
    </div>

  </div>;

};

export default RequestFundsDetail;
