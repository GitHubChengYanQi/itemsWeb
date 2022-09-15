import React, {useRef, useState} from 'react';
import {Avatar, Button, Card, Col, Row, Tabs, Statistic, Divider} from 'antd';
import Breadcrumb from '@/components/Breadcrumb';
import Icon from '@/components/Icon';
import {useRequest} from '@/util/Request';
import {useParams} from 'ice';
import ProSkeleton from '@ant-design/pro-skeleton';
import Desc from '@/pages/Crm/competitor/competitorDetails/components/Desc';
import {competitorDetail} from '@/pages/Crm/competitor/competitorUrl';
import CompetitorEdit from '@/pages/Crm/competitor/competitorEdit';
import Modal from '@/components/Modal';
import styles from './index.module.scss';
import Description from '@/pages/Crm/competitor/competitorDetails/components/Description';
import Dynamic from '@/pages/Crm/customer/CustomerDetail/compontents/Dynamic';
import Empty from '@/components/Empty';

const {TabPane} = Tabs;

const CompetitorDetails = () => {
  const params = useParams();


  const [responsive, setResponsive] = useState(false);

  const ref = useRef(null);

  const {loading, data, run, refresh} = useRequest(competitorDetail, {
    defaultParams: {
      data: {
        competitorId: params.cid
      }
    }
  });


  if (loading) {
    return (<ProSkeleton type="descriptions" />);
  }

  if (data) {
    return (
      <div className={styles.detail}>
        <Card>
          <Breadcrumb />
        </Card>
        <Card>
          <div className={styles.title}>
            <Row gutter={24}>
              <Col>
                <Avatar size={64}>LOGO</Avatar>
              </Col>
              <Col>
                <h3>{data.name}</h3>
                <div>
                  <em>创立日期：{data.creationDate}</em>
                </div>
              </Col>
            </Row>

          </div>
          <div className={styles.titleButton}>
            <Button type="primary" onClick={() => {
              ref.current.open(data);
            }}>编辑</Button>
            <Modal width={1000} title="竞争对手" component={CompetitorEdit} onSuccess={() => {
              ref.current.close();
              refresh();
            }} ref={ref} />
            <Button onClick={() => {
              history.back();
            }}><Icon type="icon-huifu" />返回</Button>
          </div>
        </Card>
        <div
          className={styles.main}>
          <Card>
            <Desc data={data} />
          </Card>
        </div>
        <div
          className={styles.main}>
          <Row gutter={12}>
            <Col span={16}>
              <Card>
                <Tabs defaultActiveKey="1" items={[
                  {
                    key: '2', label: '详细信息', children: <Description data={data} />
                  }
                ]} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Tabs defaultActiveKey="1" items={[
                  {
                    key: '2', label: '动态', children: <Empty />
                  }
                ]} />
              </Card>
            </Col>
          </Row>


        </div>

      </div>

    );
  } else {
    return null;
  }

};

export default CompetitorDetails;
