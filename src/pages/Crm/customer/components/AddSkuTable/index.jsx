import React, {useState} from 'react';
import {Button, Table} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import BrandIds from '@/pages/Erp/brand/components/BrandIds';
import Render from '@/components/Render';
import Note from '@/components/Note';

const AddSkuTable = ({
  value = [],
  onChange = () => {
  }
}) => {

  const [keys, setKeys] = useState([]);


  const dataSources = value.map((item, index) => {
    return {
      ...item,
      key: index
    };
  });


  return <>
    <Table
      dataSource={dataSources}
      pagination={false}
      rowKey="key"
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
      <Table.Column title="物料编号" dataIndex="standard" render={(value) => {
        return <Render>{value}</Render>;
      }} />
      <Table.Column title="物料" dataIndex="spuName" render={(value, record) => {
        return <Note
          maxWidth={200}
          value={`${value} ${record.skuName ? ` / ${record.skuName}` : ''}${record.specifications ? ` / ${record.specifications}` : ''}`} />;
      }} />
      <Table.Column title="品牌" width={400} dataIndex="brandIds" render={(value, record, index) => {
        return <>
          <BrandIds
            value={value}
            onChange={(value) => {
              const array = dataSources.map((item) => {
                if (item.key === index) {
                  return {
                    ...item,
                    brandIds: value
                  };
                } else {
                  return item;
                }
              });
              onChange(array);
            }} />
        </>;
      }} />
      <Table.Column />
      <Table.Column title="操作" dataIndex="skuId" align="center" width={100} render={(value, record, index) => {
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
