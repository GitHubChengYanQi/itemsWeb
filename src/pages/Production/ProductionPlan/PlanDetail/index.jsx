import React, {useEffect} from 'react';
import {Button, Card, Descriptions, List, Space} from 'antd';
import {getSearchParams, useHistory} from 'ice';
import ProSkeleton from '@ant-design/pro-skeleton';
import ProCard from '@ant-design/pro-card';
import {RollbackOutlined} from '@ant-design/icons';
import Label from '@/components/Label';
import Breadcrumb from '@/components/Breadcrumb';
import {useRequest} from '@/util/Request';
import {productionPlanDetail} from '@/pages/Production/Url';
import Empty from '@/components/Empty';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import ShipList from '@/pages/Production/ProductionPlan/ShipList';


const PlanDetail = () => {

  const params = getSearchParams();

  const history = useHistory();

  const {loading, data, run} = useRequest(productionPlanDetail, {manual: true});

  useEffect(() => {
    if (params.id) {
      run({data: {productionPlanId: params.id}});
    }
  }, []);

  if (loading) {
    return <ProSkeleton type="descriptions" />;
  }

  if (!data) {
    return <Empty />;
  }

  return <>
    <Card title={<Breadcrumb title="生产计划详情" />} extra={<Button icon={<RollbackOutlined />} onClick={() => {
      history.goBack();
    }}>返回</Button>}>
      <div className="div_center">
        <ProCard className="h2Card" title="基本信息" headerBordered>
          <Descriptions>
            <Descriptions.Item label={<Label>计划编号</Label>}>{data.coding}</Descriptions.Item>
            <Descriptions.Item label={<Label>主题</Label>}>{data.theme}</Descriptions.Item>
            <Descriptions.Item label={<Label>负责人</Label>}>{data.userResult && data.userResult.name}</Descriptions.Item>
            <Descriptions.Item label={<Label>执行时间</Label>}>{data.executionTime}</Descriptions.Item>
            <Descriptions.Item label={<Label>创建时间</Label>}>{data.createTime}</Descriptions.Item>
          </Descriptions>
        </ProCard>
        <ProCard className="h2Card" title="生产信息" headerBordered>
          <List
            bordered={false}
            dataSource={data.planDetailResults}
            renderItem={(item) => {
              const skuResult = item.skuResult || {};
              return <List.Item>
                <Space size={24}>
                  <Space direction="vertical">
                    <div>
                      <Label>物料编码：</Label>{skuResult.standard}
                    </div>
                    <Button type="link" style={{padding: 0}}>
                      <SkuResultSkuJsons skuResult={skuResult} />
                    </Button>
                  </Space>
                  <div>
                    × {item.planNumber}
                  </div>
                </Space>
                <div style={{float: 'right', lineHeight: '62px'}}>
                  <Label>物料描述：</Label>
                  <SkuResultSkuJsons describe skuResult={skuResult} />
                </div>
              </List.Item>;
            }}
          />
        </ProCard>
        <ProCard className="h2Card" title="生产工序" headerBordered>
          <ShipList data={data.workOrderResults} />
        </ProCard>
      </div>
    </Card>
  </>;
};

export default PlanDetail;
