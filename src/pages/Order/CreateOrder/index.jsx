import React, {useEffect, useRef, useState} from 'react';
import {
  Affix,
  Button,
  Col,
  Drawer,
  notification,
  Result,
  Row,
  Space,
  Spin,
  Modal as AntModal, Alert, Select, Input
} from 'antd';
import {FormEffectHooks, InternalFieldList as FieldList} from '@formily/antd';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {getSearchParams, useHistory, useLocation} from 'ice';
import Breadcrumb from '@/components/Breadcrumb';
import Form from '@/components/Form';
import * as SysField from './components/Field';
import * as CustomerSysField from './components/CustomerAll';
import CustomerEdit from '@/pages/Crm/customer/CustomerEdit';
import {EffectsAction} from '@/pages/Order/CreateOrder/components/EffectsAction';
import store from '@/store';
import Modal from '@/components/Modal';
import PaymentTemplateList from '@/pages/Purshase/paymentTemplate/paymentTemplateList';
import {request, useRequest} from '@/util/Request';
import {paymentTemplateDetail, paymentTemplateListSelect} from '@/pages/Purshase/paymentTemplate/paymentTemplateUrl';
import Empty from '@/components/Empty';
import {skuResults} from '@/pages/Erp/sku/skuUrl';
import Draft from '@/components/Form/components/Draft';
import style from './index.module.less';
import {taxRateListSelect} from '@/pages/Purshase/taxRate/taxRateUrl';
import FormLayout, {FormLayoutSubmit} from '@/components/Form/components/FormLayout';
import {isArray} from '@/util/Tools';
import {orderAdd} from '@/pages/Order/url';
import {ReceiptsEnums} from '@/pages/BaseSystem/Documents/Enums';
import BottomButton from '@/components/BottomButton';

const {FormItem} = Form;

const ApiConfig = {
  view: {},
  add: orderAdd,
  save: orderAdd,
};

const span = 6;
const labelWidth = 128;

