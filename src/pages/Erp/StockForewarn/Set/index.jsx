import React, {useRef, useState} from 'react';
import ProCard from '@ant-design/pro-card';
import {Button, Input, message, Modal, Radio, Space} from 'antd';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './index.module.less';
import SelectSku from '@/pages/Erp/sku/components/SelectSku';
import InputNumber from '@/components/InputNumber';
import Table from '@/components/Table';
import DelButton from '@/components/DelButton';
import BackButton from '@/components/BackButton';
import store from '@/store';
import Select from '@/components/Select';
import Cascader from '@/components/Cascader';
import {storehousePositionsTreeView} from '@/pages/Erp/storehouse/components/storehousePositions/storehousePositionsUrl';
import {useRequest} from '@/util/Request';
import {stockForewarnAdd, stockForewarnDelete, stockForewarnList} from '@/pages/Erp/StockForewarn/url';
import Form from '@/components/Form';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';

const {FormItem} = Form;

const Set = () => {

  const tableRef = useRef();

  const [state] = store.useModel('dataSource');

  const [data, setData] = useState({type: 'sku'});

  const {addLoading, run: add} = useRequest(stockForewarnAdd, {
    response: true,
    manual: true,
    onSuccess: (res) => {
      if (res.errCode === 1001) {
        Modal.confirm({
          content: res.message,
          onOk: () => {
            return add({
              data: {
                update: true,
                type: data.type,
                formId: data.id,
                inventoryFloor: data.min,
                inventoryCeiling: data.max,

              }
            });
          }
        });
      } else {
        message.success('添加成功!');
        tableRef.current.submit();
        setData({type: 'sku'});
      }
    }
  });

  const types = [
    {value: 'sku', label: '指定物料'},
    {value: 'skuClass', label: '物料分类'},
    {value: 'position', label: '仓库库位'},
  ];

  const columns = [
    {
      title: '类型', dataIndex: 'type', render: (value) => {
        return types.find(item => item.value === value)?.label || '-';
      }
    },
    {
      title: '内容', dataIndex: 'formId', render: (value, record) => {
        switch (record.type) {
          case 'sku':
            return SkuResultSkuJsons({skuResult: record.skuResult});
          case 'skuClass':
            return record.spuClassificationResult?.name;
          case 'position':
            return record.storehousePositionsResult?.name;
          default:
            break;
        }
      }
    },
    {title: '库存下限', dataIndex: 'inventoryFloor'},
    {title: '库存上限', dataIndex: 'inventoryCeiling'},
    {title: '添加人', dataIndex: 'createUserResult',render:(value)=>{
      return value?.name;
    }},
    {title: '添加时间', dataIndex: 'createTime'},
    {
      title: '操作', dataIndex: 'forewarnId', render: (value) => {
        return <DelButton
          value={value}
          api={stockForewarnDelete}
          rowKey="forewarnId"
          onSuccess={() => {
            message.success('删除成功！');
            tableRef.current.refresh();
          }}
        />;
      }
    },
  ];

  let Content = <></>;
  let contentProps = {};

  switch (data.type) {
    case 'sku':
      Content = SelectSku;
      contentProps = {
        noSpu: true,
      };
      break;
    case 'skuClass':
      Content = Select;
      contentProps = {
        placeholder: '搜索物料分类',
        width: 200,
        options: state.skuClass,
      };
      break;
    case 'position':
      Content = Cascader;
      contentProps = {
        placeholder: '搜索仓库库位',
        width: 200,
        api: storehousePositionsTreeView,
      };
      break;
    default:
      break;
  }

  const searchForm = () => {
    return <>
      <FormItem name="type" label="类型" component={Select} allowClear width={200} options={types} placeholder="请选择类型" />
      <FormItem name="content" label="内容" component={Input} placeholder="请输入内容" />
    </>;
  };

  return <>
    <div className={styles.breadcrumb}>
      <Breadcrumb title="预警设置" />
    </div>
    <div className={styles.set}>
      <ProCard title="预警条件" className="h2Card" headerBordered extra={<BackButton />}>
        <Space size={40} align="center">
          <div>
            条件类型：
            <Radio.Group options={types} value={data.type} onChange={({target: {value}}) => {
              setData({...data, id: null, type: value});
            }} />
          </div>
          <Space>
            预警内容：
            <Content
              value={data.id}
              onChange={(id) => {
                setData({...data, id});
              }}
              {...contentProps}
            />
          </Space>
          <div>
            <InputNumber
              width={100}
              placeholder="库存下限"
              value={data.min}
              onChange={(min) => setData({...data, min})}
            />
            <InputNumber
              min={data.min + 1}
              style={{marginLeft: 8}}
              width={100}
              placeholder="库存上限"
              value={data.max}
              onChange={(max) => setData({...data, max})}
            />
          </div>
          <div>
            <Button loading={addLoading} type="primary" onClick={() => {
              if (!data.id || typeof data.max !== 'number' || typeof data.min !== 'number') {
                return message.warn('请输入完整报警规则!');
              } else if (data.max <= data.min) {
                return message.warn('库存上限不能低于库存下限!');
              }
              add({
                data: {
                  type: data.type,
                  formId: data.id,
                  inventoryFloor: data.min,
                  inventoryCeiling: data.max,
                }
              });
            }}>添加</Button>
          </div>
        </Space>
      </ProCard>
      <ProCard title="预警内容" className="h2Card" headerBordered>
        <Table
          searchForm={searchForm}
          api={stockForewarnList}
          ref={tableRef}
          bodyStyle={{padding: 0}}
          cardHeaderStyle={{display: 'none'}}
          searchStyle={{margin: 0, padding: '0 0 16px'}}
          rowKey="forewarnId"
          columns={columns}
          noRowSelection
        />
      </ProCard>
    </div>
  </>;
};

export default Set;
