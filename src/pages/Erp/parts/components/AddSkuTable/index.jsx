import React, {useRef, useState} from 'react';
import {Alert, Button, List, Select, Space, Spin} from 'antd';
import {DeleteOutlined, MenuOutlined, PlusOutlined, SearchOutlined, RightOutlined} from '@ant-design/icons';
import classNames from 'classnames';
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
import {Sortable} from '@/components/Table/components/DndKit/Sortable';
import {Handle} from '@/components/Table/components/DndKit/Item';

const AddSkuTable = ({
  onParts,
  comparisonSku,
  comparison,
  comparisonParts = [],
  value = [],
  onChange = () => {
  },
  show,
  openNewEdit = () => {
  },
  onSeletSku = () => {
  },
  addSku = () => {
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
    const noExist = comparison && !isArray(comparisonParts).find(comparison => comparison.skuId === item.skuId);

    return <>
      <div className={styles.listItem}>
        <div
          style={{width: show ? 50 : 100}}
          className={index === dataSources.length - (show ? 1 : 0) ? styles.last : styles.leftBorder}
        />
        {item.add ?
          <a
            style={{padding: '12px 0'}}
            onClick={onSeletSku}
          >
            <PlusOutlined style={{fontSize: 24}} />
          </a>
          :
          <div
            style={noExist ? {color: '#174ad4'} : {}}
            className={styles.item}
          >
            <Handle hidden={show} icon={<MenuOutlined />} {...other} />
            <div
              id={`${show ? 'comparison' : 'parts'}${item.skuId}`}
              style={(comparisonSku && comparisonSku.skuId === item.skuId) ? {border: 'solid 1px #174ad4'} : {}}
              className={classNames(styles.content, noExist && styles.noComparison)}
            >
              <div className={styles.sku} onClick={() => {
                if (noExist || !comparison) {
                  return;
                }
                if (comparisonSku?.skuId === item.skuId) {
                  onParts(null);
                } else {
                  onParts(item);
                  setTimeout(() => {
                    const partItemDom = document.getElementById(`${!show ? 'comparison' : 'parts'}${item.skuId}`);
                    partItemDom.scrollIntoView({block: 'center', behavior: 'smooth'});
                  }, 0);
                }
              }}>
                <List.Item.Meta
                  title={<Note style={{color: noExist && '#174ad4'}} maxWidth="94%" value={item.standard} />}
                  description={
                    <div>
                      <Note style={{color: noExist && '#174ad4'}} maxWidth="94%" value={SkuRender(item)} />
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
              {show ? <Space size={12}>
                <div style={{textAlign: 'center'}}>
                  {item.autoOutstock ? '推式' : '拉式'}
                  <br />
                  × {item.number}
                </div>
                {item.bomNum ? <Button
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
                  <SearchOutlined />
                </Button> : <div style={{width: 16}} />}
                {noExist ? <Button
                  style={{padding: 0}}
                  type="link"
                  onClick={() => {
                    addSku(item);
                  }}
                >
                  <RightOutlined />
                </Button> : <div style={{width: 16}} />}
              </Space> : <Space>
                <Space align="center">
                  数量：
                  <InputNumber addonBefore="" width={100} value={item.number || 1} min={1} onChange={(value) => {
                    setValue({number: value}, item.skuId);
                  }} />
                </Space>
                <Select
                  bordered={false}
                  value={typeof item.autoOutstock === 'number' ? item.autoOutstock : 1}
                  options={[
                    {label: '推式', value: 1},
                    {label: '拉式', value: 0},
                  ]}
                  onChange={(value) => setValue({autoOutstock: value}, item.skuId)}
                />

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
                  {item.bomNum ? <RightOutlined style={{width: 56}} /> : '添加bom'}
                </Button>
              </Space>}
            </div>
          </div>}
      </div>
    </>;
  };

  return <>

    <div className={styles.checkList}>
      <div style={{left: show ? 24.5 : 49.5}} className={styles.line} />
      <div style={{paddingRight: show ? 0 : 40}} className={styles.list}>
        <Sortable
          handle
          getItemStyles={() => {
            return {
              padding: 0,
              width: '100%'
            };
          }}
          definedItem={Item}
          items={(show ? dataSources : [...dataSources, {add: true, disabled: true}]).map((item) => {
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
