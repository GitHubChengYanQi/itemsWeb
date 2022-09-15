import {useHistory, useParams} from 'ice';
import React, {useEffect, useRef, useState} from 'react';
import ProSkeleton from '@ant-design/pro-skeleton';
import {Badge, Button, Card, Descriptions, Empty, Modal, Space, Spin} from 'antd';
import {useRequest} from '@/util/Request';
import styles from '@/pages/Crm/customer/CustomerDetail/index.module.scss';
import Breadcrumb from '@/components/Breadcrumb';
import {procurementOrderDetail} from '@/pages/Purshase/procurementOrder/procurementOrderUrl';
import ProcurementOrderDetailList
  from '@/pages/Purshase/procurementOrder/components/procurementOrderDetail/procurementOrderDetailList';
import {contractList} from '@/pages/Crm/contract/ContractUrl';
import AddContractEdit from '@/pages/Crm/contract/ContractEdit';

const Detail = () => {

  const params = useParams();

  const contactRef = useRef();

  const addContract = useRef();

  const history = useHistory();

  const [contracts, setContracts] = useState();

  const {loading, data} = useRequest(procurementOrderDetail, {
    defaultParams: {
      data: {
        procurementOrderId: params.cid
      }
    }
  });

  const gridStyle = {
    width: '100%',
    textAlign: 'center',
    cursor: 'pointer',
  };

  const {loading: contractsLoading, data: contractsData, run} = useRequest(contractList, {
    manual: true,
  });

  console.log(contractsData);

  useEffect(() => {
    if (data) {
      run({
        data: {
          source: '采购单',
          sourceId: data.procurementOrderId
        }
      });
    }
  }, [data]);

  if (loading) {
    return (<ProSkeleton type="descriptions" />);
  }

  if (!data) {
    return <Empty />;
  }

  const status = (value) => {
    switch (value) {
      case 0:
        return <Badge text="审批中" color="yellow" />;
      case 97:
        return <Badge text="已拒绝" color="red" />;
      case 98:
        return <Badge text="已完成" color="green" />;
      case 99:
        return <Badge text="已同意" color="blue" />;
      default:
        break;
    }
  };

  return (
    <div className={styles.detail} style={{overflowX: 'hidden'}}>
      <Card title={<Breadcrumb />} extra={<Space>
        {contractsLoading ?
          <Spin />
          :
          <Button
            onClick={() => {
              if (contractsData && contractsData.length > 0) {
                setContracts(contractsData);
              } else {
                contactRef.current.open(false);
              }
            }}>
            {contractsData && contractsData.length > 0
              ?
              '查看合同' : '创建合同'}
          </Button>}
        <Button onClick={() => {
          history.push('/purchase/procurementOrder');
        }}>返回</Button>
      </Space>} />
      <div className={styles.main}>
        <Card title="基本信息">
          <Descriptions>
            <Descriptions.Item label="采购单">{data.procurementOrderId}</Descriptions.Item>
            <Descriptions.Item label="创建人">{data.user && data.user.name}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
            <Descriptions.Item label="状态">{status(data.status)}</Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      <div
        className={styles.main}>
        <Card title="物料信息" bodyStyle={{padding: 0}}>
          <ProcurementOrderDetailList value={data.procurementOrderId} />
        </Card>
      </div>

      <Modal
        title={<div style={{textAlign: 'center'}}>选择合同</div>}
        open={contracts}
        footer={null}
        closable={false}
        centered
        onCancel={() => setContracts(false)}
      >
        <Card>
          {
            contracts && contracts.map((item, index) => {
              return <Card.Grid
                key={index}
                style={gridStyle}
                onClick={() => {
                  history.push(`/CRM/contract/${item.contractId}`);
                }}
              >
                {item.name}
              </Card.Grid>;
            })
          }
        </Card>
      </Modal>


      <Modal
        headTitle="创建采购单"
        width={1000}
        supplyB
        component={AddContractEdit}
        enterpriseA
        ref={contactRef}
        compoentRef={addContract}
        footer={<Button type="primary" onClick={() => {
          addContract.current.submit();
        }}>保存</Button>}
        response={(res) => {
          if (res.contractId){
            run({
              data: {
                contractId: res.contractId
              }
            });
          }
        }}
        onSuccess={() => {
          contactRef.current.close();
        }}
      />

    </div>
  );
};

export default Detail;
