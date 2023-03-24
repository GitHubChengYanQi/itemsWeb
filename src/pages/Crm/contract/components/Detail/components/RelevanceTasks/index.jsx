import React from 'react';
import {Avatar, List, Progress, Space, Spin, Tabs, Tag} from 'antd';
import {useRequest} from '@/util/Request';
import {isArray, timeDifference} from '@/util/Tools';
import {UserOutlined} from '@ant-design/icons';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';

export const skuHandleRecordList = {url: '/skuHandleRecord/list', method: 'POST'};
export const relevanceTasksUrl = {url: '/activitiProcessTask/aboutOrderInStockTaskList', method: 'POST'};

const RelevanceTasks = ({
  orderId
}) => {

  const {loading, data} = useRequest({...relevanceTasksUrl, data: {orderId}});
  const {loading: skuLogLoading, data: skuLogs} = useRequest({...skuHandleRecordList, data: {orderId}});
  console.log(skuLogs);
  return <div style={{padding: '0 24px 24px'}}>
    <Tabs defaultActiveKey="1" items={[
      {
        key: '1',
        label: '任务列表',
        children: loading ? <Spin /> : <>
          <List
            style={{marginTop: -16}}
            dataSource={isArray(data)}
            renderItem={(item) => {
              let color = '';
              switch (item.status) {
                case 49:
                  color = '#9a9a9a';
                  break;
                case 50:
                  color = 'var(--adm-color-danger)';
                  break;
                case 99:
                  color = '#52c41a';
                  break;
                default:
                  color = '#1677ff';
                  break;
              }
              const receipts = item.receipts || {};

              const percent = Number(((receipts.inStockNum / receipts.applyNum) * 100).toFixed(2)) || 0;

              return <List.Item
                extra={timeDifference(item.createTime)}
              >
                <List.Item.Meta
                  title={<div>
                    {item.coding} <Tag color={color}>{receipts.statusName}</Tag>
                  </div>}
                  description={<div>
                    <div>{item.theme}</div>
                    <div>执行人：{isArray(item.processUsers).map(item => item.userName).join(',') || '--'}</div>
                    <Progress percent={percent} />
                  </div>}
                />
              </List.Item>;
            }}
          />
        </>
      }, {
        key: '2',
        label: '入库记录',
        children: skuLogLoading ? <Spin /> : <>
          <List
            style={{marginTop: -16}}
            dataSource={isArray(skuLogs)}
            renderItem={(item) => {
              const user = item.user || {};
              return <List.Item
                extra={timeDifference(item.operationTime)}
              >
                <List.Item.Meta
                  avatar={<Avatar
                    src={user.avatar}
                    style={{
                      borderRadius: 4,
                    }}
                    shape="square"
                    icon={<UserOutlined />}
                  />}
                  title={user.name}
                  description={<div style={{color:'#000'}}>
                    {SkuResultSkuJsons({skuResult: item.skuResult})}
                    <div>
                      <Space size={24}>
                        <div style={{color: '#1677ff'}}>入库数量 x{item.operationNumber}</div>
                        <div style={{color: '#52c41a'}}>结余：x{item.balanceNumber}</div>
                      </Space>
                    </div>
                  </div>}
                />
              </List.Item>;
            }}
          />
        </>
      }]}
    />
  </div>;
};

export default RelevanceTasks;
