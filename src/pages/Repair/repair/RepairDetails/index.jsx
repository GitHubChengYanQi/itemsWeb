import React, {useRef} from 'react';
import {Avatar, Button, Card, Col, Row, Tabs} from 'antd';
import Breadcrumb from '@/components/Breadcrumb';
import Icon from '@/components/Icon';
import {useRequest} from '@/util/Request';
import {useParams} from 'ice';
import ProSkeleton from '@ant-design/pro-skeleton';
import styles from './index.module.scss';
import Modal2 from '@/components/Modal';
import {repairDetail} from '@/pages/Repair/repair/repairUrl';
import Desc from '@/pages/Repair/repair/RepairDetails/components/Desc';
import DescAddress from '@/pages/Repair/repair/RepairDetails/components/DescAddress';
import StepList from '@/pages/Repair/repair/RepairDetails/components/StepList';
import DispatchingList from '@/pages/Portal/dispatching/dispatchingList';
import RepairEdit from '@/pages/Repair/repair/repairEdit';
import Dynamic from '@/pages/Repair/repair/RepairDetails/components/Dynamic';

const RepairDetails = () => {
  const params = useParams();

  const ref = useRef(null);


  const {loading, data, run, refresh} = useRequest(repairDetail, {
    defaultParams: {
      data: {
        repairId: params.cid
      }
    }
  });

  if (loading) {
    return (<ProSkeleton type="descriptions" />);
  }
  if (data) {
    return <div className={styles.detail}>
      <Card>
        <Breadcrumb />
      </Card>
      <Card>
        <div className={styles.title}>
          <Row gutter={24}>
            <Col>
              <Avatar><Icon type="icon-tongjibaobiao" /></Avatar>
            </Col>
            <Col>
              <h3>出厂编号：<span
                style={{color: 'red'}}>{data.deliveryDetailsResult && data.deliveryDetailsResult.stockItemId}
                <em>({data.deliveryDetailsResult && data.deliveryDetailsResult.qualityType})</em></span></h3>
            </Col>
          </Row>


        </div>
        <div className={styles.titleButton}>
          <Button type="primary" onClick={() => {
            ref.current.open(data);
          }}>编辑</Button>
          <Modal2 width={1000} title="客户" component={RepairEdit} onSuccess={() => {
            ref.current.close();
          }} ref={ref} />
          <Button onClick={() => {
            history.back();
          }}><Icon type="icon-back" />返回</Button>
        </div>
      </Card>

      <Row>
        <Col span={24}>
          <div className={styles.main}>
            <Card title="基础数据">
              <Desc data={data} />
            </Card>
          </div>
        </Col>
      </Row>

      <Row>
        <Col span={16}>
          <div className={styles.main}>
            <Card title="使用单位">
              <DescAddress data={data} />
            </Card>
          </div>
          <div className={styles.main}>
            <Card title="工程进度" bodyStyle={{padding: 30}}>
              <StepList onChange={() => {
                refresh();
              }} value={data} />
            </Card>
          </div>
          <div className={styles.main}>
            <Card title="工程师信息" bodyStyle={{padding: 30}}>
              <DispatchingList data={data} />
            </Card>
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.main} style={{height: '100%'}}>
            <Card>
              <Tabs defaultActiveKey="1" items={[
                {key: '1', label: '"', children: <Dynamic value={data} />},
              ]} />
            </Card>
          </div>
        </Col>
      </Row>

    </div>;
  }
  return null;


};

export default RepairDetails;
