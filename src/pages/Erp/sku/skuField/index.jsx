/**
 * sku表字段配置页
 *
 * @author
 * @Date 2021-10-18 14:14:21
 */

import React, {useEffect, useState} from 'react';
import {
  Input, Radio, AutoComplete, Spin, List, Button, Space,
} from 'antd';
import Cascader from '@/components/Cascader';
import Select from '@/components/Select';
import {useRequest} from '@/util/Request';
import {spuListSelect} from '@/pages/Erp/parts/PartsUrl';
import {
  spuClassificationTreeVrew
} from '@/pages/Erp/spu/components/spuClassification/spuClassificationUrl';
import Coding from '@/pages/Erp/tool/components/Coding';
import SetSelectOrCascader from '@/components/SetSelectOrCascader';
import FileUpload from '@/components/FileUpload';
import SkuConfiguration from '@/pages/Erp/sku/components/SkuConfiguration';
import store from '@/store';
import InputNumber from '@/components/InputNumber';
import SpuClassificationEdit from '@/pages/Erp/spu/components/spuClassification/spuClassificationEdit';
import UnitEdit from '@/pages/Erp/unit/unitEdit';
import {materialListSelect} from '@/pages/Erp/material/MaterialUrl';
import MaterialEdit from '@/pages/Erp/material/MaterialEdit';
import {unitListSelect} from '@/pages/Erp/unit/unitUrl';
import cookie from 'js-cookie';

export const Type = (props) => {

  return (<InputNumber {...props} />);
};


export const SelectSkuName = (props) => {

  return (<Input {...props} />);
};

export const Specifications = (props) => {
  return (<SkuConfiguration {...props} />);
};

export const SelectSpu = (props) => {

  return (<Select api={spuListSelect} {...props} />);
};


export const SpuId = (props) => {

  const {classId, value, onChange, onBlur, placeholder, onFocus, autoFocus} = props;

  const {loading, data, run} = useRequest(spuListSelect, {manual: true});

  const action = (name) => {
    run({
      data: {
        name, spuClassificationId: classId,
      }
    });
  };

  useEffect(() => {
    action(value?.name);
    if (classId && value?.name) {
      onChange(null);
    }
  }, [classId]);


  const options = loading ? [] : data && data.map((items) => {
    return {
      label: items.label, value: items.label, id: items.value,
    };
  });

  return (<AutoComplete
    autoFocus={autoFocus}
    onFocus={onFocus}
    value={value?.name || null}
    notFoundContent={loading && <Spin />}
    options={options || []}
    style={{width: 300}}
    onSelect={(value, option) => {
      onChange({name: value, spuId: option.id});
    }}
    onBlur={onBlur}
    onChange={async (value) => {
      if (value === '') {
        onChange(null);
      } else {
        onChange({name: value});
      }
      action(value);
    }}
    placeholder={placeholder}
  />);
};

export const Attributes = (props) => {
  return (<Input {...props} />);
};


export const ClassCode = (props) => {
  return (<Input {...props} />);
};


export const SkuName = (props) => {

  const {value, onChange, disabled, placeholder, fieldName, ...other} = props;

  const {loading, data, run} = useRequest({
    url: '/generalFormData/list',
    method: 'POST',
    data: {fieldName},
  }, {
    debounceInterval: 300,
  });

  const options = (!loading && data) ? data.map((value) => {
    return {
      label: value.value,
      value: value.value,
    };
  }) : [];

  return <>
    <AutoComplete
      autoFocus={cookie.get('skuEditFocus') === fieldName}
      disabled={disabled}
      dropdownMatchSelectWidth={100}
      notFoundContent={loading && <Spin />}
      options={options}
      value={value}
      onSelect={(value) => {
        onChange(value);
      }}
    >
      <Input
        {...other}
        placeholder={placeholder}
        onChange={(value) => {
          onChange(value.target.value);
          run({
            data: {
              fieldName,
              value: value.target.value,
            }
          });
        }}
      />
    </AutoComplete>
  </>;
};


export const SpuCoding = (props) => {
  return (<Input {...props} />);
};

