/**
 * 编辑页
 *
 * @author song
 * @Date 2022-02-24 14:55:10
 */

import React, {useImperativeHandle, useRef, useState} from 'react';
import {createFormActions, FormButtonGroup, Reset} from '@formily/antd';
import {Button, Input} from 'antd';
import Form from '@/components/Form';
import {ReceiptsEnums} from '@/pages/BaseSystem/Documents/Enums';
import style from '@/pages/Order/CreateOrder/index.module.less';
import FormLayout, {FormLayoutSubmit} from '@/components/Form/components/FormLayout';
import {isArray} from '@/util/Tools';
import InputNumber from '@/components/InputNumber';
import SelectOrder from '@/pages/Order/components/SelectOrder';
import {paymentAdd, paymentDetail, paymentEdit} from '@/pages/Purshase/Payment/PaymentUrl';
import DatePicker from '@/components/DatePicker';
import FileUpload from '@/components/FileUpload';

const formActionsPublic = createFormActions();

const {FormItem} = Form;

const ApiConfig = {
  view: paymentDetail,
  add: paymentAdd,
  save: paymentEdit
};

const PaymentEdit = ({previewData, orderId, ...props}, ref) => {

  const formRef = useRef();

  const [currentStep, setCurrentStep] = useState({});

  const [id, setId] = useState(props.value || false);

  const money = (props) => {
    return <InputNumber min={0.01} precision={2} addonAfter="人民币" {...props} />;
  };

  useImperativeHandle(ref, () => ({
    submit: formRef.current.submit
  }));

  return <div style={{paddingTop: orderId && 12}}>
    <Form
      noButton
      value={id}
      ref={formRef}
      {...props}
      formActions={formActionsPublic}
      api={ApiConfig}
      onSubmit={(values) => {
        if (orderId) {
          return {...values, orderId};
        }
        return {...values};
      }}
      onSuccess={(res) => {
        if (currentStep.step < isArray(currentStep.steps).length - 1) {
          setCurrentStep({
            ...currentStep,
            step: currentStep.step + 1,
            type: isArray(currentStep.steps)[currentStep.step + 1].type
          });
        } else {
          props.onSuccess();
        }
        setId(res?.data?.recordId || false);
      }}
    >
      <FormLayout
        previewData={previewData}
        value={currentStep.step}
        onChange={setCurrentStep}
        formType={ReceiptsEnums.payment}
        fieldRender={(item) => {
          let formItemProps = {};
          switch (item.key) {
            case 'paymentAmount':
              formItemProps = {
                component: money,
              };
              break;
            case 'remark':
              formItemProps = {
                component: Input.TextArea,
              };
              break;
            case 'orderId':
              if (orderId) {
                return;
              }
              formItemProps = {
                component: SelectOrder,
              };
              break;
            case 'paymentDate':
              formItemProps = {
                component: DatePicker,
                showTime: true,
              };
              break;
            case 'field':
              formItemProps = {
                privateUpload: true,
                component: FileUpload,
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

    {(!previewData && !orderId) && <FormButtonGroup offset={11} className={style.bottom}>
      <Button
        type="primary"
        onClick={() => FormLayoutSubmit({currentStep, setCurrentStep, formRef})}>
        {currentStep.step < isArray(currentStep.steps).length - 1 ? '下一步' : '保存'}
      </Button>
      <Reset>取消</Reset>
    </FormButtonGroup>}
  </div>;
};

export default React.forwardRef(PaymentEdit);
