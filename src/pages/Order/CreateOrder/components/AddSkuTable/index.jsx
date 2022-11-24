import React, {useState} from 'react';
import {Button, Table, Space, Spin, Input} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import {useRequest} from '@/util/Request';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import Select from '@/components/Select';
import {unitListSelect} from '@/pages/Erp/spu/spuUrl';
import InputNumber from '@/components/InputNumber';
import CheckBrand from '@/pages/Erp/brand/components/CheckBrand';

const AddSkuTable = ({
  onChange = () => {
  },
  value,
  module,
  currency,
  onAddSku = () => {
  }
}) => {

  const SO = module === 'SO';

  const [keys, setKeys] = useState([]);

  const {data: unitData} = useRequest(unitListSelect);

  const dataSources = value.map((item, index) => {
    return {
      ...item,
      index
    };
  });


  const sharedOnCell = (data) => {
    if (!data.skuId) {
      return {colSpan: 0};
    }
  };

  const setValue = (data, index) => {
    const array = dataSources.map((item) => {
      if (item.index === index) {
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
      sticky
      dataSource={dataSources}
      pagination={false}
      rowKey="index"
      scroll={{x: 'max-content'}}
      footer={() => {
        return <Space>
          <Button
            onClick={() => {
              onAddSku();
            }}
          >
            {SO ? '添加产品' : '添加物料'}
          </Button>
          <Button
            type="link"
            disabled={keys.length === 0}
            icon={<DeleteOutlined />}
            onClick={() => {
              const ids = keys.map((item) => {
                return item.index;
              });
              const array = dataSources.filter((item) => {
                return !ids.includes(item.index);
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
          return item.index;
        }),
        onChange: (keys, record) => {
          setKeys(record);
        }
      }}
    >
      <Table.Column
        title="序号"
        onCell={sharedOnCell}
        width={100}
        fixed="left"
        align="center"
        dataIndex="index"
        render={(value) => {
          return value + 1;
        }} />
      <Table.Column
        fixed="left"
        title="物料编码"
        onCell={sharedOnCell}
        dataIndex="coding"
        render={(value, record) => {
          return <div style={{minWidth: 100}}>
            {value || (record.skuResult && record.skuResult.standard)}
          </div>;
        }} />
      <Table.Column
        fixed="left"
        title="物料"
        onCell={sharedOnCell}
        dataIndex="skuResult"
        render={(value) => {
          return <SkuResultSkuJsons skuResult={value} />;
        }} />
      <Table.Column
        title="品牌 / 厂家"
        onCell={sharedOnCell}
        width={200}
        dataIndex="defaultBrandResult"
        render={(value, record, index) => {
          return value
            ||
            <CheckBrand
              placeholder="请选择品牌/厂家"
              width={200}
              value={record.brandId}
              onChange={(value, option) => {
                setValue({brandId: value, brandResult: option && option.label}, index);
              }} />;
        }} />
      {!SO && <Table.Column
        title="预购数量"
        align="center"
        width={100}
        dataIndex="preordeNumber"
        onCell={sharedOnCell}
        render={(value) => {
          return value || 0;
        }} />}
      <Table.Column
        onCell={sharedOnCell}
        title={SO ? '销售数量' : '采购数量'}
        width={120}
        dataIndex="purchaseNumber"
        render={(value, record, index) => {
          return <InputNumber
            placeholder="请输入数量"
            value={value}
            min={0}
            onChange={(value) => {
              setValue({
                purchaseNumber: value,
                totalPrice: (record.onePrice || 0) * (value || 0),
              }, index);
            }}
          />;
        }} />
      <Table.Column
        title="单位"
        onCell={sharedOnCell}
        width={120}
        dataIndex="unitId"
        render={(value, record, index) => {
          return <Select
            placeholder="请选择单位"
            options={unitData}
            value={value}
            onChange={(value) => {
              setValue({unitId: value}, index);
            }}
          />;
        }} />
      <Table.Column
        title={`单价 (${currency})`}
        width={150}
        onCell={sharedOnCell}
        dataIndex="onePrice"
        render={(value, record, index) => {
          return <InputNumber
            placeholder="请输入单价"
            precision={2}
            min={0}
            value={value}
            onChange={(value) => {
              setValue({
                onePrice: value,
                totalPrice: (record.purchaseNumber || 0) * (value || 0),
              }, index);
            }}
          />;
        }} />
      <Table.Column
        title={`总价 (${currency})`}
        width={150}
        onCell={sharedOnCell}
        dataIndex="totalPrice"
        render={(value, record, index) => {
          return <InputNumber
            placeholder="请输入总价"
            precision={2}
            min={1}
            value={value}
            onChange={(value) => {
              setValue({
                totalPrice: value,
              }, index);
            }}
          />;
        }} />
      <Table.Column
        title="备注"
        width={100}
        onCell={sharedOnCell}
        dataIndex="remark"
        render={(value, record, index) => {
          return <Input
            style={{minWidth:200}}
            placeholder="请输入备注"
            value={value}
            onChange={(value) => {
              setValue({remark: value.target.value}, index);
            }}
          />;
        }} />

      <Table.Column
        onCell={(data, index) => {
          return !data.skuId && {
            colSpan: 12,
          };
        }}
        render={(value, record) => {
          return !record.skuId && <div style={{marginLeft: 16}}><Spin /></div>;
        }} />
      <Table.Column
        title="操作"
        onCell={sharedOnCell}
        fixed="right"
        dataIndex="skuId"
        align="center"
        width={50}
        render={(value, record, index) => {
          return <><Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => {
              const array = dataSources.filter((item) => {
                return item.index !== index;
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
