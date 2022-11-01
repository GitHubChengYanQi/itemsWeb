import React, {useState} from 'react';
import Form from '@/components/Form';
import {ReceiptsEnums} from '@/pages/BaseSystem/Documents/Enums';
import FormLayout from '@/components/Form/components/FormLayout';
import Coding from '@/pages/Erp/tool/components/Coding';
import style from '@/pages/Order/CreateOrder/index.module.less';
import {DatePicker, Input} from 'antd';
import moment from 'moment';
import Select from '@/components/Select';
import {UserIdSelect} from '@/pages/Crm/business/BusinessUrl';


const {FormItem} = Form;

const AddProductionPlan = () => {

  const [currentStep, setCurrentStep] = useState({});

  return <div style={{minWidth: 800, padding: 24}}>
    <Form
      className={style.form}
      wrapperCol={24}
      NoButton={false}
      value={false}
      api={{
        add: {},
      }}
    >
      <FormLayout
        value={currentStep.step}
        onChange={setCurrentStep}
        formType={ReceiptsEnums.production}
        fieldRender={(item) => {
          let formItemProps = {};
          switch (item.key) {
            case 'coding':
              formItemProps = {
                component: Coding,
                module: 13
              };
              break;
            case 'theme':
              formItemProps = {
                component: Input,
                placeholder: '请输入主题'
              };
              break;
            case 'time':
              formItemProps = {
                component: DatePicker,
                width: '100%',
                showTime: true,
                RangePicker: true,
                disabledDate: (currentDate) => {
                  return currentDate && currentDate < moment().subtract(1, 'days');
                },
              };
              break;
            case 'userId':
              formItemProps = {
                component: Select,
                api: UserIdSelect,
                width: '100%',
                placeholder: '请选择负责人',
              };
              break;
            case 'remark':
              formItemProps = {
                component: Input.TextArea,
                rows: 2,
                placeholder: '请输入生产计划备注',
              };
              break;
            case 'orderDetailParams':
              formItemProps = {
                component: Input,
              };
              break;
            default:
              break;
          }
          return <FormItem
            label={item.filedName}
            name={item.key}
            required={item.required}
            {...formItemProps}
          />;
        }}
      />
    </Form>
  </div>;
};

export default AddProductionPlan;
