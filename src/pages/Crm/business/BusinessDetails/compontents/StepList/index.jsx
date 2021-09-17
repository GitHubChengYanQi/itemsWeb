import React, {useEffect, useRef, useState} from 'react';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {Modal as AntModal, notification, Popover, Steps} from 'antd';
import {useRequest} from '@/util/Request';
import styles from './index.module.scss';
import Modal from '@/components/Modal';
import AddContractEdit from '@/pages/Crm/contract/ContractEdit';

const {Step} = Steps;

const StepList = (props) => {

  const {value, onChange: pOnChange} = props;


  const ref = useRef(null);

  const contract = () => {
    AntModal.confirm({
      title: 'Confirm',
      centered: true,
      icon: <ExclamationCircleOutlined />,
      content: '是否创建合同',
      okText: '确认',
      style: {margin: 'auto'},
      cancelText: '取消',
      onOk: async () => {
        ref.current.open(false);
      },
      onCancel:()=>{
        typeof pOnChange === 'function' && pOnChange();
      }
    });
  };

  let current = 0;

  const openNotificationWithIcon = (type, content) => {
    notification[type]({
      message: type === 'success' ? '变更成功！' : '变更失败！',
      description: `变更流程为${content !== undefined ? content : ''}`,
    });

    if (content === '赢单'){
      contract();
    }else {
      typeof pOnChange === 'function' && pOnChange();
    }
  };



  const {data} = useRequest({
    url: '/crmBusinessSalesProcess/list',
    method: 'POST', data: {salesId: value.salesId}
  });


  const {run} = useRequest({
    url: '/crmBusiness/UpdateStatus',
    method: 'POST',
    onError(error) {
      openNotificationWithIcon('error');
    }
  }, {
    manual: true
  });


  const edit = async (salesProcessId, name) => {
    await run(
      {
        data: {
          processId: salesProcessId || null,
          businessId: value.businessId,
          state: name || null,
        }
      }
    );
  };


  const confirm = (name, values) => {
    AntModal.confirm({
      title: 'Confirm',
      centered: true,
      icon: <ExclamationCircleOutlined />,
      content: `是否变更到${name}`,
      okText: '确认',
      style: {margin: 'auto'},
      cancelText: '取消',
      onOk: async () => {
        await edit(values.salesProcessId);
        await openNotificationWithIcon('success', values.name);
      }
    });
  };

  const confirmOk = (name, percent) => {
    AntModal.confirm({
      title: 'Confirm',
      centered: true,
      icon: <ExclamationCircleOutlined />,
      content: `是否变更到${name}`,
      okText: '确认',
      style: {margin: 'auto'},
      cancelText: '取消',
      onOk: async () => {
        await edit(null, name);
        // typeof pOnChange === 'function' && pOnChange();
        openNotificationWithIcon('success', name);
      }
    });
  };


  const step = data ? data.map((values, index) => {
    if (value.processId === values.salesProcessId) {
      current = index;
    }
    ;
    return (
      <Step
        disabled={value.state}
        style={{}}
        key={index}
        title={values.name}
        description={`盈率：${values.percentage}%`}
        onClick={async () => {
          value.state ? null : confirm(values.name, values);
        }}
      />
    );

  }) : null;


  if (step) {
    return (
      <>
        <Steps
          style={{cursor: 'pointer'}}
          type="navigation"
          current={value.state ? step.length : current}
        >
          {step}
          <Step
            title={
              value.state ?
                value.state :
                <Popover
                  placement="bottom"
                  content={
                    <div>
                      <a className={styles.state} onClick={async () => {
                        confirmOk('赢单', 100);
                      }}>赢单 100%</a>
                      <a className={styles.state} onClick={async () => {
                        confirmOk('输单', 0);
                      }}>输单 0%</a>
                    </div>
                  }
                  trigger="hover">
                  完成
                </Popover>}
          />
        </Steps>
        <Modal title="合同" component={AddContractEdit} customerId={value.customerId} ref={ref} onSuccess={()=>{
          typeof pOnChange === 'function' && pOnChange();
        }} />
      </>
    );
  } else {
    return null;
  }


};

export default StepList;
