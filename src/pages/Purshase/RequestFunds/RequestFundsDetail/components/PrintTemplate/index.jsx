import React from 'react';
import moment from 'moment';
import {statusData} from '@/pages/Purshase/RequestFunds/RequestFundsList';
import {isArray} from '@/util/Tools';
import store from '@/store';

const PrintTemplate = (
  {
    info,
    record,
    contentRender,
    statuRender,
    userStatusRender,
    userData
  }
) => {

  const [dataSource] = store.useModel('dataSource');

  const [state] = store.useModel('user');

  const labelStyle = {
    width: '16%',
    backgroundColor: '#F3F3F3',
    WebkitPrintColorAdjust: 'exact',
    color: '#000',
    fontSize: 12,
    textAlign: 'center',
    height: 18,
    padding: '4px 8px',
    border: '1px solid #787878',
    overflow: 'hidden',
    wordBreak: 'break-word',
    wordWrap: 'break-word',
  };

  const valueStyle = {
    width: '30%',
    backgroundColor: '#fff',
    fontSize: 12,
    height: 18,
    padding: '4px 8px',
    border: '1px solid #787878',
    overflow: 'hidden',
    wordBreak: 'break-word',
    wordWrap: 'break-word',
  };

  const spaceDom = <td
    style={{
      height: 15,
      background: '#fff',
      borderRight: '1px solid #787878',
      borderLeft: '1px solid #787878',
    }}
    colSpan="4"
  />;

  const auditValueStyle = {...valueStyle, textAlign: 'center'};

  const contents = (info?.applyData?.contents || []).filter(item=>item.control !== 'File');

  const spRecords = info?.spRecords || [];

  const notifiers = info?.notifiers || [];

  const spStatus = info?.spStatus;

  const send = spStatus === 'PASSED';

  const exitItems = [];

  let sendUser = {};
  if (notifiers.length > 0) {
    const users = userData?.data || [];
    sendUser = users.find(item => item.openId === notifiers[0].userId) || {};
  }


  return <div id="printTemplate">
    <div style={{
      width: 670,
      margin: '0 auto',
      paddingTop: 18,
    }}>
      <h1 style={{
        marginBottom: 20,
        fontSize: 15,
        textAlign: 'center'
      }}>{info.spName}</h1>
      <div>
        <div
          style={{
            float: 'left',
            maxWidth: 400,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            fontWeight: 500,
            marginBottom: 4,
            fontSize: 12,
            color: '#000',
          }}
        >
          {dataSource?.publicInfo?.enterprise || ''}
        </div>
      </div>
      <table
        border={1}
        style={{
          width: '100%',
          borderSpacing: 1,
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
        }}>
        <tbody>
        <tr>
          <td style={labelStyle}>申请人</td>
          <td style={valueStyle}>{record.userResult?.name}</td>
          <td style={labelStyle}>申请人部门</td>
          <td style={valueStyle}>{record.userResult?.deptResult?.fullName}</td>
        </tr>
        <tr>
          <td style={labelStyle}>提交时间</td>
          <td style={valueStyle}>{moment.unix(info.applyTime).format('YYYY/MM/DD hh:mm:ss')}</td>
          <td style={labelStyle}>当前审批状态</td>
          <td style={valueStyle}>{statusData(info.spStatus).text}</td>
        </tr>
        <tr>
          {spaceDom}
        </tr>
        <tr>
          <td colSpan="4" style={labelStyle}>申请内容</td>
        </tr>
        {
          contents.map((item, index) => {
            if (item.control === 'File') {
              return <tr key={index} />;
            }
            const label = isArray(item.titles).find(item => item.lang === 'zh_CN')?.text;
            if (item.control === 'Textarea' || index === contents.length - 1) {
              return <tr key={index}>
                <td style={labelStyle}>{label}</td>
                <td style={valueStyle} colSpan="3">
                  {contentRender(item)}
                </td>
              </tr>;
            }

            if (exitItems.find(exitItem => exitItem === item.id)) {
              return <tr key={index} />;
            }
            exitItems.push(contents[index + 1].id);
            const labelLast = isArray(contents[index + 1].titles).find(item => item.lang === 'zh_CN')?.text;
            return <tr key={index}>
              <td style={labelStyle}>{label}</td>
              <td style={valueStyle}>{contentRender(item)}</td>
              <td style={labelStyle}>{labelLast}</td>
              <td style={valueStyle}>{contentRender(contents[index + 1])}</td>
            </tr>;
          })
        }
        <tr>
          {spaceDom}
        </tr>
        <tr>
          <td colSpan="4" style={labelStyle}>审批流程-{statusData(info.spStatus).text}</td>
        </tr>
        <tr>
          <td style={labelStyle}>审批节点</td>
          <td style={labelStyle}>审批人</td>
          <td style={labelStyle} colSpan="2">操作记录</td>
        </tr>
        {
          spRecords.map((item, index) => {
            const details = (item.details || []).filter(item => item.spStatus !== 'AUDITING');
            const {statusName} = statuRender(item, index);

            return details.map((userItem, userIndex) => {

              const {userStatusName} = userStatusRender(userItem);
              const users = userData?.data || [];
              const user = users.find(item => item.openId === userItem.approver?.userId) || {};

              return <tr key={userIndex}>
                <td hidden={userIndex !== 0} style={auditValueStyle} rowSpan={details.length}>
                  <div>审批人 ({item.approverAttr === 'ONE_SIGN' ? '或签' : '依次审批'})</div>
                  <div>{statusName}</div>
                </td>
                <td style={auditValueStyle}>{user.name || '-'}</td>
                <td style={auditValueStyle} colSpan="2">
                  <div hidden={!userStatusName}>
                    {userStatusName} {moment.unix(userItem.spTime).format('MM/DD hh:mm')}
                  </div>
                </td>
              </tr>;
            });
          })
        }
        {
          (notifiers.length > 0 && send) && <tr>
            <td style={auditValueStyle}>
              <div>抄送人</div>
              <div>{send && '已抄送'}</div>
            </td>
            <td style={auditValueStyle} colSpan="4">
              {sendUser.name || '-'}
              &nbsp;
              共{notifiers.length}人
              &nbsp;
              已抄送
              &nbsp;
              {moment.unix(isArray(spRecords[spRecords.length - 1].details).find(item => item.spStatus === 'PASSED')?.spTime).format('YYYY/MM/DD hh:mm')}
            </td>
          </tr>
        }
        </tbody>
      </table>
      <div
        style={{
          paddingTop: 25,
          fontSize: 12,
          textAlign: 'right',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              marginLeft: 30,
            }}
          >
            打印日期：{moment().format('YYYY/MM/DD hh:mm')}
          </div>
          <br />
          <div
            style={{
              display: 'inline-block',
              marginLeft: 30,
            }}
          >
            打印人：{state.name}
          </div>
        </div>
      </div>
    </div>
  </div>;
};

export default PrintTemplate;
