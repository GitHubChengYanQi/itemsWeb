import React, {useEffect} from 'react';
import {Button, Card, Descriptions, Divider, Image, Progress, Space} from 'antd';
import {getSearchParams, useHistory} from 'ice';
import ProSkeleton from '@ant-design/pro-skeleton';
import ProCard from '@ant-design/pro-card';
import {RollbackOutlined} from '@ant-design/icons';
import Breadcrumb from '@/components/Breadcrumb';
import {useRequest} from '@/util/Request';
import {productionPlanDetail} from '@/pages/Production/Url';
import Empty from '@/components/Empty';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import ProductionCard from '@/pages/Production/ProductionPlan/PlanDetail/components/ProductionCard';
import styles from '@/pages/Production/ProductionPlan/PlanList/index.module.less';
import {isArray, rateTool} from '@/util/Tools';
import store from '@/store';


const PlanDetail = () => {

  const params = getSearchParams();

  const history = useHistory();

  const {loading, data, run} = useRequest(productionPlanDetail, {manual: true});

  const [dataSource] = store.useModel('dataSource');

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

  const planDetailResult = data.planDetailResults || [];
  const planNumber = planDetailResult[0] ? planDetailResult[0].planNumber : 0;
  const skuResult = planDetailResult[0] ? planDetailResult[0].skuResult : {};
  const bom = planDetailResult[0] ? planDetailResult[0].partsResult : {};

  let skuImg = '';
  if (skuResult && skuResult.images) {
    const imgResult = isArray(skuResult.imgResults).find(item => item.mediaId === skuResult.images.split(',')[0]);
    if (imgResult) {
      skuImg = imgResult.thumbUrl;
    }
  }
  return <>
    <Card title={<Breadcrumb title="生产计划详情" />} extra={<Button icon={<RollbackOutlined />} onClick={() => {
      history.goBack();
    }}>返回</Button>}>
      <div className="div_center">
        <ProCard className="h2Card" title="基本信息" headerBordered>
          <Descriptions>
            <Descriptions.Item label="计划编号">{data.coding}</Descriptions.Item>
            <Descriptions.Item label="创建人">{data.createUserResult && data.createUserResult.name}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
          </Descriptions>
        </ProCard>
        <ProCard className="h2Card" title="生产信息" headerBordered>
          <Space size={24}>
            <Space>
              <Image
                style={{borderRadius: 4}}
                width={65}
                src={skuImg || dataSource?.publicInfo?.imgLogo}
              />
              <div>
                <div>
                  {skuResult.standard}
                </div>
                <div>
                  {SkuResultSkuJsons({skuResult})}
                </div>
                <div>
                  版本号：{bom.version}
                </div>
              </div>
            </Space>
            <div>
              x <span style={{fontSize: 18, fontWeight: 'bold'}}>{planNumber}</span>
            </div>
          </Space>
          <Divider />
          <Descriptions column={4}>
            <Descriptions.Item label="物料总数">
              {data.skuCount}
            </Descriptions.Item>
            <Descriptions.Item label="出库中">
              <span style={{color: '#1890ff'}}>
                {data.numberCount} ({rateTool(data.numberCount, data.skuCount)})
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="已出库">
              <span style={{color: '#52c41a'}}>
                {data.receivedCount} ({rateTool(data.receivedCount, data.skuCount)})
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="出库进度">
              <Progress
                className={styles.progress}
                format={() => <></>}
                percent={rateTool(data.numberCount, data.skuCount, true)}
                success={{
                  percent: rateTool(data.receivedCount, data.skuCount, true),
                }}
              />
            </Descriptions.Item>
          </Descriptions>
          <Divider />
          <Descriptions column={4}>
            <Descriptions.Item label="Bom总数">
              {data.bomCount}
            </Descriptions.Item>
            <Descriptions.Item label="生产完成">
              <span style={{color: '#52c41a'}}>
                {data.doneBomCount}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="生产进度">
              <Progress
                strokeColor="#52c41a"
                percent={rateTool(data.doneBomCount, data.bomCount, true)}
              />
            </Descriptions.Item>
          </Descriptions>

        </ProCard>
        <ProCard className="h2Card" title="生产卡片" headerBordered>
          <ProductionCard bomCount={data.bomCount} productionPlanId={params.id} />
        </ProCard>
      </div>
    </Card>
  </>;
};

export default PlanDetail;
