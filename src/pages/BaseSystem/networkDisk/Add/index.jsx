import React, {useState} from 'react';
import {Button, Divider, Space} from 'antd';
import AutoFocus from '@/components/AutoFocus';
import TranserUsers from '@/pages/BaseSystem/user/components/TranserUsers';
import Modal from '@/components/Modal';
import {useRequest} from '@/util/Request';
import {addUrl} from '@/pages/BaseSystem/networkDisk/url';

const Add = (
  {
    addSpaceRef,
    onSuccess
  }
) => {

  const {loading: addLoading, run: addRun} = useRequest(addUrl, {
    manual: true,
    onSuccess
  });

  const [spaceName, setSpaceName] = useState();

  const [userIds, setUserIds] = useState([]);

  return <>
    <Modal
      headTitle="添加空间"
      ref={addSpaceRef}
      footer={<Space>
        <Button onClick={() => {
          addSpaceRef.current.close();
        }}>取消</Button>
        <Button loading={addLoading} type="primary" onClick={() => {
          addRun({
            data: {
              userIds,
              spaceName
            }
          });
        }}>确认</Button>
      </Space>}
    >
      <div style={{padding: '16px 32px'}}>
        <div>
          空间名
          <Divider style={{margin: '16px 0'}} />
        </div>
        <AutoFocus value={spaceName} placeholder="请输入空间名" onChange={({target: {value}}) => {
          setSpaceName(value);
        }} />
        <div style={{paddingTop: 24}}>
          设置权限
          <Divider style={{margin: '16px 0'}} />
          <TranserUsers value={userIds} onChange={(userIds) => {
            setUserIds(userIds);
          }} />
        </div>
      </div>
    </Modal>
  </>;
};

export default Add;
