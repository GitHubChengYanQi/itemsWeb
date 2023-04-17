/**
 * 编码规则字段配置页
 *
 * @author song
 * @Date 2021-10-22 17:20:05
 */

import React, {useEffect, useState} from 'react';
import {
  Input,
  Select as AntdSelect,
  Radio,
  Space
} from 'antd';
import InputNumber from '@/components/InputNumber';

export const Name = (props) => {
  return (<Input {...props} placeholder="请输入规则名称" />);
};
export const CreateUser = (props) => {
  return (<Input {...props} />);
};
export const UpdateUser = (props) => {
  return (<Input {...props} />);
};
export const CreateTime = (props) => {
  return (<Input {...props} />);
};
export const UpdateTime = (props) => {
  return (<Input {...props} />);
};
export const Display = (props) => {
  return (<Input {...props} />);
};
export const DeptId = (props) => {
  return (<Input {...props} />);
};

export const Note = (props) => {
  return (<Input.TextArea placeholder="请填写该编码规则的编制原则，如每个字段代表何种意思" {...props} />);
};
export const State = (props) => {
  return (<Radio.Group {...props} >
    <Radio>是</Radio>
    <Radio>是</Radio>
  </Radio.Group>);
};


export const Values = (props) => {

  const {module, onChange, value} = props;

  const [number, setNumber] = useState();

  const [state, setState] = useState(true);

  useEffect(() => {
    if (value) {
      switch (value) {
        case `\${YYYY}`:
        case `\${YY}`:
        case `\${MM}`:
        case `\${dd}`:
        case `\${randomInt}`:
        case `\${week}`:
        case `\${randomString}`:
        case `\${quarter}`:
        case `\${skuClass}`:
        case `\${storehouse}`:
        case `\${spuCoding}`:
          setState('通用');
          break;
        default:
          if (/\$\{(serial.*?(\[(\d[0-9]?)\]))\}/.test(value)) {
            setNumber(value.split('[')[1].split(']')[0]);
            setState('流水号');
          } else {
            setState('自定义');
          }
          break;

      }
    }
  }, [value]);

  const modules = () => {
    switch (module) {
      case 0:
        // 物料
        return [{
          // eslint-disable-next-line no-template-curly-in-string
          label: '分类码',
          // eslint-disable-next-line no-template-curly-in-string
          value: '${skuClass}'
        }, {
          // eslint-disable-next-line no-template-curly-in-string
          label: '产品码',
          // eslint-disable-next-line no-template-curly-in-string
          value: '${spuCoding}'
        }
        ];
      case 1:
      case 2:
        // 1.出库
        // 2.入库
        return [{
          // eslint-disable-next-line no-template-curly-in-string
          label: '仓库码',
          // eslint-disable-next-line no-template-curly-in-string
          value: '${storehouse}'
        }];
      case 4:
        // 质检任务
        return [{
          // eslint-disable-next-line no-template-curly-in-string
          label: '类型',
          // eslint-disable-next-line no-template-curly-in-string
          value: '${type}'
        }];
      case 20:
        // 机床编号
        return [{
          // eslint-disable-next-line no-template-curly-in-string
          label: '产品码',
          // eslint-disable-next-line no-template-curly-in-string
          value: '${spuCoding}'
        }, {
          // eslint-disable-next-line no-template-curly-in-string
          label: '型号码',
          // eslint-disable-next-line no-template-curly-in-string
          value: '${modelCoding}'
        }, {
          // eslint-disable-next-line no-template-curly-in-string
          label: '合同码',
          // eslint-disable-next-line no-template-curly-in-string
          value: '${contractCoding}'
        },];
      default:
        return [];
    }
  };

  const serial = [
    {
      label: '流水号',
      options: [
        // eslint-disable-next-line no-template-curly-in-string
        {label: '流水号', value: 'serial'},
      ]
    }
  ];

  const input = [
    {
      label: '通用',
      options: [
        // eslint-disable-next-line no-template-curly-in-string
        {label: '四位数年', value: '${YYYY}'},
        // eslint-disable-next-line no-template-curly-in-string
        {label: '两位数年', value: '${YY}'},
        // eslint-disable-next-line no-template-curly-in-string
        {label: '两位数月', value: '${MM}'},
        // eslint-disable-next-line no-template-curly-in-string
        {label: '两位数日', value: '${dd}'},
        // eslint-disable-next-line no-template-curly-in-string
        {label: '随机数', value: '${randomInt}'},
        // eslint-disable-next-line no-template-curly-in-string
        {label: '当前日期所属年份的第几周', value: '${week}'},
        // eslint-disable-next-line no-template-curly-in-string
        {label: '随机字符串', value: '${randomString}'},
        // eslint-disable-next-line no-template-curly-in-string
        {label: '当前季度', value: '${quarter}'},
      ]
    },
    ...(modules().length > 0 ? [{
      label: '模块',
      options: modules()
    }] : []),
  ];

  const options = [
    ...input,
    ...serial,
    {
      label: '自定义',
      options: [
        // eslint-disable-next-line no-template-curly-in-string
        {label: '自定义', value: '自定义'},
      ]
    },
  ];

  const menu = () => {
    switch (state) {
      case '流水号':
        return <Space>
          <AntdSelect
            placeholder="流水号"
            dropdownMatchSelectWidth={292}
            style={{minWidth: 50, display: 'inline-block'}}
            options={[
              ...input,
              {
                label: '自定义',
                options: [
                  // eslint-disable-next-line no-template-curly-in-string
                  {label: '自定义', value: '自定义'},
                ]
              },
            ]}
            showSearch
            value="流水号"
            filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            onSelect={(value) => {
              onChange(value);
              if (value === '自定义') {
                setState('自定义');
                onChange(null);
              } else {
                setState(true);
              }
            }} />
          <InputNumber style={{width: 200}} value={number} placeholder="长度" min="0" onChange={(value) => {
            setNumber(value);
            onChange(`\${serial[${value}]}`);
          }} />
        </Space>;
      case '自定义':
        return <Space>
          <AntdSelect
            value="自定义"
            style={{minWidth: 50}}
            options={[...input, ...serial]}
            dropdownMatchSelectWidth={292}
            onSelect={(value) => {
              onChange(value);
              if (value === 'serial') {
                setState('流水号');
                onChange(null);
              } else {
                setState(true);
              }
            }} />
          <Input value={value} style={{width: 200}} placeholder="输入自定义编码" onChange={(value) => {
            onChange(value.target.value);
          }} />
        </Space>;
      default:
        return <AntdSelect
          placeholder="选择编码类型"
          style={{minWidth: 292, display: 'inline-block'}}
          options={options}
          allowClear
          showSearch
          value={value}
          filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          onSelect={(value) => {
            if (value === '自定义') {
              setState('自定义');
              onChange(null);
            } else if (value === 'serial') {
              setState('流水号');
              onChange(null);
            } else {
              setState(true);
              onChange(value);
            }
          }} />;
    }
  };

  return (<div>
    {menu()}
  </div>);
};

export const ModuleOptions = [
  {label: '物料', value: 0},
  {label: '入库', value: 1},
  {label: '出库', value: 2},
  {label: '质检', value: 3},
  {label: '质检任务', value: 4},
  {label: '采购申请', value: 5},
  {label: '盘点任务', value: 6},
  {label: '采购询价', value: 7},
  {label: '作业指导编码', value: 8},
  {label: '作业指导版本', value: 9},
  {label: '工序编码', value: 10},
  {label: '采购单', value: 11},
  {label: '合同', value: 12},
  {label: '生产计划', value: 13},
  {label: '产品', value: 14},
  {label: '入库异常', value: 15},
  {label: '养护任务', value: 16},
  {label: '调拨任务', value: 17},
  {label: '生产任务', value: 18},
  {label: '型号编码', value: 19},
  {label: '生产卡片编号', value: 20},
];


export const Module = (props) => {

  return (<AntdSelect options={ModuleOptions} {...props} placeholder="请选择对应模块" />);
};
