import React, {useEffect, useImperativeHandle} from 'react';
import {Button, Form, Input, InputNumber, Modal, Select} from 'antd';
import {UseOrder} from 'MES-Apis/lib/Order';
import ProSkeleton from '@ant-design/pro-skeleton';
import {isArray} from '@/util/Tools';
import FileUpload from '@/components/FileUpload';
import Date from '@/pages/Purshase/RequestFunds/RequestFundsAdd/components/Date';
import Message from '@/components/Message';
import {Init} from 'MES-Apis/lib/Init';
import UpLoad from '@/pages/Purshase/RequestFunds/RequestFundsAdd/components/UpLoad';

const RequestFundsAdd = ({
  orderId,
  bankName,
  bankAccount,
  money,
  contactsName,
  remark,
  onLoading = () => {
  },
  onSuccess = () => {
  }
}, ref) => {

  const [form] = Form.useForm();

  const {loading, data, run} = UseOrder.getRequestFundsTemplate({}, {
    manual: true
  });

  const {run: save} = UseOrder.requestFundsPost({}, {
    manual: true,
    onSuccess: () => {
      onSuccess();
      onLoading(false);
      Message.success('提交请款申请成功！');
    },
    onError: () => {
      onLoading(false);
      console.log(Init.getNewErrorMessage());
      Modal.error({
        title: '提交请款申请失败！',
        content: Init.getNewErrorMessage(),
      });
    }
  });

  useEffect(() => {
    run();
  }, []);

  const submit = () => {
    form.submit();
  };

  const reset = () => {
    form.resetFields();
  };

  useImperativeHandle(ref, () => ({
    submit,
    reset
  }));

  if (loading) {
    return <ProSkeleton />;
  }

  return <>
    <div style={{padding: '24px 0'}}>
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 800,
        }}
        initialValues={{
          'item-1494251052639': money,
          'item-1494251194643': bankName,
          'item-1494251179316': bankAccount,
          'item-1494251166594': contactsName,
          'item-1494251203122': remark,
        }}
        onFinish={(values) => {
          const contents = [];
          Object.keys(values).forEach(id => {
            const control = isArray(data?.data?.templateContent?.controls).find(item => item.property.id === id);
            if (!values[id]) {
              return;
            }
            const title = control.property.title;
            switch (control.property.control) {
              case 'Text':
              case 'Textarea':
                contents.push({
                  'control': control.property.control,
                  'id': id,
                  'titles': title,
                  'value': {
                    'text': values[id]
                  }
                });
                break;
              case 'Money':
                contents.push({
                  'control': control.property.control,
                  'id': id,
                  'titles': title,
                  'value': {
                    'new_money': values[id]
                  }
                });
                break;
              case 'Selector':
                contents.push({
                  'control': control.property.control,
                  'id': id,
                  'titles': title,
                  'value': {
                    'selector': {
                      'type': control.config.selector.type,
                      'options': control.config.selector.type === 'multi' ? values[id].map(item => {
                        const option = control.config.selector.options.find(option => option.key === item);
                        return {
                          key: item,
                          values: option.value,
                        };
                      }) : [{
                        key: values[id],
                        values: control.config.selector.options[0].value
                      }]
                    }
                  }
                });
                break;
              case 'Date':
                contents.push({
                  'control': control.property.control,
                  'id': id,
                  'titles': title,
                  'value': {
                    'date': {
                      'type': control.config.date.type,
                      'timestamp': values[id]
                    }
                  }
                });
                break;
              case 'File':
                contents.push({
                  'control': control.property.control,
                  'id': id,
                  'titles': title,
                  'value': {
                    'files': values[id].split(',').map(item => ({
                      'file_id': item
                    }))
                  }
                });
                break;
              default:
                break;
            }
          });
          onLoading(true);
          save({
            data: {
              orderId,
              applyData: {
                contents
              }
            }
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
                components =
                  <InputNumber addonBefore="￥" style={{minWidth: 200}} precision={2} placeholder={`请输入${label}`} />;
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
                components = <UpLoad orderId={orderId} />;
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
      </Form>
    </div>
  </>;
};

export default React.forwardRef(RequestFundsAdd);
