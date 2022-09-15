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
            required:true,
            'x-linkages': [
              {
                type: 'value:state',
                target: 'string',
                condition: '{{ $value == "11"}}',
                schema: {
                  title:'123',
                  value:'{{$value}}'
                },
                otherwise: {
                  title:'{{$value}}',
                  value:'{{$value}}'
                }
              }
            ],
            title: 'Select',
            'x-component': 'select',
            'x-component-props': {
              options: [{label: '11', value: '11'},{label: '22', value: '22'}]
            }
          },
          string: {
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
