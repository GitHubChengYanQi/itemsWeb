import React from 'react';
import {FormButtonGroup, SchemaForm, Submit} from '@formily/antd';
import {Input, Select} from 'antd';

const Test = () => {


  return <>
    <SchemaForm
      components={{
        Input,
        Select,
      }}
      labelCol={7}
      wrapperCol={12}
      onSubmit={console.log}
      schema={{
        type: 'object',
        properties: {
          select: {
            required: true,
            'x-linkages': [
              {
                type: 'value:visible',
                target: 'string',
                condition: '{{ $self.value == "11"}}',
                state: {
                  visible:true,
                  title:'123',
                  value:'{{$value}}'
                },
                otherwise: {
                  visible:true,
                  title:'{{$value}}',
                  value:'{{$value}}'
                }
              }
            ],
            title: 'Select',
            'x-component': 'select',
            'x-component-props': {
              options: [{label: '11', value: '11'}, {label: '22', value: '22'}]
            }
          },
          string: {
            visible:false,
            default: '111',
            title: 'String',
            'x-component': 'input',
          },
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