const CreateOrder = ({previewData, ...props}) => {

  const params = getSearchParams();

  const {state} = useLocation();

  const formRef = useRef();

  const [draftName, setDraftName] = useState('');

  const [id, setId] = useState(false);

  const skus = params.skus && Array.isArray(JSON.parse(params.skus)) && JSON.parse(params.skus);

  const initialValues = state || {};

  const {data: taxData} = useRequest(taxRateListSelect);

  const {run: getSkus} = useRequest(skuResults, {
    manual: true,
    onSuccess: (res) => {
      const detail = res.map((item, index) => {
        return {
          ...skus[index],
          skuResult: item,
        };
      });
      formRef.current.setFieldValue('detailParams', detail);
    }
  });


  useEffect(() => {
    if (skus) {
      getSkus({data: {skuIds: skus.map(item => item.skuId)}});
    }
  }, []);


  const module = () => {
    switch (params.module) {
      case 'SO':
        return {
          type: 2,
          title: '创建销售单',
          addCustomer: '创建客户',
          supply: 0,
          formType: ReceiptsEnums.saleOrder
        };
      case 'PO':
        return {
          type: 1,
          title: '创建采购单',
          addCustomer: '创建供应商',
          supply: 1,
          formType: ReceiptsEnums.purchaseOrder
        };
      default:
        return {};
    }
  };

  const ref = useRef();

  const history = useHistory();

  const {loading: templateLoading, data, refresh} = useRequest({...paymentTemplateListSelect, data: {oftenUser: 1}},);

  const [userInfo] = store.useModel('user');

  const [payPlan, setPayPlan] = useState();

  const [visible, setVisible] = useState();

  const [currentStep, setCurrentStep] = useState({});

  const [resultVisible, setResultVisible] = useState();

  const [loading, setLoading] = useState(false);

  const [success, setOrder] = useState();

  useEffect(() => {
    if (payPlan === 4) {
      // setPayPlan(null);
      ref.current.open(true);
    }
  }, [payPlan]);

  if (!module) {
    return <Empty />;
  }

  return <div style={{padding: 16}}>
    <Spin spinning={resultVisible ? false : loading}>

      <div hidden={previewData} style={{padding: '16px 0'}}>
        <Breadcrumb title={module().title} />
      </div>

      <Form
        className={style.form}
        value={id}
        ref={formRef}
        noButton
        api={ApiConfig}
        labelAlign="right"
        wrapperCol={24}
        fieldKey="orderId"
        initialValues={{...initialValues, orderId: null}}
        onSubmit={(value) => {
          if (value.paymentDetail) {
            let percentum = 0;
            value.paymentDetail.map((item) => {
              return percentum += item.percentum;
            });
            if (percentum !== 100) {
              notification.warn({
                message: '请检查付款批次',
              });
              return false;
            }
          }

          if (value.detailParams) {
            const detailParams = value.detailParams.filter((item) => {
              return item.skuId && item.purchaseNumber && item.onePrice;
            });
            if (detailParams.length !== value.detailParams.length) {
              notification.warn({
                message: '请检查物料清单信息！，品牌、数量、单价为必填信息!',
              });
              return false;
            }
          }

          value = {
            ...value,
            type: module().type,
            detailParams: isArray(value.detailParams).map(item => ({
              ...item,
              totalPrice: item.totalPrice * 100,
              onePrice: item.onePrice * 100
            })),
            paymentParam: {
              money: value.money * 100,
              detailParams: isArray(value.paymentDetail).map(item => ({
                ...item,
                money: item.money * 100,
              })),
              payMethod: value.payMethod,
              freight: value.freight,
              deliveryWay: value.deliveryWay,
              adressId: value.adressId,
              payPlan: value.payPlan,
              remark: value.remark,
              floatingAmount: value.floatingAmount * 100,
              totalAmount: value.totalAmount * 100,
              paperType: value.paperType,
              rate: value.rate,
            },
            contractParam: {
              templateId: value.templateId,
              coding: value.contractCoding,
              labelResults: value.labelResults,
            }
          };
          setLoading(true);
          if (currentStep.step === isArray(currentStep.steps).length - 1) {
            setResultVisible(true);
          }
          return value;
        }}
        effects={({setFieldState, getFieldState}) => {

          EffectsAction(setFieldState, getFieldState, (customer) => {
            setDraftName(customer.customerName);
          });

          FormEffectHooks.onFieldValueChange$('payPlan').subscribe(async ({value, active}) => {
            if (value && active) {
              setPayPlan(value);
              switch (value) {
                case 2:
                case 3:
                case 4:
                  setFieldState('paymentDetail', (state) => {
                    state.value = [{}];
                  });
                  break;
                default:
                  // eslint-disable-next-line no-case-declarations
                  const res = await request({...paymentTemplateDetail, data: {templateId: value}});
                  setFieldState('paymentDetail', (state) => {
                    state.value = res.templates;
                  });
                  break;
              }
            }

          });
        }}
        onSuccess={(res) => {
          if (currentStep.step < isArray(currentStep.steps).length - 1) {
            setCurrentStep({
              ...currentStep,
              step: currentStep.step + 1,
              type: isArray(currentStep.steps)[currentStep.step + 1].type
            });
          }

          setId(res?.data?.orderId || false);
          setOrder(res.data);
          setLoading(false);
        }}
        onError={() => {
          setLoading(false);
        }}
      >

        <FormLayout
          previewData={previewData}
          value={currentStep.step}
          onChange={setCurrentStep}
          formType={module().formType}
          fieldRender={(item) => {
            let formItemProps;
            switch (item.key) {
              case 'coding':
                formItemProps = {
                  module: 11,
                  component: SysField.Codings
                };
                break;
              case 'theme':
                formItemProps = {
                  component: Input
                };
                break;
              case 'date':
                formItemProps = {
                  component: SysField.Date
                };
                break;
              case 'currency':
                formItemProps = {
                  component: SysField.Currency
                };
                break;
              case 'remark':
                formItemProps = {
                  component: SysField.Remark
                };
                break;
              case 'buyerId':
                formItemProps = {
                  value: params.module === 'PO' ? userInfo.customerId : null,
                  selfEnterprise: params.module === 'PO',
                  supply: params.module === 'PO' ? null : 0,
                  placeholder: `请选择${item.filedName}`,
                  component: CustomerSysField.Customer,
                };
                break;
              case 'partyAAdressId':
                formItemProps = {
                  placeholder: `请选择${item.filedName}`,
                  component: CustomerSysField.Adress,
                };
                break;
              case 'partyAContactsId':
                formItemProps = {
                  placeholder: `请选择${item.filedName}`,
                  component: CustomerSysField.Contacts,
                };
                break;
              case 'partyAPhone':
                formItemProps = {
                  placeholder: `请选择${item.filedName}`,
                  component: CustomerSysField.Phone,
                };
                break;
              case 'partyABankId':
                formItemProps = {
                  placeholder: `请选择${item.filedName}`,
                  component: CustomerSysField.Bank,
                };
                break;
              case 'partyABankAccount':
                formItemProps = {
                  placeholder: `请选择${item.filedName}`,
                  component: CustomerSysField.BankAccount,
                };
                break;
              case 'partyALegalPerson':
                formItemProps = {
                  component: SysField.Show,
                };
                break;
              case 'partyABankNo':
                formItemProps = {
                  component: SysField.Show,
                };
                break;
              case 'partyACompanyPhone':
                formItemProps = {
                  component: SysField.Show,
                };
                break;
              case 'partyAFax':
                formItemProps = {
                  component: SysField.Show,
                };
                break;
              case 'partyAZipCode':
                formItemProps = {
                  component: SysField.Show,
                };
                break;
              case 'sellerId':
                formItemProps = {
                  value: params.module === 'SO' ? userInfo.customerId : null,
                  selfEnterprise: params.module === 'SO',
                  supply: params.module === 'SO' ? null : 1,
                  placeholder: `请选择${item.filedName}`,
                  component: CustomerSysField.Customer,
                };
                break;
              case 'partyBAdressId':
                formItemProps = {
                  placeholder: `请选择${item.filedName}`,
                  component: CustomerSysField.Adress,
                };
                break;
              case 'partyBContactsId':
                formItemProps = {
                  placeholder: `请选择${item.filedName}`,
                  component: CustomerSysField.Contacts,
                };
                break;
              case 'partyBPhone':
                formItemProps = {
                  placeholder: `请选择${item.filedName}`,
                  component: CustomerSysField.Phone,
                };
                break;
              case 'partyBBankId':
                formItemProps = {
                  placeholder: `请选择${item.filedName}`,
                  component: CustomerSysField.Bank,
                };
                break;
              case 'partyBBankAccount':
                formItemProps = {
                  placeholder: `请选择${item.filedName}`,
                  component: CustomerSysField.BankAccount,
                };
                break;
              case 'partyBLegalPerson':
                formItemProps = {
                  placeholder: `请选择${item.filedName}`,
                  component: SysField.Show,
                };
                break;
              case 'partyBBankNo':
                formItemProps = {
                  placeholder: `请选择${item.filedName}`,
                  component: SysField.Show,
                };
                break;
              case 'partyBCompanyPhone':
                formItemProps = {
                  placeholder: `请选择${item.filedName}`,
                  component: SysField.Show,
                };
                break;
              case 'partyBFax':
                formItemProps = {
                  placeholder: `请选择${item.filedName}`,
                  component: SysField.Show,
                };
                break;
              case 'partyBZipCode':
                formItemProps = {
                  placeholder: `请选择${item.filedName}`,
                  component: SysField.Show,
                };
                break;
              case 'detailParams':
                formItemProps = {
                  label: '',
                  module: params.module,
                  component: SysField.AddSku,
                  ...props
                };
                break;
              case 'paperType':
                formItemProps = {
                  options: [{label: '普票', value: 0}, {label: '专票', value: 1}],
                  placeholder: `请选择${item.filedName}`,
                  component: Select,
                };
                break;
              case 'rate':
                formItemProps = {
                  options: taxData || [],
                  placeholder: `请选择${item.filedName}`,
                  component: Select,
                };
                break;
              case 'money':
                formItemProps = {
                  disabled: true,
                  component: SysField.Money,
                };
                break;
              case 'floatingAmount':
                formItemProps = {
                  component: SysField.Float,
                };
                break;
              case 'totalAmount':
                formItemProps = {
                  component: SysField.Money,
                };
                break;
              case 'freight':
                formItemProps = {
                  value: 1,
                  component: SysField.Freight,
                };
                break;
              case 'payMethod':
                formItemProps = {
                  component: SysField.PayMethod,
                };
                break;
              case 'payPlan':
                formItemProps = {
                  data,
                  value: 3,
                  loading: templateLoading,
                  placeholder: `请选择${item.filedName}`,
                  component: SysField.PayPlan,
                };
                break;
              case 'paymentDetail':
                return <FieldList
                  name="paymentDetail"
                  initialValue={[
                    {payType: 0, dateNumber: 1, dateWay: 1},
                  ]}
                >
                  {({state, mutators}) => {
                    const onAdd = () => mutators.push();
                    return (
                      <div>
                        {state.value.map((item, index) => {
                          const onRemove = index => mutators.remove(index);
                          return <Row gutter={24} key={index}>
                            <Col span={8}>
                              <div style={{display: 'flex'}}>
                                <FormItem
                                  label={`第${index + 1}批`}
                                  name={`paymentDetail.${index}.index`}
                                  component={SysField.Index}
                                />
                                <Space>
                                  {
                                    payPlan === 2 ?
                                      <FormItem
                                        label="付款日期"
                                        name={`paymentDetail.${index}.payTime`}
                                        component={SysField.PayTime}
                                      />
                                      :
                                      <>
                                        <FormItem
                                          name={`paymentDetail.${index}.payType`}
                                          component={SysField.PayType}
                                        />
                                        <FormItem
                                          name={`paymentDetail.${index}.dateNumber`}
                                          component={SysField.dateNumber}
                                        />
                                        <FormItem
                                          name={`paymentDetail.${index}.dateWay`}
                                          component={SysField.DateWay}
                                        />
                                      </>
                                  }
                                </Space>
                              </div>
                            </Col>
                            <Col span={5}>
                              <FormItem
                                label="付款比例"
                                name={`paymentDetail.${index}.percentum`}
                                component={SysField.Percentum}
                              />
                            </Col>
                            <Col span={5}>
                              <FormItem
                                itemStyle={{margin: 0}}
                                label="付款金额"
                                name={`paymentDetail.${index}.money`}
                                component={SysField.PayMoney}
                              />
                            </Col>
                            <Col span={span}>
                              <Space align="start">
                                <FormItem
                                  label="款项说明"
                                  rows={1}
                                  name={`paymentDetail.${index}.remark`}
                                  component={SysField.Remark}
                                />
                                <Button
                                  type="link"
                                  style={{float: 'right'}}
                                  disabled={state.value.length === 1}
                                  icon={<DeleteOutlined />}
                                  onClick={() => {
                                    onRemove(index);
                                  }}
                                  danger
                                />
                              </Space>
                            </Col>
                          </Row>;
                        })}
                        <Button
                          type="dashed"
                          style={{marginTop: 8, marginBottom: 16, marginLeft: labelWidth}}
                          icon={<PlusOutlined />}
                          onClick={onAdd}>添加付款批次</Button>
                      </div>
                    );
                  }}
                </FieldList>;
              case 'paymentRemark':
                formItemProps = {
                  component: SysField.Remark,
                };
                break;
              case 'deliveryWay':
                formItemProps = {
                  component: SysField.DeliveryWay,
                };
                break;
              case 'adressId':
                formItemProps = {
                  adressType: 'goods',
                  component: CustomerSysField.Adress,
                };
                break;
              case 'userId':
                formItemProps = {
                  component: CustomerSysField.Contacts,
                };
                break;
              case 'leadTime':
                formItemProps = {
                  component: SysField.LeadTime,
                };
                break;
              case 'deliveryDate':
                formItemProps = {
                  component: SysField.Time,
                };
                break;
              case 'generateContract':
                formItemProps = {
                  component: SysField.GenerateContract,
                };
                break;
              case 'fileId':
                formItemProps = {
                  visible: false,
                  component: SysField.Upload,
                };
                break;
              case 'templateId':
                formItemProps = {
                  visible: false,
                  component: SysField.TemplateId,
                };
                break;
              case 'contractCoding':
                formItemProps = {
                  visible: false,
                  module: 12,
                  component: SysField.Codings,
                };
                break;
              case 'labelResults':
                formItemProps = {
                  label: '',
                  visible: false,
                  component: SysField.AllField,
                };
                break;
              case 'note':
                formItemProps = {
                  laebl: '',
                  wrapperCol: 24,
                  component: SysField.Note,
                };
                break;
              default:
                return <></>;
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

      <Drawer
        destroyOnClose
        push={false}
        title={module().addCustomer}
        supply={1}
        placement="bottom"
        extra={<Button onClick={() => {
          setVisible(false);
        }}>关闭</Button>}
        height="100%"
        open={visible}
        onClose={() => {
          setVisible(false);
        }}
      >
        <CustomerEdit supply={module().supply} add onClose={() => {
          setVisible(false);
        }} />
      </Drawer>

      <Modal
        headTitle="添加付款计划模板"
        width={800}
        {...props}
        component={PaymentTemplateList}
        ref={ref}
        onClose={() => {
          ref.current.close();
          refresh();
        }}
      />

      <AntModal centered maskClosable={false} open={resultVisible} closable={false} footer={null}>
        {
          loading
            ?
            <Spin spinning={loading}>
              <Alert
                message="提交中..."
                description="正在创建订单，请稍后..."
                type="info"
              />
            </Spin>
            :
            <Result
              status={success ? 'success' : 'error'}
              title={success ? '创建订单成功！' : '创建订单失败！'}
              extra={[
                !success && <Button key="buy" onClick={() => {
                  setResultVisible(false);
                }}>
                  取消
                </Button>,
                <Button type="primary" key="console" onClick={() => {
                  history.goBack();
                }}>
                  返回订单列表
                </Button>,
                success && <Button key="buy" onClick={() => {
                  history.push(`/purchase/order/detail?id=${success.orderId}`);
                }}>
                  查看详情
                </Button>
              ]}
            />
        }
      </AntModal>

      {!previewData && <BottomButton>
        <Space>
          <Button type="primary" onClick={() => {
            FormLayoutSubmit({currentStep, setCurrentStep, formRef});
          }}>{currentStep.step < isArray(currentStep.steps).length - 1 ? '下一步' : '保存'}</Button>
          <Button onClick={() => {
            history.goBack();
          }}>取消</Button>
          <Draft
            disabled={!draftName}
            name={draftName}
            type={params.module}
            getValues={async () => {
              return await formRef.current.getFormState();
            }}
            onChange={(value) => {
              formRef.current.setFormState(value);
            }}
          />
        </Space>
      </BottomButton>}
    </Spin>
  </div>;
};

export default CreateOrder;
