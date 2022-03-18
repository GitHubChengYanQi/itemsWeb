import React, {useState} from 'react';
import {Button, Table} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import InputNumber from '@/components/InputNumber';
import BrandBind from '@/pages/Erp/brand/components/BrandBind';
import {stockDetailsList} from '@/pages/Erp/stockDetails/StockDetailsUrl';
import {request} from '@/util/Request';

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
      <Table.Column title="序号" width={70} align="center" dataIndex="key" render={(value) => {
        return value + 1;
      }} />
      <Table.Column title="物料编号" width={200} dataIndex="coding" />
      <Table.Column title="物料" dataIndex="skuResult" render={(value) => {
        return <SkuResultSkuJsons skuResult={value} />;
      }} />
      <Table.Column title="品牌" dataIndex="brandId" render={(value, record, index) => {
        return <BrandBind skuId={record.skuId} value={value} onChange={async (value) => {
          let number = 0;
          const res = await request({...stockDetailsList, data: {skuId: record.skuId, brandId: value || null}});
          if (res && res.length > 0) {
            res.map((item) => {
              return number += item.number;
            });
          }
          setValue({brandId: value, maxNumber: number}, index);
        }} />;
      }} />
      {/* <Table.Column title="供应商" dataIndex="customertId" render={(value, record, index) => { */}
      {/*  return supplyLoading ? <Spin /> : <Select options={supplyData} value={value} onChange={(value) => { */}
      {/*    setValue({customertId: value}, index); */}
      {/*  }} />; */}
      {/* }} /> */}
      <Table.Column title="数量" width={100} dataIndex="number" render={(value, record, index) => {
        return <InputNumber
          placeholder={`库存 ${record.maxNumber || 0}`}
          value={value}
          min={1}
          max={record.maxNumber}
          onChange={(value) => {
            setValue({number: value}, index);
          }} />;
      }} />
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
