/**
 * 清单字段配置页
 *
 * @author
 * @Date 2021-07-14 14:30:20
 */

import React, {useEffect} from 'react';
import {
  Input,
  InputNumber,
  Select as AntdSelect,
  Radio,
  Spin, Descriptions,
} from 'antd';
import ProCard from '@ant-design/pro-card';
import {getSearchParams} from 'ice';
import Select from '@/components/Select';
import * as apiUrl from '../PartsUrl';
import {partsListSelect, spuListSelect} from '../PartsUrl';
import SelectSpu from '@/pages/Erp/spu/components/SelectSpu';
import {useRequest} from '@/util/Request';
import SpuAttribute from '@/pages/Erp/instock/components/SpuAttribute';
import SelectSku from '@/pages/Erp/sku/components/SelectSku';
import SkuConfiguration from '@/pages/Erp/sku/components/SkuConfiguration';
import AddSkuTable from '@/pages/Erp/parts/components/AddSkuTable';

export const BrandId = (props) => {
  return (<Select api={apiUrl.brandIdSelect} {...props} />);
};

export const Item = (props) => {
  return (<Select api={apiUrl.ProductNameListSelect} Select {...props} />);
};

export const Name = (props) => {


  const searchParams = getSearchParams();

  const show = searchParams.type === 'show';

  return (<Input readOnly={show} placeholder="请输入版本号"  {...props} />);
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

  return (
    <SelectSku
      noSpu
      width="100%"
      value={props.value && props.value.skuId}
      disabled={props.disabled}
      onChange={(value, sku) => {
        props.onChange({skuId: value, sku});
      }}
    />);
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
          return <Descriptions.Item
            key={index}
            label={item.label}
          >
            {item.value}
          </Descriptions.Item>;
        })
      }
    </Descriptions>
  </>;
};

export const Show = ({value}) => {
  return <>{value}</>;
};

export const BackSku = ({
  deleted = [],
  setDeleted = () => {
  },
  onBack = () => {
  },
}) => {

  return <ProCard
    style={{marginTop: 24}}
    bodyStyle={{padding: 16}}
    className="h2Card"
    title="删除信息"
    headerBordered
  >
    <AddSkuTable value={deleted} setDeleted={setDeleted} back onBack={onBack} />
  </ProCard>;
};


