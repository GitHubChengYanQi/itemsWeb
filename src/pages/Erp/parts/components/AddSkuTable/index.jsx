import React, {useRef, useState} from 'react';
import {Alert, Button, List, Select, Space, Spin} from 'antd';
import {DeleteOutlined, MenuOutlined, PlusSquareOutlined} from '@ant-design/icons';
import InputNumber from '@/components/InputNumber';
import {useRequest} from '@/util/Request';
import {bomsByskuId} from '@/pages/Erp/parts/PartsUrl';
import Modal from '@/components/Modal';
import styles from './index.module.less';
import Icon from '@/components/Icon';
import {SkuRender} from '@/pages/Erp/sku/components/SkuRender';
import Note from '@/components/Note';
import {isArray} from '@/util/Tools';
import Warning from '@/components/Warning';
import Empty from '@/components/Empty';
import {Sortable} from '@/components/Table/components/DndKit/Sortable';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import {useBoolean} from 'ahooks';
import {Handle} from '@/components/Table/components/DndKit/Item';

const AddSkuTable = ({
  value = [],
  onChange = () => {
  },
  openNewEdit = () => {
  },
  onSeletSku = () => {
  }
}) => {

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

  const Item = (props) => {
    const {value, item, index, ...other} = props;
    return <>
      <div className={styles.listItem}>
        <div className={index === dataSources.length ? styles.last : styles.leftBorder} />
        {item.add ?
          <a
            style={{padding: '12px 0'}}
            onClick={onSeletSku}
          >
            <PlusSquareOutlined style={{fontSize: 24}} />
          </a>
          :
          <div
            className={styles.item}
          >
            <Handle icon={<MenuOutlined />} {...other} />
            <div className={styles.content}>
              <div className={styles.sku}>
                <List.Item.Meta
                  title={<Note maxWidth="94%" value={item.standard} />}
                  description={
                    <div>
                      <Note maxWidth="94%" value={SkuRender(item)} />
                      {/*

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
                    */}
                    </div>}
                />
              </div>
              <Space>
                <Select
                  bordered={false}
                  value={typeof item.autoOutstock === 'number' ? item.autoOutstock : 1}
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

                <Warning onOk={() => {
                  const array = dataSources.filter((dataItem) => {
                    return item.skuId !== dataItem.skuId;
                  });
                  onChange(array);
                }}>
                  <Button
                    style={{padding: '0 0 0 8px'}}
                    size="large"
                    type="link"
                    danger
                  >
                    <DeleteOutlined />
                  </Button>
                </Warning>
                <Button
                  // disabled={item.bomNum ? !item.bomId : false}
                  style={{padding: 0}}
                  type="link"
                  loading={bomsByskuIdLoading}
                  onClick={async () => {
                    if (item.bomNum) {
                      const res = await bomsByskuIdRun({params: {skuId: item.skuId}});
                      openNewEdit(isArray(res)[0]?.partsId, item.skuId);
                      return;
                    }
                    openNewEdit(item.bomId, item.skuId);
                  }}
                >
                  {item.bomNum ? '查看详情' : '添加bom'}
                </Button>
              </Space>
            </div>
          </div>}
      </div>
    </>;
  };

  return <>

    <div className={styles.checkList}>
      <div className={styles.line} />
      <div className={styles.list}>
        <Sortable
          handle
          getItemStyles={() => {
            return {
              padding: 0,
              width: '100%'
            };
          }}
          definedItem={Item}
          items={[...dataSources, {add: true, disabled: true}].map((item) => {
            return {
              ...item,
              key: item.skuId || 'add',
            };
          })}
          onDragEnd={(allIems) => {
            onChange(allIems.filter(item => !item.add));
          }}
        />
      </div>

      <div hidden>
        <List
          className={styles.list}
          itemLayout="horizontal"
          dataSource={[...dataSources, {add: true}]}
          renderItem={(item, index) => {
            return <div className={styles.listItem}>
              <div className={index === dataSources.length ? styles.last : styles.leftBorder} />
              <List.Item
                className={styles.item}
                actions={item.add ? [] : [
                  <Warning onOk={() => {
                    const array = dataSources.filter((dataItem) => {
                      return item.skuId !== dataItem.skuId;
                    });
                    onChange(array);
                  }}>
                    <Button
                      style={{padding: 0}}
                      size="large"
                      type="link"
                      danger
                    >
                      <DeleteOutlined />
                    </Button>
                  </Warning>,
                  <Button
                    // disabled={item.bomNum ? !item.bomId : false}
                    style={{padding: 0}}
                    type="link"
                    loading={bomsByskuIdLoading}
                    onClick={async () => {
                      if (item.bomNum) {
                        const res = await bomsByskuIdRun({params: {skuId: item.skuId}});
                        openNewEdit(isArray(res)[0]?.partsId, item.skuId);
                        return;
                      }
                      openNewEdit(item.bomId, item.skuId);
                    }}
                  >
                    {item.bomNum ? '查看详情' : '添加bom'}
                  </Button>
                ]}
              >
                {item.add ?
                  <a
                    onClick={onSeletSku}
                  >
                    <PlusSquareOutlined style={{fontSize: 24}} />
                  </a> :
                  <>
                    <List.Item.Meta
                      title={<Note maxWidth="94%" value={item.standard} />}
                      description={
                        <div>
                          <Note maxWidth="94%" value={SkuRender(item)} />
                          {/*

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
                    */}
                        </div>}
                    />
                    <Space>
                      <Select
                        bordered={false}
                        value={typeof item.autoOutstock === 'number' ? item.autoOutstock : 1}
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
                  </>}
              </List.Item>
            </div>;
          }}
        />
      </div>

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

export default AddSkuTable;
