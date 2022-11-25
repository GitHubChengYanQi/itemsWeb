import React, {useImperativeHandle, useRef} from 'react';
import {Input, message} from 'antd';
import moment from 'moment';
import Form from '@/components/Form';
import {ReceiptsEnums} from '@/pages/BaseSystem/Documents/Enums';
import FormLayout, {FormLayoutSubmit} from '@/components/Form/components/FormLayout';
import Coding from '@/pages/Erp/tool/components/Coding';
import style from '@/pages/Order/CreateOrder/index.module.less';
import Select from '@/components/Select';
import {UserIdSelect} from '@/pages/Crm/business/BusinessUrl';
import AddSku from '@/pages/Production/ProductionPlan/AddProductionPlan/components/AddSku';
import {createProductionPlan} from '@/pages/Production/Url';
import DatePicker from '@/components/DatePicker';


const {FormItem} = Form;

const AddProductionPlan = ({previewData, currentStep = {}, setCurrentStep, ...props}, ref) => {

  const formRef = useRef();

  const submit = () => {
    FormLayoutSubmit({currentStep, setCurrentStep, formRef});
  };

  useImperativeHandle(ref, () => ({
    submit
  }));

  return <div style={{minWidth: 1000, padding: 24, display: 'inline-block'}}>
    <Form
      {...props}
      ref={formRef}
      className={style.form}
      wrapperCol={24}
      NoButton={false}
      value={false}
      api={{
        add: createProductionPlan,
      }}
      onSubmit={(value) => {
        const orderDetailParams = value.orderDetailParams || [];
        const orderDetail = orderDetailParams.filter(item => item.skuId && item.purchaseNumber && item.deliveryDate);

        if (orderDetailParams.length === 0 || orderDetail.length !== orderDetailParams.length) {
          message.warn('请完善生产物料信息');
          return false;
        }

        return {
          ...value,
          executionTime: value.time[0],
          endTime: value.time[1],
        };
      }}
    >
      <FormLayout
        previewData={previewData}
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
                placeholder: `请选择${item.filedName}`,
              };
              break;
            case 'remark':
              formItemProps = {
                component: Input.TextArea,
                rows: 2,
              };
              break;
            case 'orderDetailParams':
              formItemProps = {
                component: AddSku,
                label: null,
                itemClassName: style.itemClassName
              };
              break;
            default:
              break;
          }
          return <FormItem
            placeholder={`请输入${item.filedName}`}
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

export default React.forwardRef(AddProductionPlan);
