import React from 'react';
import {Avatar, Card} from 'antd';
import ProSkeleton from '@ant-design/pro-skeleton';
import {useHistory} from 'ice';
import {ProfileOutlined} from '@ant-design/icons';
import styles from '@/pages/Overview/index.module.scss';
import {useRequest} from '@/util/Request';
import Empty from '@/components/Empty';

const Business = () => {

  const history = useHistory();

  const {loading, data} = useRequest({url: '/crmBusiness/list', method: 'POST'}, {manual: true});

  if (loading) {
    return (<ProSkeleton type="descriptions" />);
  }

  const renderTitle = (title) => {
    return (
      <div>
        <Avatar icon={<ProfileOutlined />} style={{marginRight: 8}} />{title || '项目标题'}
      </div>
    );
  };


  return (
    <Card title="进行中的项目" extra={<a onClick={() => {
      history.push('/CRM/business');
    }}>全部项目</a>} style={{marginBottom: 24, cursor: 'pointer'}}>
      {(data && data.length > 0) ? data.map((items, index) => {
        if (index < 6) {
          return (
            <Card.Grid key={index} onClick={() => {
              history.push(`/CRM/business/${items.businessId}`);
            }} className={styles.gridStyle}>
              <Card.Meta
                // avatar={}
                title={renderTitle(items.businessName)}
                description={
                  <>
                    <div>创建时间：{items.createTime || '暂无'}</div>
                    <div>负责人：{items.user && items.user.name || '暂无'}</div>
                    <div>项目流程：{items.process && items.process.name || '暂无'}</div>
                  </>
                }
              />
            </Card.Grid>
          );
        } else {
          return null;
        }
      }) : <Empty description='暂无项目' />}
    </Card>
  );
};
export default Business;
