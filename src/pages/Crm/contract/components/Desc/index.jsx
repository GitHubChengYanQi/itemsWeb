import React from 'react';
import {Descriptions} from 'antd';
import {useHistory} from 'ice';

const Desc = (props) => {

  const history = useHistory();

  const {data} = props;
  if (data) {
    return (
      <>
        <Descriptions column={2}>
          <Descriptions.Item label="甲方信息">
            <div style={{cursor: 'pointer'}} onClick={() => {
              history.push(`/CRM/customer/${data.partyA}`);
            }}>
              <strong>{data.partA ? data.partA.customerName : null}</strong>
              <div>
                <em>联系人：{data.partyAContacts ? data.partyAContacts.contactsName : '--'}</em>&nbsp;&nbsp;/&nbsp;&nbsp;
                <em>电话：{data.phoneA ? data.phoneA.phoneNumber : '--'}</em></div>
              <div>
                <em>{data.partyAAdress ? data.partyAAdress.location : '---'}</em>
              </div>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="乙方信息">
            <div style={{cursor: 'pointer'}} onClick={() => {
              history.push(`/CRM/customer/${data.partyB}`);
            }}>
              <strong>{data.partB ? data.partB.customerName : null}</strong>
              <div>
                <em>联系人：{data.partyBContacts ? data.partyBContacts.contactsName : '--'}</em>&nbsp;&nbsp;/&nbsp;&nbsp;
                <em>电话：{data.phoneB ? data.phoneB.phoneNumber : '--'}</em></div>
              <div>
                <em>{data.partyAAdress ? data.partyAAdress.location : '---'}</em>
              </div>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </>
    );
  } else {
    return null;
  }

};

export default Desc;