export const Codings = (props) => {

  const {data, ...other} = props;

  useEffect(() => {
    if (other.copy) {
      other.onChange(null);
    }
  }, []);

  return (<div>
    <Coding {...other} />
    {data && data.merge && <List size="small">
      <List.Item>
        <div>
          已有编码：{data.standard}
        </div>
        <Button type="link" style={{padding: 0}} onClick={() => {
          other.onChange(data.standard);
        }}>使用</Button>
      </List.Item>
      <List.Item>
        <div>
          合并编码：{data.newCoding}
        </div>
        <Button type="link" style={{padding: 0}} onClick={() => {
          other.onChange(data.newCoding);
        }}>使用</Button>
      </List.Item>
    </List>}

  </div>);
};
export const UnitId = ({itemKey, ...props}) => {
  return (<SetSelectOrCascader
    api={unitListSelect}
    width={200}
    title={props.title}
    component={UnitEdit}
    autoFocus={cookie.get('skuEditFocus') === itemKey}
    {...props}
  />);
};

export const Standard = (props) => {
  const {...other} = props;

  return (<Input {...other} />);
};

export const SelectSpuClass = (props) => {
  return (<Cascader api={spuClassificationTreeVrew} width={200}  {...props} />);
};

export const SpuClass = (props) => {

  const [state] = store.useModel('dataSource');

  const {itemKey, ...other} = props;

  return (<SetSelectOrCascader
    width="100%"
    autoFocus={cookie.get('skuEditFocus') === itemKey}
    options={state.skuClass}
    moduleType="cascader"
    drawerWidth={1200}
    title="新增分类"
    type={1}
    component={SpuClassificationEdit}
    changeOnSelect={false}
    {...other}
  />);
};

export const Note = ({itemKey, ...props}) => {
  return (<Input.TextArea autoFocus={cookie.get('skuEditFocus') === itemKey} {...props} />);
};

export const Material = ({itemKey, ...props}) => {
  return (
    <SetSelectOrCascader
      autoFocus={cookie.get('skuEditFocus') === itemKey}
      api={materialListSelect}
      width={200}
      title={props.title}
      component={MaterialEdit}
      {...props}
    />);
};

export const SkuSize = ({value = '', onChange}) => {

  const [size, setSize] = useState({
    long: null,
    width: null,
    height: null
  });

  useEffect(() => {
    if (value) {
      const defaultSize = value.split(',');
      setSize({
        long: defaultSize[0],
        width: defaultSize[1],
        height: defaultSize[2],
      });
    }
  }, []);
  const change = (data = {}) => {
    const newSize = {...size, ...data};
    setSize(newSize);
    onChange(`${newSize.long || 0},${newSize.width || 0},${newSize.height || 0}`);
  };
  return (<Space>
    <InputNumber value={size.long} placeholder="长" onChange={(num) => change({long: num})} />
    ×
    <InputNumber value={size.width} placeholder="宽" onChange={(num) => change({width: num})} />
    ×
    <InputNumber value={size.height} placeholder="高" onChange={(num) => change({height: num})} />
  </Space>);
};

export const AddMethod = (props) => {
  return (<Input {...props} />);
};

export const Specs = (props) => {
  return (<Input {...props} />);
};

export const MaintenancePeriod = ({itemKey, ...props}) => {
  return (<InputNumber autoFocus={cookie.get('skuEditFocus') === itemKey} addonAfter="天" {...props} />);
};


export const Weight = ({itemKey, ...props}) => {
  return (<InputNumber min={0} autoFocus={cookie.get('skuEditFocus') === itemKey} precision={3}
                       addonAfter="kg" {...props} />);
};

export const FileId = (props) => {
  return (<FileUpload {...props} maxCount={5} />);
};

export const Img = (props) => {
  return (<div style={{maxWidth: 300}}>
    <FileUpload {...props} maxCount={5} title={props.title} />
  </div>);
};

export const Bind = (props) => {
  return (<div style={{maxWidth: 300}}>
    <FileUpload {...props} maxCount={5} title={props.title} />
  </div>);
};

export const State = (props) => {
  return (<Radio.Group {...props}>
    <Radio value={1}>标配</Radio>
    <Radio value={0}>非标配</Radio>
  </Radio.Group>);
};

export const Batch = (props) => {
  return (<Radio.Group {...props}>
    <Radio value={1}>
      一批一码
    </Radio>
    <Radio value={0}>
      一件一码
    </Radio>
  </Radio.Group>);
};

