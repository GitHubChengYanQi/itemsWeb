import React, {useEffect} from 'react';
import {Button, Form, Input, InputNumber, Select, Space} from 'antd';
import {UseOrder} from 'MES-Apis/src/Order';
import ProSkeleton from '@ant-design/pro-skeleton';
import {isArray} from '@/util/Tools';
import FileUpload from '@/components/FileUpload';
import Date from '@/pages/Purshase/RequestFunds/Add/components/Date';

const Add = () => {

  const [form] = Form.useForm();

  const {loading, data, run} = UseOrder.getRequestFundsTemplate({}, {
    manual: true
  });

  useEffect(() => {
    run();
  }, []);

  if (loading) {
    return <ProSkeleton />;
  }

  return <>
    <div>
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={(values) => {
          console.log(values);

          Object.keys(values).map(item => {
            switch (isArray(data?.data?.templateContent?.controls)) {
              case 'Text':

                break;
              case 'Textarea':

                break;
              case 'Money':

                break;
              case 'Selector':

                break;
              case 'Date':

                break;
              case 'File':

                break;
              default:
                break;
            }
            return {};
          });
        }}
        autoComplete="off"
      >
        {
          isArray(data?.data?.templateContent?.controls).map((item, index) => {

            const label = item.property.title.find(item => item.lang === 'zh_CN').text;

            let components = <></>;

            switch (item.property.control) {
              case 'Text':
                components = <Input placeholder={`请输入${label}`} />;
                break;
              case 'Textarea':
                components = <Input.TextArea rows={3} placeholder={`请输入${label}`} />;
                break;
              case 'Money':
                components = <InputNumber style={{minWidth: 200}} precision={2} placeholder={`请输入${label}`} />;
                break;
              case 'Selector':
                components = <Select
                  placeholder={`请选择${label}`}
                  mode={item.config.selector.type === 'multi' && 'multiple'}
                  options={item.config.selector.options.map(item => ({
                    label: item.value.find(item => item.lang === 'zh_CN').text,
                    value: item.key
                  }))}
                />;
                break;
              case 'Date':
                components = <Date showTime={item.config.date.type === 'hour'} />;
                break;
              case 'File':
                components = <FileUpload maxCount={5} />;
                break;
              default:
                break;
            }

            return <div key={index}>
              <Form.Item
                label={label}
                name={item.property.id}
                rules={[
                  {
                    required: item.property.require === 1,
                    message: '该项为必填项!',
                  },
                ]}
              >
                {components}
              </Form.Item>
            </div>;
          })
        }

        <div style={{textAlign: 'center'}}>
          <Space>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <Button htmlType="button" onClick={() => {
              form.resetFields();
            }}>
              取消
            </Button>
          </Space>
        </div>

      </Form>
    </div>
  </>;
};

export default Add;
