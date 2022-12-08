import React, {useRef, useState} from 'react';
import ProSkeleton from '@ant-design/pro-skeleton';
import {Button, Card, List, Pagination, Space} from 'antd';
import {useHistory} from 'ice';
import {useRequest} from '@/util/Request';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import Breadcrumb from '@/components/Breadcrumb';
import Label from '@/components/Label';
import styles from './index.module.less';
import {productionPlanList} from '@/pages/Production/Url';
import Empty from '@/components/Empty';
import Modal from '@/components/Modal';
import AddProductionPlan from '@/pages/Production/ProductionPlan/AddProductionPlan';
import {isArray} from '@/util/Tools';
import Note from '@/components/Note';
import {FormLayoutSubmit} from '@/components/Form/components/FormLayout';

const PlanList = () => {

  const history = useHistory();

  const [currentStep, setCurrentStep] = useState({});

  const ref = useRef();
  const formRef = useRef();

  const {loading, data, run} = useRequest({...productionPlanList, response: true});

  if (loading) {
    return <ProSkeleton type="descriptions" />;
  }

  if (!data) {
    return <Empty />;
  }

  return <>
    <Card title={<Breadcrumb />} extra={<Button type="primary" onClick={() => ref.current.open(false)}>增加生产计划</Button>}>
      <div className="div_center">
        <List
          bordered={false}
          dataSource={data.data || []}
          renderItem={(planItem) => (
            <div style={{margin: '16px 0'}}>
              <Card
                type="inner"
                title={<Space size={24}>
                  <div><Label>计划编号：</Label> {planItem.coding}</div>
                  <div><Label>主题：</Label>{planItem.theme}</div>
                  <div><Label>负责人：</Label> {planItem.userResult && planItem.userResult.name}</div>
                </Space>}
                bodyStyle={{padding: 0}}
                extra={<Space size={24}>
                  <div>
                    <Label>创建时间：</Label>{planItem.createTime}
                  </div>
                  <div>
                    <Label>执行时间：</Label>{planItem.executionTime} - {planItem.endTime}
                  </div>
                </Space>}
              >
                <List
                  bordered={false}
                  dataSource={[1]}
                  renderItem={() => {
                    const details = isArray(planItem.planDetailResults);
                    return <div className={styles.parent}>
                      <div className={styles.leftDiv}>
                        {details.length === 0 && <Empty />}
                        {
                          details.map((rowItem, index) => {
                            const skuResult = rowItem.skuResult || {};
                            return <div key={index} style={{padding: 24, borderBottom: 'solid #eee 1px'}}>
                              <Space size={24}>
                                <Space direction="vertical">
                                  <div>
                                    <Label>物料编码：</Label>{skuResult && skuResult.standard}
                                  </div>
                                  <Button type="link" style={{padding: 0}}>
                                    <SkuResultSkuJsons skuResult={skuResult} />
                                  </Button>
                                </Space>
                                <div>
                                  × {rowItem.planNumber}
                                </div>
                              </Space>
                              <div style={{float: 'right', lineHeight: '62px', display: 'flex'}}>
                                <Label>物料描述：</Label>
                                <Note maxWidth={300}><SkuResultSkuJsons describe skuResult={skuResult} /></Note>
                              </div>
                            </div>;
                          })
                        }</div>
                      <div className={styles.rightDiv} onClick={() => {
                        history.push(`/production/productionPlan/detail?id=${planItem.productionPlanId}`);
                      }}>详情
                      </div>
                    </div>;
                  }} />
              </Card>
            </div>
          )}
        />
      </div>
    </Card>
    <div style={{textAlign: 'center', padding: 8}}>
      <Pagination
        total={data.count}
        current={data.current}
        pageSize={data.pageSize}
        pageSizeOptions={[5, 10, 15, 20, 50]}
        onChange={(page, limit) => {
          run({
            params: {
              limit,
              page
            }
          });
        }}
        onShowSizeChange={(page, limit) => {
          run({
            params: {
              limit,
              page
            }
          });
        }}
        showSizeChanger
        showQuickJumper
        showTotal={total => `共${total}条`}
      />
    </div>

    <Modal
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      compoentRef={formRef}
      title="生产计划"
      width="auto"
      ref={ref}
      component={AddProductionPlan}
      onSuccess={() => {
        ref.current.close();
        run({
          params: {
            limit: 10,
            page: 1
          }
        });
      }}
      footer={<Space>
        <Button onClick={() => ref.current.close()}>取消</Button>
        <Button type="primary" onClick={() => FormLayoutSubmit({
          currentStep,
          setCurrentStep,
          formRef
        })}>{currentStep.step < isArray(currentStep.steps).length - 1 ? '下一步' : '保存'}</Button>
      </Space>}
    />
  </>;
};

export default PlanList;
