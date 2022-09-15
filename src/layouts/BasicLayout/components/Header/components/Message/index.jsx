import React, {useState} from 'react';
import {AlertOutlined, BellOutlined,  MessageOutlined} from '@ant-design/icons';
import {Badge, Button, Drawer, Tabs} from 'antd';
import ProSkeleton from '@ant-design/pro-skeleton';
import {useRequest} from '@/util/Request';
import Empty from '@/components/Empty';
import Commission from '@/layouts/BasicLayout/components/Header/components/Commission';

const Message = () => {

  const {loading, data, run} = useRequest({url: '/message/list', method: 'POST'}, {manual: true});

  const [visible, setVisible] = useState(false);

  const [key, setKey] = useState('2');

  const content = () => {
    switch (key) {
      case '0':
        return <Empty />;
      case '1':
        return <Empty />;
      case '2':
        return <Commission onClose={() => {
          setVisible(false);
        }} data={data} />;
      default:
        break;
    }
  };

  const title = () => {
    return <Tabs
      activeKey={key}
      onChange={(value) => {
        setKey(value);
        switch (value) {
          case '0':
            break;
          case '1':
            break;
          case '2':
            run();
            break;
          default:
            break;
        }
      }}
    >
      <Tabs.TabPane tab={<Badge count={0} size="small"><div style={{padding:3}}><MessageOutlined style={{marginRight:4}} />消息</div></Badge>} key="0" />
      <Tabs.TabPane tab={<Badge count={1} size="small"><div style={{padding:3}}><BellOutlined style={{marginRight:4}} />通知</div></Badge>} key="1" />
      <Tabs.TabPane tab={<Badge count={5} size="small"><div style={{padding:3}}><AlertOutlined style={{marginRight:4}} />待办</div></Badge>} key="2" />
    </Tabs>;
  };

  return (
    <>
      <Button
        type="text"
        size="large"
        icon={<BellOutlined />}
        style={{height: 60, color: '#FFF'}}
        onClick={() => {
          setVisible(true);
        }}
      />

      <Drawer
        closable={false}
        destroyOnClose
        afterOpenChange={() => {
          run();
        }}
        style={{marginTop: 60}}
        bodyStyle={{padding: 0, marginBottom: '5vh'}}
        onClose={() => {
          setVisible(false);
        }}
        open={visible}
        title={title()}
      >
        {
          loading
            ?
            <ProSkeleton type="descriptions" />
            :
            content()
        }
      </Drawer>
    </>
  );
};

export default Message;
