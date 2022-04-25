import React, {useRef, useState} from 'react';
import {Button, Card, Col, Row, Tabs, Typography, Tag, Space} from 'antd';
import {useHistory, useParams} from 'ice';
import ProSkeleton from '@ant-design/pro-skeleton';
import {EditOutlined} from '@ant-design/icons';
import Breadcrumb from '@/components/Breadcrumb';
import Icon from '@/components/Icon';
import {request, useRequest} from '@/util/Request';
import {customerDelete, customerDetail, customerEdit} from '@/pages/Crm/customer/CustomerUrl';
import Description from '@/pages/Crm/customer/CustomerDetail/compontents/Description';
import Desc from '@/pages/Crm/customer/CustomerDetail/compontents/Desc';
import AdressList from '@/pages/Crm/customer/CustomerEdit/components/AdressList';
import Dynamic from '@/pages/Crm/customer/CustomerDetail/compontents/Dynamic';
import ContractTable from '@/pages/Crm/contract/components/components/ContractTable';
import Upload from '@/pages/Crm/customer/CustomerDetail/compontents/Upload';
import Track from '@/pages/Crm/business/BusinessDetails/compontents/Track';
import CrmBusinessTrackEdit from '@/pages/Crm/business/crmBusinessTrack/crmBusinessTrackEdit';
import Modal from '@/components/Modal';
import ContactsTable from '@/pages/Crm/contacts/ContactsList';
import InputEdit from '@/pages/Crm/customer/components/Edit/InputEdit';
import AvatarEdit from '@/pages/Crm/customer/components/Edit/AvatarEdit';
import BusinessAdd from '@/pages/Crm/business/BusinessAdd';
import DetailMenu from '@/pages/Crm/customer/CustomerDetail/compontents/DetailMenu';
import styles from './index.module.scss';
import InvoiceList from '@/pages/Crm/invoice/invoiceList';
import SupplyList from '@/pages/Crm/supply/supplyList';
import TreeSelectSee from '@/pages/Erp/TreeSelectSee';
import store from '@/store';
import Empty from '@/components/Empty';
import {supplierDetail} from '@/pages/Purshase/Supply/SupplyUrl';

const {TabPane} = Tabs;

