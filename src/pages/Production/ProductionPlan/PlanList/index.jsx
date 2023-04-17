import React, {useRef, useState} from 'react';
import {Button, Divider, Input, Progress, Space, Tag} from 'antd';
import {useHistory} from 'ice';
import {productionPlanList} from '@/pages/Production/Url';
import Modal from '@/components/Modal';
import {isArray, rateTool} from '@/util/Tools';
import Table from '@/components/Table';
import Breadcrumb from '@/components/Breadcrumb';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import Form from '@/components/Form';
import PlanAdd from '@/pages/Production/ProductionPlan/PlanAdd';
import styles from './index.module.less';
import Note from '@/components/Note';

const {FormItem} = Form;

const PlanList = () => {

  const history = useHistory();

  const [currentStep, setCurrentStep] = useState(0);
  const [addLoading, setAddLoading] = useState(false);

  const ref = useRef();
  const listRef = useRef();
  const formRef = useRef();

  const columns = [
    {title: '计划编号', dataIndex: 'coding'},
    {
      title: '生产Bom', dataIndex: 'skuResult', render(skuResult) {
        return SkuResultSkuJsons({skuResult});
      }
    },
    {
      title: '版本号', dataIndex: 'partsResult', width: 100, align: 'center', render(partsResult) {
        return <Tag color="processing"><Note maxWidth={200}>{partsResult.version || '-'}</Note></Tag>;
      }
    },
    {
      title: '生产数量', dataIndex: 'planNumber', width: 100, align: 'center', render(value) {
        return <div style={{marginTop: -8}}>x <span style={{fontSize: 20, fontWeight: 'bold'}}>{value}</span></div>;
      }
    },
    {
      title: '出库信息', dataIndex: 'skuCount', align: 'center', render(value, record) {
        return <div>
          物料总数：{record.skuCount}
          <Divider type="vertical" />
          <span style={{color: '#1890ff'}}>
            出库中：{record.numberCount} ({rateTool(record.numberCount, record.skuCount)})
          </span>
          <Divider type="vertical" />
          <span style={{color: '#52c41a'}}>
            已出库： {record.receivedCount} ({rateTool(record.receivedCount, record.skuCount)})
          </span>
        </div>;
      }
    },
    {
      title: '出库进度', dataIndex: 'skuCount', align: 'center', width: 200, render(value, record) {
        return <Progress
          className={styles.progress}
          format={() => <></>}
          percent={rateTool(record.numberCount, record.skuCount, true)}
          success={{
            percent: rateTool(record.receivedCount, record.skuCount, true),
          }}
        />;
      }
    },
    {
      title: '生产信息', align: 'center', dataIndex: 'doneBomCount', render(value, record) {
        return <div>
          Bom总数：{record.bomCount}
          <Divider type="vertical" />
          <span style={{color: '#52c41a'}}>生产完成：{value}</span>
        </div>;
      }
    },
    {
      title: '生产进度', dataIndex: 'skuCount', align: 'center', width: 200, render(value, record) {
        return <Progress
          strokeColor="#52c41a"
          percent={rateTool(record.doneBomCount, record.bomCount, true)}
        />;
      }
    },
    {
      title: '创建人', dataIndex: 'createUserResult', align: 'center', width: 150, render(createUserResult) {
        return createUserResult?.name;
      }
    },
    {title: '创建时间', dataIndex: 'createTime', align: 'center', width: 200},
    {
      title: '操作', align: 'center', width: 100, render(value, record) {
        return <>
          <Button type="link" onClick={() => {
            history.push(`/production/productionPlan/detail?id=${record.productionPlanId}`);
          }}>详情</Button>
        </>;
      }
    },
  ];

  const searchForm = () => {
    return <>
      <FormItem name="coding" label="编码" component={Input} placeholder="请输入编码" />
    </>;
  };

  return <>
    <Table
      ref={listRef}
      tableKey="productionPlan"
      actions={<>
        <Button type="primary" onClick={() => {
          setCurrentStep(0);
          ref.current.open(false);
        }}>创建生产计划</Button>
      </>}
      format={(data) => {
        return data.map(item => {
          const planDetailResult = isArray(item.planDetailResults)[0] || {};
          return {
            ...item,
            skuResult: planDetailResult.skuResult,
            partsResult: planDetailResult.partsResult,
            planNumber: planDetailResult.planNumber,
          };
        });
      }}
      rowKey="productionPlanId"
      noRowSelection
      searchForm={searchForm}
      title={<Breadcrumb title="生产计划" />}
      api={productionPlanList}
      columns={columns}
    />

    <Modal
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      compoentRef={formRef}
      title="生产计划"
      width="auto"
      ref={ref}
      component={PlanAdd}
      onLoading={setAddLoading}
      onSuccess={() => {
        ref.current.close();
        listRef.current.submit();
      }}
      footer={<Space>
        <Button onClick={() => ref.current.close()}>取消</Button>
        <Button
          loading={addLoading}
          disabled={currentStep < 1}
          type="primary"
          onClick={() => {
            formRef.current.submit();
          }}>保存</Button>
      </Space>}
    />
  </>;
};

export default PlanList;
