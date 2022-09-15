import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'ice';
import ProCard from '@ant-design/pro-card';
import {Avatar, Button, Card, Comment, Image, List, message, Modal, notification, Space} from 'antd';
import ProSkeleton from '@ant-design/pro-skeleton';
import {FormOutlined} from '@ant-design/icons';
import Empty from '@/components/Empty';
import {useRequest} from '@/util/Request';
import QualityTask from '@/pages/Process/Action/components/QualityTask';
import PurchaseAsk from '@/pages/Process/Action/components/PurchaseAsk';
import PurchasePlan from '@/pages/Process/Action/components/PurchasePlan';
import ProcessSteps from '@/pages/Process/Action/components/ProcessSteps';
import MentionsNote from '@/pages/Process/Action/components/MentionsNote';
import PurchaseOrder from '@/pages/Process/Action/components/PurchaseOrder';

const Action = () => {

  const params = useParams();

  const history = useHistory();

  const [visible, setVisible] = useState(false);

  const [comments, setComments] = useState(false);

  const [imgs, setImgs] = useState([]);

  const [userIds, setUserIds] = useState([]);

  const [note, setNote] = useState('');

  const clearState = () => {
    setComments(false);
    setVisible(false);
    setNote('');
    setUserIds([]);
    setImgs([]);
  };

  // 审批详情接口
  const {loading, data, run, refresh} = useRequest(
    {
      url: '/audit/detail',
      method: 'GET',
    }, {
      manual: true,
    },
  );


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
        notification.success({
          message: '评论完成！',
        });
        clearState();
      },
      onError: () => {
        refresh();
        notification.success({
          message: '评论失败！',
        });
        clearState();
      },
    },
  );

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
        notification.success({
          message: '审批完成！',
        });
        clearState();
      },
      onError: () => {
        refresh();
        notification.success({
          message: '审批失败！',
        });
        clearState();
      },
    },
  );

  const module = (value) => {
    switch (value) {
      case 'quality_task':
        return <QualityTask />;
      case 'purchase':
      case 'purchaseAsk':
        return <PurchaseAsk data={data.object} />;
      case 'purchasePlan':
        return <PurchasePlan />;
      case 'procurementOrder':
        return <PurchaseOrder data={data.object} />;
      default:
        break;
    }
  };

  useEffect(() => {
    if (params.id) {
      run(
        {
          params: {
            taskId: params.id,
          },
        }
      );
    }
  }, [params.id]);

  if (loading) {
    return <ProSkeleton type="descriptions" />;
  }

  if (!params.id || !data) {
    return <Empty style={{padding: 45}} description="暂无审批" />;
  }

  return <Card title={data.taskName}>
    <div style={{maxWidth: 1220, margin: 'auto', marginTop: 24}}>
      <ProCard title="任务信息" className="h2Card" headerBordered extra={<Button type="link" onClick={() => {
        switch (data.type) {
          case 'quality_task':
            history.push('/production/qualityCheck');
            break;
          case 'purchase':
          case 'purchaseAsk':
            history.push(`/purchase/purchaseAsk?id=${data.formId}`);
            break;
          case 'purchasePlan':
            history.push(`/purchase/procurementPlan/${111}`);
            break;
          case 'procurementOrder':
            history.push(`/purchase/procurementOrder/${data.formId}`);
            break;
          default:
            break;
        }
      }}>查看详情</Button>}>
        {module(data.type)}
      </ProCard>
      <ProCard
        title="审批流程"
        className="h2Card"
        headerBordered
        extra={data.permissions && <Space>
          审批操作：
          <Button type="primary" onClick={() => {
            setVisible('agree');
          }}>同意</Button>
          <Button onClick={() => {
            setVisible('reject');
          }}>拒绝</Button>
        </Space>}
      >
        <ProcessSteps data={data.stepsResult} createName={data.createName} />
      </ProCard>
      {data.remarks && data.remarks.length > 0 ?
        <ProCard
          title={`评论(${data.remarks.length})`}
          extra={<FormOutlined onClick={() => {
            setComments(true);
          }} />}
          className="h2Card"
          headerBordered>
          <List
            className="comment-list"
            itemLayout="horizontal"
            dataSource={data.remarks}
            renderItem={item => (
              <li>
                <Comment
                  actions={item.photoId && [
                    <Image.PreviewGroup>
                      {
                        item.photoId.split(',').map((item) => {
                          return <Image width={100} src={item} />;
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
        </ProCard> :
        <div style={{padding: 16}}>
          <Button
            style={{width: '100%'}}
            onClick={() => {
              setComments(true);
            }}
          >
            <FormOutlined /> 添加评论
          </Button>
        </div>}
    </div>

    <Modal
      title={comments ? '添加评论' : `是否${visible === 'agree' ? '同意' : '拒绝'}审批`}
      open={visible || comments}
      confirmLoading={actionLoading || commentsLoading}
      okText={comments ? '发表' : '确定'}
      onOk={() => {
        if (visible) {
          processLogRun({
            data: {
              taskId: params.id,
              status: visible === 'agree' ? 1 : 0,
              userIds: userIds.filter((item, index) => {
                return userIds.indexOf(item, 0) === index;
              }).toString(),
              photoId: imgs.toString(),
              note,
            },
          });
        } else if (comments) {
          if (note)
            taskComments({
              data: {
                taskId: params.id,
                userIds: userIds.filter((item, index) => {
                  return userIds.indexOf(item, 0) === index;
                }).toString(),
                photoId: imgs.toString(),
                note,
              },
            });
          else {
            message.warn('请输入备注!');
          }
        }
      }}
      onCancel={() => {
        setVisible(false);
        setComments(false);
      }}
    >
      <MentionsNote
        placeholder={visible ? '添加备注，可@相关人员...' : '添加评论，可@相关人员...'}
        onChange={(value) => {
          setNote(value);
        }}
        value={note}
        getUserIds={(value) => {
          const users = value.map((items) => {
            return items.value;
          });
          setUserIds(users);
        }}
        getImgs={(img) => {
          setImgs(img);
        }}
      />
    </Modal>

  </Card>;
};

export default Action;
