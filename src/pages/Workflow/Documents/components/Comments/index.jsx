import React, {useState} from 'react';
import ProCard from '@ant-design/pro-card';
import {FormOutlined} from '@ant-design/icons';
import {Avatar, Button, Comment, Image, List, Modal} from 'antd';
import MentionsNote from '@/pages/Process/Action/components/MentionsNote';
import {useRequest} from '@/util/Request';
import Message from '@/components/Message';

const Comments = ({
  data,
  taskId,
  refresh = () => {
  },
}) => {

  const [visible, setVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [users, setUsers] = useState([]);
  const [note, setNote] = useState('');

  // 任务评论
  const {loading: commentsLoading, run: taskComments} = useRequest(
    {
      url: '/audit/comments',
      method: 'POST',
    },
    {
      manual: true,
      onSuccess: () => {
        refresh();
        Message.success('评论成功！');
        setVisible(false);
      },
      onError: () => {
        refresh();
        Message.error('评论失败！');
        setVisible(false);
      },
    },
  );


  return <>

    {
      Array.isArray(data) && data.length !== 0
        ?
        <ProCard
          title={`评论(${data.length})`}
          extra={<FormOutlined onClick={() => {
            setVisible(true);
          }} />}
          className="h2Card"
          headerBordered>
          <List
            className="comment-list"
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <li>
                <Comment
                  actions={item.photoId && [
                    <Image.PreviewGroup>
                      {
                        item.photoId.split(',').map((item,index) => {
                          return <Image key={index} height={100} src={item} />;
                        })
                      }
                    </Image.PreviewGroup>
                  ]}
                  author={item.user.name}
                  avatar={<Avatar
                    shape="square"
                    size={24}
                    style={{fontSize: 14}}>
                    {item.user.name.substring(0, 1)}
                  </Avatar>}
                  content={item.content}
                  datetime={item.createTime}
                />
              </li>
            )}
          />
        </ProCard>

        :
        <div style={{padding: 16}}>
          <Button
            style={{width: '100%'}}
            onClick={() => {
              setVisible(true);
            }}
          >
            <FormOutlined /> 添加评论
          </Button>
        </div>}


    <Modal
      title="添加评论"
      open={visible}
      okButtonProps={{loading: commentsLoading}}
      okText="发表"
      onOk={() => {
        const userIds = [];
        users.map((item) => {
          if (note.indexOf(item.name) !== -1) {
            return userIds.push(item.id);
          }
          return null;
        });
        taskComments({
          data: {
            taskId,
            status: visible === 'agree' ? 1 : 0,
            userIds: userIds.toString(),
            photoId: images.toString(),
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
        getImgs={setImages}
      />
    </Modal>

  </>;
};

export default Comments;
