import React, {useState} from 'react';
import {Button, Space, Table} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import {Date} from '@/pages/Purshase/purchaseAsk/purchaseAskField';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import Render from '@/components/Render';
import MyNote from '@/components/Note';
import InputNumber from '@/components/InputNumber';

const AddSkuTable = (
  {
    footer,
    onChange = () => {
    },
    value = [],
  }) => {

  const [keys, setKeys] = useState([]);

  const dataSources = value.map((item, index) => {
    return {
      ...item,
      key: index
    };
  });

  const setValue = (data, index) => {
    const array = dataSources.map((item) => {
      if (item.key === index) {
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
      scroll={{x: 'max-content'}}
      dataSource={dataSources}
      pagination={false}
      rowKey="key"
      footer={() => {
        return <Space>
          {footer}
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
              onChange(array);
              setKeys([]);
            }}
            danger
          >
            批量删除
          </Button>
        </Space>;
      }}
      rowSelection={{
        selectedRowKeys: keys.map((item) => {
          return item.key;
        }),
        onChange: (keys, record) => {
          setKeys(record);
        }
      }}
    >
      <Table.Column title="序号" align="center" dataIndex="key" render={(value) => {
        return <Render width={50}>{value + 1}</Render>;
      }} />
      <Table.Column title="物料编号" dataIndex="skuResult" render={(value) => {
        return <Render>{value && value.standard}</Render>;
      }} />
      <Table.Column title="物料" dataIndex="skuResult" width={200} render={(value) => {
        return <MyNote maxWidth={200}>
          <SkuResultSkuJsons skuResult={value} />
        </MyNote>;
      }} />
      <Table.Column title="生产数量" dataIndex="purchaseNumber" render={(value, record, index) => {
        return <Render width={50}>
          <InputNumber
            placeholder="请输入生产数量"
            value={value}
            onChange={(value) => {
              setValue({purchaseNumber: value}, index);
            }}
          />
        </Render>;
      }} />
      <Table.Column title="交付日期(天)" dataIndex="deliveryDate" render={(value, record, index) => {
        return <Render>
          <InputNumber
            placeholder="交付日期"
            value={value}
            onChange={(value) => {
              setValue({deliveryDate: value}, index);
            }}
          />
        </Render>;
      }} />

      <Table.Column />
      <Table.Column
        title="操作"
        dataIndex="skuId"
        fixed="right"
        align="center"
        width={100}
        render={(value, record, index) => {
          return <><Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => {
              const array = dataSources.filter((item) => {
                return item.key !== index;
              });
              onChange(array);
            }}
            danger
          /></>;
        }} />

    </Table>
  </>;
};

export default AddSkuTable;
