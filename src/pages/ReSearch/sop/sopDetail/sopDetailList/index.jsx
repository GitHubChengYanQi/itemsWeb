/**
 * sop详情列表页
 *
 * @author song
 * @Date 2022-02-10 09:21:35
 */

import React, {useRef, useState} from 'react';
import {Button, Card, Col, Descriptions, Dropdown, Image, Menu, Row, Space, Steps, Table, Tabs,} from 'antd';
import {useHistory, useParams} from 'ice';
import ProCard from '@ant-design/pro-card';
import ProSkeleton from '@ant-design/pro-skeleton';
import styles from '@/pages/Crm/customer/CustomerDetail/index.module.scss';
import Breadcrumb from '@/components/Breadcrumb';
import {useRequest} from '@/util/Request';
import {sopDetail} from '@/pages/ReSearch/sop/sopUrl';
import Empty from '@/components/Empty';
import SopEdit from '@/pages/ReSearch/sop/sopEdit';
import Modal from '@/components/Modal';

const SopDetailList = ({id, value}) => {

  const params = useParams();
  const history = useHistory();

  const ref = useRef();

  const addRef = useRef();

  const [editLoading, setEditLoading] = useState();

  const {loading, data, run, refresh} = useRequest(sopDetail, {
    defaultParams: {
      data: {
        sopId: value || id || params.cid,
      }
    }
  });

  if (loading) {
    return (<ProSkeleton type="descriptions" />);
  }

  if (!data) {
    return <Empty />;
  }

  return (
    <div className={styles.detail}>
      {!(id || value) && <Card title={<Breadcrumb title="SOP详情" />} extra={
        <Space>
          <Dropdown trigger="click" placement="bottom" overlay={
            <Menu items={[
              {key: 'edit', label: '编辑', onClick: () => ref.current.open(data.sopId)}
            ]} />
          }>
            <Button type="text">
              管理
            </Button>
          </Dropdown>
          <Button onClick={() => {
            if (data.display === 0) {
              run({
                data: {
                  sopId: data.pid,
                }
              });
            } else {
              history.push('/SPU/sop');
            }
          }}>{data.display === 0 ? '返回正在使用的SOP' : '返回'}</Button>
        </Space>
      } />}
      <div
        className={styles.main}>
        <Row gutter={24}>
          <Col span={(id || value) ? 24 : 8}>
            <ProCard className="h2Card" headerBordered title="作业步骤">
              <Card
                title="成品图"
                headStyle={{border: 'none', borderBottom: '1px solid #eee', padding: '0 8px'}}
                bordered={false}
              >
                <Space>
                  {
                    data.mediaUrls.map((item, index) => {
                      return <Image key={index} src={item} width={150} height={100} />;
                    })
                  }
                </Space>
                <div>
                  作业要求及注意事项：{data.note || '无'}
                </div>
              </Card>
              <Card
                title="步骤"
                headStyle={{border: 'none', borderBottom: '1px solid #eee', padding: '0 8px'}}
                bordered={false}>
                <Steps direction="vertical">
                  {
                    data.sopDetails.map((item, index) => {
                      return <Steps.Step
                        style={{minHeight: 200}}
                        status="finish "
                        key={index}
                        title={
                          <Image src={item.mediaUrl} height={100} />
                        }
                        description={`操作说明：${item.instructions}`}
                      />;
                    })
                  }
                </Steps>,
              </Card>
            </ProCard>
          </Col>
          {!(id || value) && <Col span={16}>
            <Space direction="vertical">
              <ProCard className="h2Card" headerBordered title="基本信息">
                <Descriptions>
                  <Descriptions.Item label="SOP编号">{data.coding}</Descriptions.Item>
                  <Descriptions.Item label="SOP名称">{data.name}</Descriptions.Item>
                  <Descriptions.Item label="SOP版本号">{data.versionNumber}</Descriptions.Item>
                  <Descriptions.Item label="创建人">{data.user && data.user.name}</Descriptions.Item>
                  <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
                  <Descriptions.Item label="关联工序">{data.shipSetpId || '暂无'}</Descriptions.Item>
                </Descriptions>
              </ProCard>
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="修改记录" key="1">
                  <Table
                    dataSource={data.oldSop}
                    rowKey="sopId"
                  >
                    <Table.Column title="修改人" dataIndex="user" render={(value) => {
                      return <>{value && value.name}</>;
                    }} />
                    <Table.Column title="修改原因" dataIndex="alterWhy" />
                    <Table.Column title="修改时间" dataIndex="createTime" />
                    <Table.Column title="修改前版本号" dataIndex="versionNumber" />
                    <Table.Column title="操作" width={100} align="center" dataIndex="sopId" render={(value) => {
                      return <>
                        <Button type="link" onClick={() => {
                          run({
                            data: {
                              sopId: value,
                            }
                          });
                        }}>查看</Button>
                      </>;
                    }} />
                  </Table>
                </Tabs.TabPane>
                <Tabs.TabPane tab="学习记录" key="2" />
              </Tabs>
            </Space>
          </Col>}
        </Row>
      </div>

      <Modal
        width={700}
        title="编辑作业指导"
        component={SopEdit}
        loading={setEditLoading}
        compoentRef={addRef}
        footer={<Button loading={editLoading} type="primary" onClick={() => {
          addRef.current.submit();
        }}>
          保存
        </Button>}
        onSuccess={() => {
          refresh();
          ref.current.close();
        }}
        ref={ref}
      />

    </div>

  );
};

export default SopDetailList;
