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
  Space, Spin
} from 'antd';
import InputNumber from '@/components/InputNumber';
import {useRequest} from '@/util/Request';
import {getRoleV2} from '@/pages/BaseSystem/codingRules/codingRulesUrl';
import {isArray} from '@/util/Tools';

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

  const {module, onChange, value, codingRules = {}} = props;

  const [number, setNumber] = useState();

  const [type, setType] = useState(true);

  const moduleRules = isArray(codingRules?.modelRuleList).find(item => item.module === module);

  useEffect(() => {
    if (value) {
      const generalRule = isArray(codingRules?.generalRuleList).find(item => item.value === value);
      const moduleRule = isArray(moduleRules?.ruleList).find(item => item.value === value);
      if (/\$\{(serial.*?(\[(\d[0-9]?)\]))\}/.test(value)) {
        setNumber(value.split('[')[1].split(']')[0]);
        setType('流水号');
      } else if (generalRule || moduleRule) {
        setType('通用');
      } else {
        setType('自定义');
      }
    }else {
      setType('通用');
    }
  }, [value]);


  const options = [
    {
      label: '通用',
      options: codingRules?.generalRuleList || []
    },
    ...(moduleRules ? [{
      label: moduleRules.name,
      options: moduleRules.ruleList || []
    }] : []),
    {
      label: '自定义',
      options: [
        // eslint-disable-next-line no-template-curly-in-string
        {label: '自定义', value: '自定义'},
      ]
    },
  ];

  const typeChange = (type) => {
    onChange(null);
    if (type === '自定义') {
      setType('自定义');
    } else if (type === 'serial') {
      setType('流水号');
    } else {
      setType('通用');
      onChange(type);
    }
  };

  const menu = () => {
    switch (type) {
      case '流水号':
        return <Space>
          <AntdSelect
            placeholder="流水号"
            dropdownMatchSelectWidth={292}
            style={{minWidth: 50, display: 'inline-block'}}
            options={options}
            showSearch
            value="流水号"
            filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            onSelect={(value) => {
              typeChange(value);
            }} />
          <InputNumber style={{width: 200}} value={number} placeholder="长度" min="0" onChange={(value) => {
            setNumber(value || 0);
            onChange(`\${serial[${value || 0}]}`);
          }} />
        </Space>;
      case '自定义':
        return <Space>
          <AntdSelect
            value="自定义"
            style={{minWidth: 50}}
            options={options}
            dropdownMatchSelectWidth={292}
            onSelect={(value) => {
              typeChange(value);
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
            typeChange(value);
          }} />;
    }
  };

  return (<div>
    {menu()}
  </div>);
};


export const Module = ({modelRuleList = [], ...props}) => {

  const options = isArray(modelRuleList).map(item => ({label: item.name, value: item.module}));

  return (<AntdSelect options={options} {...props} placeholder="请选择对应模块" />);
};
