import React, {useRef, useState} from 'react';
import {Alert, Button, Input, Radio, Spin, Table} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import InputNumber from '@/components/InputNumber';
import Render from '@/components/Render';
import Note from '@/components/Note';
import {useRequest} from '@/util/Request';
import {bomsByskuId} from '@/pages/Erp/parts/PartsUrl';
import Modal from '@/components/Modal';
import styles from './index.module.less';
import Icon from '@/components/Icon';

const AddSkuTable = ({
  back,
  value = [],
  onChange = () => {
  },
  setDeleted = () => {
  },
  onBack = () => {
  }
}) => {

  const versionModalRef = useRef();

  const [keys, setKeys] = useState([]);

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

  return <>
    <Table
      dataSource={dataSources}
      pagination={false}
      rowKey={back ? 'key' : 'skuId'}
      footer={() => {
        if (back) {
          return <Button
            type="link"
            disabled={keys.length === 0}
            icon={<DeleteOutlined />}
            onClick={() => {
              const ids = keys.map(item => item.key);
              setDeleted(dataSources.filter((item) => {
                return !ids.includes(item.key);
              }));
              setKeys([]);
              onBack(keys);
            }}
            danger
          >
            批量还原
          </Button>;
        }
        return <>
          <Button
            type="link"
            disabled={keys.length === 0}
            icon={<DeleteOutlined />}
            onClick={() => {
              const ids = keys.map((item) => {
                return item.skuId;
              });
              const array = value.filter((item) => {
                return !ids.includes(item.skuId);
              });
              setDeleted(keys);
              onChange(array);
              setKeys([]);
            }}
            danger
          >
            批量删除
          </Button>
        </>;
      }}
      rowSelection={{
        selectedRowKeys: keys.map((item) => {
          return item.skuId;
        }),
        onChange: (keys, record) => {
          setKeys(record);
        }
      }}
    >
      <Table.Column title="序号" width={70} align="center" dataIndex="skuId" render={(value, record, index) => {
        return <Render text={index + 1} width={50} />;
      }} />
      <Table.Column title="物料编号" width={150} dataIndex="standard" />
      <Table.Column title="物料" width={150} dataIndex="spuName" render={(value, record) => {
        return <Note
          value={`${value} ${record.skuName ? ` / ${record.skuName}` : ''}${record.specifications ? ` / ${record.specifications}` : ''}`} />;
      }} />
      <Table.Column title="数量" width={150} dataIndex="number" align="center" render={(value, record) => {
        return back ? (value || 1) : <Render><InputNumber value={value || 1} min={1} onChange={(value) => {
          setValue({number: value}, record.skuId);
        }} /></Render>;
      }} />
      <Table.Column title="投产方式" width={150} align="center" dataIndex="autoOutstock" render={(value, record) => {
        if (back) {
          return value === 0 ? '拉式' : '推式';
        }
        return <Render width={150}>
          <Radio.Group
            disabled={back}
            defaultValue={1}
            value={value}
            onChange={({target: {value}}) => setValue({autoOutstock: value}, record.skuId)}
          >
            <Radio value={1}>推式</Radio>
            <Radio value={0}>拉式</Radio>
          </Radio.Group>
        </Render>;
      }} />

      <Table.Column title="指定版本" dataIndex="bomNum" width={150} align="center" render={(value, record) => {
        if (back) {
          return (record.bomId ? (record.version || '-') : '选择版本');
        }
        return <Button
          type="link"
          disabled={!value}
          onClick={() => {
            bomsByskuIdRun({params: {skuId: record.skuId}});
            versionModalRef.current.open(false);
            setSkuId(record.skuId);
            setCurrentVer(record.bomId);
          }}
        >{record.bomId ? (record.version || '-') : '选择版本'}</Button>;
      }} />


      <Table.Column title="备注" width={400} dataIndex="note" render={(value, record) => {
        return back ? value : <Input.TextArea placeholder="请输入备注" rows={1} value={value} onChange={(value) => {
          setValue({note: value.target.value}, record.skuId);
        }} />;
      }} />
      <Table.Column title="操作" dataIndex="skuId" align="center" width={100} render={(value, record) => {
        if (back) {
          return <Button type="link" onClick={() => {
            setDeleted(dataSources.filter((item) => {
              return item.key !== record.key;
            }));
            setKeys(keys.filter((item) => {
              return item.key !== record.key;
            }));
            onBack([record]);
          }}>还原</Button>;
        }
        return <><Button
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => {
            setDeleted([record]);
            const array = dataSources.filter((item) => {
              return item.skuId !== value;
            });
            setKeys(keys.filter((item) => {
              return item.skuId !== value;
            }));
            onChange(array);
          }}
          danger
        /></>;
      }} />
    </Table>

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
