import React, {useState} from 'react';
import {Button, Input, Radio, Table} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import InputNumber from '@/components/InputNumber';
import Render from '@/components/Render';

const AddSkuTable = ({
  value = [],
  onChange = () => {
  },
  setDeleted = () => {
  }
}) => {

  const [keys, setKeys] = useState([]);

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

  return <>
    <Table
      dataSource={dataSources}
      pagination={false}
      rowKey="skuId"
      footer={() => {
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
        return index + 1;
      }} />
      <Table.Column title="物料编号" width={200} dataIndex="coding" />
      <Table.Column title="物料" dataIndex="skuResult" render={(value) => {
        return <SkuResultSkuJsons skuResult={value} />;
      }} />
      <Table.Column title="数量" width={100} dataIndex="number" render={(value, record, index) => {
        return <InputNumber value={value || 1} min={1} onChange={(value) => {
          setValue({number: value}, record.skuId);
        }} />;
      }} />
      <Table.Column title="投产方式" width={150} dataIndex="autoOutstock" render={(value, record) => {
        return <Render width={150}>
          <Radio.Group
            defaultValue={1}
            value={value}
            onChange={({target: {value}}) => setValue({autoOutstock: value}, record.skuId)}
          >
            <Radio value={1}>推式</Radio>
            <Radio value={0}>拉式</Radio>
          </Radio.Group>
        </Render>;
      }} />
      <Table.Column title="备注" dataIndex="note" render={(value, record, index) => {
        return <Input.TextArea placeholder="请输入备注" rows={1} value={value} onChange={(value) => {
          setValue({note: value.target.value}, record.skuId);
        }} />;
      }} />
      <Table.Column title="操作" dataIndex="skuId" align="center" width={100} render={(value, record, index) => {
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
  </>;
};

export default AddSkuTable;
