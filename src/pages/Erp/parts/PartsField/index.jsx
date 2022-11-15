/**
 * 清单字段配置页
 *
 * @author
 * @Date 2021-07-14 14:30:20
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  Input,
  InputNumber,
  Select as AntdSelect,
  Radio,
  Spin, Descriptions, Button, Space, Table,
} from 'antd';
import ProCard from '@ant-design/pro-card';
import Select from '@/components/Select';
import * as apiUrl from '../PartsUrl';
import {partsListSelect, spuListSelect} from '../PartsUrl';
import SelectSpu from '@/pages/Erp/spu/components/SelectSpu';
import {useRequest} from '@/util/Request';
import SpuAttribute from '@/pages/Erp/instock/components/SpuAttribute';
import SelectSku from '@/pages/Erp/sku/components/SelectSku';
import SkuConfiguration from '@/pages/Erp/sku/components/SkuConfiguration';
import Modal from '@/components/Modal';
import CheckSku from '@/pages/Erp/sku/components/CheckSku';
import AddSkuTable from '@/pages/Erp/parts/components/AddSkuTable';
import {DeleteOutlined} from '@ant-design/icons';
import SkuResultSkuJsons from '@/pages/Erp/sku/components/SkuResult_skuJsons';
import {isArray} from '@/util/Tools';
import Render from '@/components/Render';

export const BrandId = (props) => {
  return (<Select api={apiUrl.brandIdSelect} {...props} />);
};

export const Item = (props) => {
  return (<Select api={apiUrl.ProductNameListSelect} Select {...props} />);
};

export const Name = (props) => {
  return (<Input style={{width: 400}} placeholder="请输入版本号"  {...props} />);
};

export const SkuInput = (props) => {
  return (<Input  {...props} />);
};

export const SpuId = (props) => {

  const {onChange, ...other} = props;

  return (<SelectSpu
    onChange={async (value) => {
      onChange(value);
    }}
    {...other} />);
};

export const Remake = (props) => {

  const {sku, select, ...other} = props;

  return (<SpuAttribute sku={sku} select={select} {...other} />);
};

export const Number = (props) => {
  return (<InputNumber min={0}   {...props} />);
};

export const PartName = (props) => {
  return (<Input {...props} />);
};

export const brandName = (props) => {
  return (<Input   {...props} />);
};

export const SkuName = (props) => {
  return (<Input   {...props} />);
};


export const Note = (props) => {
  return (<Input.TextArea   {...props} />);
};

export const Attributes = (props) => {
  return (<SkuConfiguration {...props} />);
};

export const SelectSpuId = (props) => {

  return (<Select
    width="100%"
    data={{type: 1}}
    placeholder="型号"
    api={spuListSelect}
    {...props}
  />);
};

export const Spu = (props) => {

  useEffect(() => {
    if (props.spuId) {
      props.onChange({spuId: props.spuId});
    }
  }, []);

  useEffect(() => {
    if (props.type) {
      props.onChange(null);
    }
  }, [props.type]);
  return (<Select
    width="100%"
    data={{type: 1}}
    placeholder="型号"
    disabled={props.spuId}
    api={spuListSelect}
    value={props.value && props.value.spuId}
    onChange={(value) => {
      props.onChange({spuId: value});
    }} />);
};
export const Standard = (props) => {
  return (<Input {...props} />);
};

export const Bom = (props) => {
  return (<SelectSku {...props} />);
};

export const Sku = (props) => {

  useEffect(() => {
    if (!props.type) {
      props.onChange(null);
    }
  }, [props.type]);

  return (
    <SelectSku width={400} value={props.value && props.value.skuId} disabled={props.disabled} onChange={(value) => {
      props.onChange({skuId: value});
    }} />);
};

export const SkuId = (props) => {

  return (<SelectSku {...props} />);
};


export const SkuIdInput = (props) => {

  return (<Input {...props} />);
};

export const Pid = (props) => {

  const {value, onChange, getSkuId} = props;

  const {loading, data, run} = useRequest(partsListSelect, {manual: true});

  const options = !loading ? data : [];

  useEffect(() => {
    run({data: {status: 99, type: 1}});
  }, []);

  return (<AntdSelect
    options={options || []}
    notFoundContent={loading && <div style={{textAlign: 'center', padding: 16}}><Spin /></div>}
    showSearch
    onSearch={(value) => {
      run({
        data: {
          partName: value,
          type: 1
        }
      });
    }}
    value={value}
    onChange={(value, option) => {
      onChange(value);
      getSkuId(option.id);
    }}
  />);
};

export const Action = (props) => {
  return <Radio.Group value={props.value} onChange={(value) => {
    props.onChange(value.target.value);
  }}>
    <Radio.Button value="researchBom">增加设计BOM</Radio.Button>
    <Radio.Button value="productionBom">增加子物料BOM</Radio.Button>
  </Radio.Group>;
};

export const ShowSku = ({value}) => {
  if (!Array.isArray(value)) {
    return null;
  }
  return <>
    <Descriptions column={1} bordered>
      {
        value.map((item, index) => {
          return <Descriptions.Item key={index} label={item.label}>{item.value}</Descriptions.Item>;
        })
      }
    </Descriptions>
  </>;
};

export const Show = ({value}) => {
  return <>{value}</>;
};

export const AddSku = (
  {
    value = [],
    onChange,
    loading,
    extraButton,
    setDeleted = () => {
    },
  }) => {

  const ref = useRef();

  const addSkuRef = useRef();

  return (<>
    <ProCard
      style={{marginTop: 24}}
      bodyStyle={{padding: 16}}
      className="h2Card"
      title="子件信息"
      headerBordered
      extra={<Space>
        {extraButton}
        <Button onClick={() => {
          ref.current.open(true);
        }}>批量添加物料</Button>
      </Space>}
    >

      {
        loading
          ?
          <div style={{textAlign: 'center'}}>
            <Spin />
          </div>
          :
          <AddSkuTable
            setDeleted={setDeleted}
            value={value}
            onChange={onChange}
          />
      }
    </ProCard>

    <Modal
      ref={ref}
      width={1000}
      headTitle="添加物料"
      footer={<Space>
        <Button onClick={() => {
          const res = addSkuRef.current.check();
          onChange(isArray(res));
        }}>选中</Button>
        <Button type="primary" onClick={() => {
          const res = addSkuRef.current.change();
          onChange(isArray(res));
          ref.current.close();
        }}>选中并关闭</Button>
      </Space>}
    >
      <CheckSku
        value={value}
        ref={addSkuRef}
      />
    </Modal>
  </>);
};

export const BackSku = ({
  deleted = [],
  setDeleted = () => {
  },
  back = () => {
  },
}) => {

  const [keys, setKeys] = useState([]);

  return <ProCard
    style={{marginTop: 24}}
    bodyStyle={{padding: 16}}
    className="h2Card"
    title="删除信息"
    headerBordered
  >
    <Table
      dataSource={deleted}
      pagination={false}
      rowKey="key"
      footer={() => {
        return <>
          <Button
            type="link"
            disabled={keys.length === 0}
            icon={<DeleteOutlined />}
            onClick={() => {
              const ids = keys.map(item => item.key);
              setDeleted(deleted.filter((item) => {
                return !ids.includes(item.key);
              }));
              setKeys([]);
              back(keys);
            }}
            danger
          >
            批量还原
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
      <Table.Column title="序号" width={70} align="center" dataIndex="skuId" render={(value, record, index) => {
        return index + 1;
      }} />
      <Table.Column title="物料编号" width={200} dataIndex="coding" />
      <Table.Column title="物料" dataIndex="skuResult" render={(value) => {
        return <SkuResultSkuJsons skuResult={value} />;
      }} />
      <Table.Column title="数量" width={100} dataIndex="number" render={(value) => {
        return value || 1;
      }} />
      <Table.Column title="投产方式" width={100} dataIndex="autoOutstock" render={(value) => {
        return <Render width={200}>
          <Radio.Group
            disabled
            defaultValue={1}
            value={value}
          >
            <Radio value={1}>推式</Radio>
            <Radio value={0}>拉式</Radio>
          </Radio.Group>
        </Render>;
      }} />
      <Table.Column title="备注" dataIndex="note" render={(value) => {
        return value;
      }} />
      <Table.Column title="操作" dataIndex="key" align="center" width={100} render={(value, record) => {
        return <Button type="link" onClick={() => {
          setDeleted(deleted.filter((item) => {
            return item.key !== value;
          }));
          setKeys(keys.filter((item) => {
            return item.key !== value;
          }));
          back([record]);
        }}>还原</Button>;
      }} />

    </Table>
  </ProCard>;
};


