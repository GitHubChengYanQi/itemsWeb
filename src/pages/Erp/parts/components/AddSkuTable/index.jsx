import React, {useImperativeHandle, useRef, useState} from 'react';
import {Alert, Button, List, Select, Space, Spin} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import InputNumber from '@/components/InputNumber';
import {useRequest} from '@/util/Request';
import {bomsByskuId} from '@/pages/Erp/parts/PartsUrl';
import Modal from '@/components/Modal';
import styles from './index.module.less';
import Icon from '@/components/Icon';
import {SkuRender} from '@/pages/Erp/sku/components/SkuRender';
import Note from '@/components/Note';

const AddSkuTable = ({
  value = [],
  onChange = () => {
  },
  openNewEdit = () => {
  }
}, ref) => {

  const versionModalRef = useRef();

  const [bomVersions, setBomVersions] = useState([]);

  const [skuId, setSkuId] = useState();
  const [currentVer, setCurrentVer] = useState();

  const dataSources = value;

  const setValue = (data, skuId) => {
    const array = dataSources.map((item) => {
      if (item.skuId === skuId) {
        return {
          ...item,
          ...data
        };
      } else {
        return item;
      }
    });
    onChange(array);
  };

  const {loading: bomsByskuIdLoading, run: bomsByskuIdRun} = useRequest(bomsByskuId, {
    manual: true,
    onSuccess: (res) => {
      setBomVersions(res);
    }
  });

  const addNewItem = () => {
    const partsList = document.getElementById('partsListId');
    partsList.scrollTop = partsList.scrollHeight;
  };

  useImperativeHandle(ref, () => ({
    addNewItem,
  }));

  return <>
    <div className={styles.checkList}>
      {value.length > 0 && <div className={styles.line} />}
      <List
        id="partsListId"
        className={styles.list}
        itemLayout="horizontal"
        dataSource={dataSources}
        renderItem={(item, index) => {
          return <div className={styles.listItem}>
            <div className={index === dataSources.length - 1 ? styles.last : styles.leftBorder} />
            <List.Item
              className={styles.item}
              actions={[
                <Button
                  style={{padding: 0}}
                  size="large"
                  type="link"
                  danger
                  onClick={() => {
                    const array = dataSources.filter((dataItem) => {
                      return item.skuId !== dataItem.skuId;
                    });
                    onChange(array);
                  }}
                >
                  <DeleteOutlined />
                </Button>,
                <Button
                  disabled={item.bomNum ? !item.bomId : false}
                  style={{padding: 0}}
                  type="link"
                  onClick={() => {
                    openNewEdit(item.bomId);
                  }}
                >
                  {item.bomNum ? '查看详情' : '添加bom'}
                </Button>
              ]}
            >
              <List.Item.Meta
                title={<Note maxWidth="94%" value={item.standard} />}
                description={
                  <div>
                    <Note maxWidth="94%" value={SkuRender(item)} />
                    {item.bomNum && <Button
                      style={{padding: 0}}
                      type="link"
                      onClick={() => {
                        bomsByskuIdRun({params: {skuId: item.skuId}});
                        versionModalRef.current.open(false);
                        setSkuId(item.skuId);
                        setCurrentVer(item.bomId);
                      }}
                    >
                      {item.bomId ? (item.version || '-') : '选择版本'}
                    </Button>}
                  </div>}
              />
              <Space>
                <Select
                  bordered={false}
                  defaultValue={1}
                  value={item.autoOutstock}
                  options={[
                    {label: '推式', value: 1},
                    {label: '拉式', value: 0},
                  ]}
                  onChange={(value) => setValue({autoOutstock: value}, item.skuId)}
                />
                <Space align="center">
                  数量：
                  <InputNumber addonBefore="" width={100} value={item.number || 1} min={1} onChange={(value) => {
                    setValue({number: value}, item.skuId);
                  }} />
                </Space>
              </Space>
            </List.Item>
          </div>;
        }}
      />
    </div>

    <Modal
      ref={versionModalRef}
      headTitle="选择版本"
      footer={null}
    >
      <div style={{padding: 16}}>
        {
          bomsByskuIdLoading ?
            <Spin spinning>
              <Alert
                message="正在获取BOM版本信息"
                description="加载中..."
                type="info"
              />
            </Spin>
            :
            bomVersions.map((item, index) => {
              return <div
                key={index}
                className={styles.versionIndex}
                style={{border: currentVer === item.partsId ? 'solid 1px #c5e8ff' : 'none'}}
                onClick={() => {
                  setValue({version: item.name, bomId: item.partsId}, skuId);
                  versionModalRef.current.close();
                }}
              >
                <Icon type="icon-a-kehuliebiao2" style={{marginRight: 16}} />
                <div>
                  版本号：{item.name || '-'}
                  <br />
                  创建时间：{item.createTime}
                </div>
              </div>;
            })
        }
      </div>
    </Modal>
  </>;
};

export default React.forwardRef(AddSkuTable);
