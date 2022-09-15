import React, { useState, useRef } from 'react';
import { Button, Modal } from 'antd';
import Swagger from '@/pages/BaseSystem/dbInfo/fieldConfig/dbSourceConfig/swagger';
import Options from '@/pages/BaseSystem/dbInfo/fieldConfig/dbSourceConfig/options';

const DbSourceConfig = (
  {
    value,
    onChange = () => {
    }
  }
) => {

  const ref = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [width,setWidth] = useState(0);

  if (typeof value !== 'object') {
    return (<span>无需配置</span>);
  }
  const renderButton = () => {
    switch (value.type) {
      case 'select':
      case 'cascader':
        return (
          <>
            <Button onClick={() => {
              setWidth(460);
              setIsModalVisible(true);
            }}>
              {value.config?`接口：${value.config.apiUrl}`:'选择数据接口'}</Button>
          </>
        );
      case 'checkbox':
      case 'selectValue':
      case 'radio':
        return (
          <>
            <Button onClick={() => {
              setWidth(740);
              setIsModalVisible(true);
            }}>{value.config?`已配置${value.config.options.length}选项`:'配置'}</Button>
          </>
        );
      default:
        return (<span>无需配置</span>);
    }
  };

  const renderForm = () => {
    switch (value.type) {
      case 'select':
      case 'cascader':
        return (
          <>
            <Swagger ref={ref} value={value}/>
          </>
        );
      case 'checkbox':
      case 'selectValue':
      case 'radio':
        return (
          <>
            <Options ref={ref} value={value} />
          </>
        );
      default:
        return (<span>无配置</span>);
    }
  };

  return (
    <>
      {renderButton()}
      <Modal
        title="配置数据"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        onOk={() => {
          // console.log(ref.current.getConfig());
          const config = ref.current.getConfig();
          if (config) {
            onChange({
              ...value,
              config
            });
          }
          setIsModalVisible(false);
        }}
        width={width}
      >
        {renderForm()}
      </Modal>
    </>
  );
};

export default DbSourceConfig;