const CustomerDetail = ({id,supply = 0, status, ...props}) => {

  const params = useParams();
  const addRef = useRef(null);
  const refTrack = useRef(null);
  const submitRef = useRef(null);
  const history = useHistory();

  const api = supply ? supplierDetail : customerDetail;

  const [areaData] = store.useModel('dataSource');

  const {loading, data, refresh} = useRequest(api, {
    defaultParams: {
      data: {
        customerId: params.cid || id,
        status,
      }
    }
  });

  const {loading: editLoading, run: runCustomer} = useRequest(
    customerEdit,
    {
      manual: true,
      onSuccess: () => {
        refresh();
      }
    });

  const [width, setWidth] = useState();

  if (loading || editLoading) {
    return (<ProSkeleton type="descriptions"/>);
  }

  if (!data) {
    return <Empty/>;
  }

  const enterprise = data.status === 99;

  return (
    <div className={styles.detail}>
      <Card>
        <Breadcrumb title="供应商详情"/>
      </Card>
      <Card>
        <div className={styles.title}>
          <Row gutter={24}>
            <Col>
              <AvatarEdit
                data={data}
                name={data.customerName && data.customerName.substring(0, 1)}
                onChange={async (value) => {
                  await runCustomer({
                    data: {
                      customerId: data.customerId,
                      avatar: value
                    }
                  });
                }}
                value={data.avatar}
              />
            </Col>
            <Col>
              <Space style={{height: 30}} align="start">
                <Typography.Paragraph
                  strong
                  copyable
                  editable={{
                    onChange: (value) => {
                      runCustomer({
                        data: {
                          customerId: data.customerId,
                          customerName: value
                        }
                      });
                    }
                  }}>{data && data.customerName}</Typography.Paragraph>
                <Tag
                  style={{padding: '0 8px'}}
                >
                  简称：
                  <InputEdit value={data.abbreviation} onChange={async (value) => {
                    await request({
                      ...customerEdit,
                      data: {
                        customerId: data.customerId,
                        abbreviation: value
                      }
                    });
                  }}/>
                </Tag>
              </Space>
              <div>
                <em>
                  {data.defaultContactsResult && data.defaultContactsResult.contactsName || '--'}
                  &nbsp;&nbsp;/&nbsp;&nbsp;
                  {data.defaultContactsResult && data.defaultContactsResult.phoneParams && data.defaultContactsResult.phoneParams[0] && data.defaultContactsResult.phoneParams[0].phoneNumber || '--'}
                  &nbsp;&nbsp;/&nbsp;&nbsp;
                  {data.defaultContactsResult && data.defaultContactsResult.companyRoleResult && data.defaultContactsResult.companyRoleResult.position || '--'}
                  &nbsp;&nbsp;/&nbsp;&nbsp;
                  {data.defaultContactsResult && data.defaultContactsResult.deptResult && data.defaultContactsResult.deptResult.fullName || '--'}
                </em>
                <div>
                  <em>联系地址：<TreeSelectSee
                    data={areaData.area}
                    value={data.address.region}/>&nbsp;&nbsp;{data.address && data.address.detailLocation || '--'}
                  </em>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        {!enterprise && <div className={styles.titleButton}>
          <DetailMenu
            supply={data.supply === 1}
            data={data}
            type="customer"
            deletaApi={customerDelete}
            url={id ? '/purchase/supply' : '/CRM/customer'}
            refresh={() => {
              refresh();
            }}/>
          {props.hidden && <>
            <Button
              style={params.state === 'false' ? {'display': 'none'} : null}
              onClick={() => {
                addRef.current.open(false);
              }} icon={<EditOutlined/>}>创建商机</Button>
            <BusinessAdd
              ref={addRef}
              customerId={data.customerId}
              userId={data.userId}
              onClose={() => {
                addRef.current.close();
                refTrack.current.close();
                refresh();
              }}
            />
            <Button
              type="primary"
              style={params.state === 'false' ? {'display': 'none'} : null}
              onClick={() => {
                refTrack.current.open(false);
              }} icon={<EditOutlined/>}>添加跟进</Button>
          </>}

          <Modal
            width={width === 1 ? 1400 : 800}
            title="跟进"
            ref={refTrack}
            onWidthChange={(value) => {
              setWidth(value);
            }}
            compoentRef={submitRef}
            footer={
              <>
                <Button type="primary" onClick={() => {
                  submitRef.current.formRef.current.submit();
                }}>
                  保存
                </Button>
                <Button onClick={() => {
                  refTrack.current.close();
                }}>
                  取消
                </Button>
              </>}
            component={CrmBusinessTrackEdit}
            onSuccess={() => {
              refTrack.current.close();
              refresh();
            }} val={data.customerId} number={0}/>
          <Button onClick={() => {
            history.push(id ? '/purchase/supply' : '/CRM/customer');
          }}><Icon type="icon-huifu"/>返回</Button>
        </div>}
      </Card>
      <div
        className={styles.main}>
        <Card>
          <Desc data={data} enterprise={enterprise} supply={id}/>
        </Card>
      </div>
      <div
        className={styles.main}>
        <Row gutter={24}>
          <Col span={!enterprise ? 18 : 24}>
            <Card>
              <Tabs defaultActiveKey="9">
                <TabPane tab="可供物料" key="9">
                  <SupplyList customer={data}/>
                </TabPane>
                <TabPane tab="联系信息" key="2">
                  <ContactsTable customer={data} refresh={() => {
                    refresh();
                  }}/>
                </TabPane>
                <TabPane tab="合同记录" key="4">
                  <ContractTable customerId={data && data.customerId}/>
                </TabPane>
                <TabPane tab="财务信息" key="8">
                  <InvoiceList customer={data} refresh={() => {
                    refresh();
                  }}/>
                </TabPane>
                <TabPane tab="地址" key="3">
                  <AdressList customer={data} refresh={() => {
                    refresh();
                  }}/>
                </TabPane>
                <TabPane tab="货单" key="5">
                  <Empty/>
                </TabPane>
                <TabPane tab="回款" key="6">
                  Content of Tab Pane 3
                </TabPane>
                <TabPane tab="附件" key="7">
                  <Upload customerId={data && data.customerId}/>
                </TabPane>
                <TabPane tab="企业信息" key="1">
                  <Description data={data}/>
                </TabPane>
              </Tabs>
            </Card>
          </Col>
          {!enterprise && <Col span={6}>
            <Card>
              <Tabs defaultActiveKey="1">
                {props.hidden && <TabPane tab="跟进" key="1">
                  <Track value={null} number={null} trackMessageId={data.customerId}/>
                </TabPane>}
                <TabPane tab="动态" key="2">
                  <Dynamic value={data} api={{
                    url: '/customerDynamic/list', method: 'POST'
                  }}/>
                </TabPane>
              </Tabs>
            </Card>
          </Col>}
        </Row>
      </div>

    </div>

  );
};

export default CustomerDetail;
