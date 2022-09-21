import React from 'react';
import {FormButtonGroup, SchemaForm, Submit} from '@formily/antd';
import {Input, InputNumber, Radio, Select, Checkbox} from 'antd';
import DatePicker from '@/components/DatePicker';

const {Group: RadioGroup} = Radio;
const {Group: CheckboxGroup} = Checkbox;

const Test = () => {


  return <>
    <SchemaForm
      components={{
        Input,
        Select,
        DatePicker,
        InputNumber,
        RadioGroup,
        CheckboxGroup,
      }}
      labelCol={7}
      wrapperCol={12}
      onSubmit={console.log}
      schema={{
        type: 'object',
        properties: {
          'year': {  // 字段的key
            required: true, // 必填
            default: '11', // 默认值
            title: '下拉选择', // label标题
            'x-component': 'select', // 数据录入组件
            'x-component-props': { // 数据录入组件参数
              options: [{label: '11', value: '11'}, {label: '22', value: '22'}]
            }
          },
          'name': {
            required: true,
            default: '111',
            title: '输入框',
            'x-component': 'input',
          },
          'age': {
            required: true,
            title: '数字框',
            'x-component': 'inputNumber',
          },
          'sex': {
            required: true,
            title: '单选框',
            'x-component': 'RadioGroup',
            'x-component-props': {
              options: [{label: '11', value: '11'}, {label: '22', value: '22'}]
            }
          },
          'like': {
            required: true,
            title: '多选框',
            'x-component': 'CheckboxGroup',
            'x-component-props': {
              options: [{label: 'Apple', value: 'Apple'}, {label: 'Pear', value: 'Pear'}]
            }
          },
          'createTime': {
            required: true,
            title: '时间框',
            'x-component': 'datePicker',
          }
        }
      }}
    >
      <FormButtonGroup offset={7}>
        <Submit>提交</Submit>
      </FormButtonGroup>
    </SchemaForm>
  </>;
};


export default Test;
