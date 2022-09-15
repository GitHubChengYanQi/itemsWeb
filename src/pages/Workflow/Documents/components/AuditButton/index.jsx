import React, {useState} from 'react';
import {Button, Modal, Space} from 'antd';
import MentionsNote from '@/pages/Process/Action/components/MentionsNote';
import {useRequest} from '@/util/Request';
import Message from '@/components/Message';

const AuditButton = ({
  res,
  refresh = () => {
  },
  taskId
}) => {

  const [visible, setVisible] = useState(false);
  const [imgs, setImgs] = useState([]);
  const [users, setUsers] = useState([]);
  const [note, setNote] = useState('');

  // 执行审批接口
  const {loading: actionLoading, run: processLogRun} = useRequest(
    {
      url: '/audit/post',
      method: 'POST',
    },
    {
      manual: true,
      onSuccess: () => {
        refresh();
        Message.success('审批成功！');
        setVisible(false);
      },
      onError: () => {
        refresh();
        Message.error('审批失败！');
        setVisible(false);
      },
    },
  );

  const clear = () => {
    setUsers([]);
    setImgs([]);
    setNote('');
  };

  return <>
    <Space>
      <Button hidden={!res.permissions} type="primary" ghost onClick={() => {
        clear();
        setVisible('agree');
      }}>同意</Button>
      <Button hidden={!res.permissions} danger onClick={() => {
        clear();
        setVisible('reject');
      }}>拒绝</Button>
    </Space>

    <Modal
      title={`是否${visible === 'agree' ? '同意' : '拒绝'}审批`}
      open={visible}
      confirmLoading={actionLoading}
      okButtonProps={{danger: visible !== 'agree'}}
      okText={visible === 'agree' ? '同意审批' : '拒绝审批'}
      onOk={() => {
        const userIds = [];
        users.map((item) => {
          if (note.indexOf(item.name) !== -1) {
            return userIds.push(item.id);
          }
          return null;
        });
        processLogRun({
          data: {
            taskId,
            status: visible === 'agree' ? 1 : 0,
            userIds: userIds.toString(),
            photoId: imgs.toString(),
            note,
          },
        });
      }}
      onCancel={() => {
        setVisible(false);
      }}
    >
      <MentionsNote
        users={users}
        value={note}
        placeholder="添加备注，可@相关人员..."
        onChange={setNote}
        getUsers={setUsers}
        getImgs={setImgs}
      />
    </Modal>
  </>;
};

export default AuditButton;
