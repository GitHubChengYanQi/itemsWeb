import React, {useEffect, useRef, useState} from 'react';
import ProCard from '@ant-design/pro-card';
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
  Modal as AntModal, Alert, Select
} from 'antd';
import {FormEffectHooks, InternalFieldList as FieldList} from '@formily/antd';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {getSearchParams, useHistory} from 'ice';
import Breadcrumb from '@/components/Breadcrumb';
import Form from '@/components/Form';
import * as SysField from './components/Field';
import * as CustomerSysField from './components/CustomerAll';
import Overflow from '@/components/Overflow';
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

const {FormItem} = Form;

const ApiConfig = {
  view: {},
  add: {
    url: '/order/add',
    method: 'POST'
  },
  save: {}
};

const span = 6;
const labelWidth = 128;

const CreateOrder = ({...props}) => {

  const params = getSearchParams();

  const formRef = useRef();

  const skus = params.skus && Array.isArray(JSON.parse(params.skus)) && JSON.parse(params.skus);

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
          success: '创建销售单成功!',
          error: '创建销售单失败!',
          coding: '销售单编号',
          dateTitle: '销售日期',
          noteTitle: '销售单备注',
          moneyTitle: '销售总价',
          detailTitle: '销售明细',
          goodTitle: '交货信息',
          addCustomer: '创建客户',
          supply: 0,
        };
      case 'PO':
        return {
          type: 1,
          title: '创建采购单',
          error: '创建采购单失败!',
          success: '创建采购单成功!',
          coding: '采购单编号',
          dateTitle: '采购日期',
          noteTitle: '采购单备注',
          moneyTitle: '采购总价',
          detailTitle: '采购明细',
          goodTitle: '收货信息',
          addCustomer: '创建供应商',
          supply: 1
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

  const [resultVisible, setResultVisible] = useState();

  const [loading, setLoading] = useState();

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
    <div style={{padding: '16px 0'}}>
      <Breadcrumb title={module().title} />
    </div>

    <Form
      className={style.form}
      value={false}
      ref={formRef}
      NoButton={false}
      api={ApiConfig}
      labelAlign="right"
      wrapperCol={24}
      fieldKey="orderId"
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
        } else {
          notification.warn({
            message: '请输入付款批次',
          });
          return false;
        }

        if (value.detailParams) {
          const detailParams = value.detailParams.filter((item) => {
            return item.skuId && item.brandId && item.purchaseNumber && item.onePrice;
          });
          if (detailParams.length !== value.detailParams.length) {
            notification.warn({
              message: '请检查物料清单信息！，品牌、数量、单价为必填信息!',
            });
            return false;
          }
        } else {
          notification.warn({
            message: '请添加物料清单!',
          });
          return false;
        }

        value = {
          ...value,
          type: module().type,
          paymentParam: {
            money: value.money,
            detailParams: value.paymentDetail,
            payMethod: value.payMethod,
            freight: value.freight,
            deliveryWay: value.deliveryWay,
            adressId: value.adressId,
            payPlan: value.payPlan,
            remark: value.remark,
            floatingAmount: value.floatingAmount,
            totalAmount: value.totalAmount,
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
        setResultVisible(true);
        return value;
      }}
      effects={({setFieldState, getFieldState}) => {

        EffectsAction(setFieldState, getFieldState);

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
        setOrder(res.data);
        setLoading(false);
      }}
      onError={() => {
        setLoading(false);
      }}
    >

      <ProCard style={{marginTop: 24}} bodyStyle={{padding: 16}} className="h2Card" title="基本信息" headerBordered>
        <Row gutter={24}>
          <Col span={span}>
            <FormItem
              module={11}
              label={module().coding}
              name="coding"
              component={SysField.Codings}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={span}>
            <FormItem
              label={module().dateTitle}
              name="date"
              component={SysField.Date}
            />
          </Col>
          <Col span={span}>
            <FormItem
              label="币种"
              name="currency"
              component={SysField.Currency}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={span}>
            <FormItem
              label={module().noteTitle}
              name="remark"
              component={SysField.Remark}
            />
          </Col>
        </Row>
      </ProCard>

      <Overflow defaultHeight={300}>
        <Row gutter={24}>
          <Col span={12}>
            <ProCard
              bodyStyle={{padding: 16}}
              className="h2Card"
              title="甲方信息"
              headerBordered
              extra={params.module === 'SO' && <Button onClick={() => {
                setVisible(true);
              }}>新建客户</Button>}
              headStyle={{height: 49}}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem
                    value={params.module === 'PO' ? userInfo.customerId : null}
                    selfEnterprise={params.module === 'PO'}
                    supply={params.module === 'PO' ? null : 0}
                    label="公司名称"
                    placeholder="请选择甲方公司"
                    name="buyerId"
                    component={CustomerSysField.Customer}
                    required
                  />
                </Col>
                <Col span={12}>
                  <FormItem
                    label="公司地址"
                    placeholder="请选择甲方公司地址"
                    name="partyAAdressId"
                    component={CustomerSysField.Adress}
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem
                    label="委托代理"
                    placeholder="请选择甲方公司委托代理"
                    name="partyAContactsId"
                    component={CustomerSysField.Contacts}
                  />
                </Col>
                <Col span={12}>
                  <FormItem
                    label="联系电话"
                    placeholder="请选择甲方公司联系电话"
                    name="partyAPhone"
                    component={CustomerSysField.Phone}
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem
                    label="开户银行"
                    placeholder="请选择甲方开户银行"
                    name="partyABankId"
                    component={CustomerSysField.Bank}
                  />
                </Col>
                <Col span={12}>
                  <FormItem
                    label="开户账号"
                    placeholder="请选择甲方开户账号"
                    name="partyABankAccount"
                    component={CustomerSysField.BankAccount}
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem
                    label="法定代表人"
                    name="partyALegalPerson"
                    component={SysField.Show}
                  />
                </Col>
                <Col span={12}>
                  <FormItem
                    label="开户行号"
                    placeholder="请选择甲方开户行号"
                    name="partyABankNo"
                    component={SysField.Show}
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem
                    label="公司电话"
                    name="partyACompanyPhone"
                    component={SysField.Show}
                  />
                </Col>
                <Col span={12}>
                  <FormItem
                    label="公司传真"
                    name="partyAFax"
                    component={SysField.Show}
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem
                    label="邮政编码"
                    name="partyAZipCode"
                    component={SysField.Show}
                  />
                </Col>
              </Row>
            </ProCard>
          </Col>
          <Col span={12}>
            <ProCard
              bodyStyle={{padding: 16}}
              headStyle={{height: 49}}
              className="h2Card"
              title="乙方信息"
              extra={params.module === 'PO' && <Button onClick={() => {
                setVisible(true);
              }}>新建供应商</Button>}
              headerBordered>
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem
                    value={params.module === 'SO' ? userInfo.customerId : null}
                    selfEnterprise={params.module === 'SO'}
                    supply={params.module === 'SO' ? null : 1}
                    label="公司名称"
                    placeholder="请选择乙方公司"
                    name="sellerId"
                    component={CustomerSysField.Customer}
                    required
                  />
                </Col>
                <Col span={12}>
                  <FormItem
                    label="公司地址"
                    placeholder="请选择乙方公司地址"
                    name="partyBAdressId"
                    component={CustomerSysField.Adress}
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem
                    label="委托代理"
                    placeholder="请选择乙方公司委托代理"
                    name="partyBContactsId"
                    component={CustomerSysField.Contacts}
                  />
                </Col>
                <Col span={12}>
                  <FormItem
                    label="联系电话"
                    placeholder="请选择乙方公司联系电话"
                    name="partyBPhone"
                    component={CustomerSysField.Phone}
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem
                    label="开户银行"
                    placeholder="请选择乙方开户银行"
                    name="partyBBankId"
                    component={CustomerSysField.Bank}
                  />
                </Col>
                <Col span={12}>
                  <FormItem
                    label="开户账号"
                    placeholder="请选择乙方开户账号"
                    name="partyBBankAccount"
                    component={CustomerSysField.BankAccount}
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem
                    label="法定代表人"
                    name="partyBLegalPerson"
                    component={SysField.Show}
                  />
                </Col>
                <Col span={12}>
                  <FormItem
                    label="开户行号"
                    placeholder="请选择甲方开户行号"
                    name="partyBBankNo"
                    component={SysField.Show}
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem
                    label="公司电话"
                    name="partyBCompanyPhone"
                    component={SysField.Show}
                  />
                </Col>
                <Col span={12}>
                  <FormItem
                    label="公司传真"
                    name="partyBFax"
                    component={SysField.Show}
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem
                    label="邮政编码"
                    name="partyBZipCode"
                    component={SysField.Show}
                  />
                </Col>
              </Row>
            </ProCard>
          </Col>
        </Row>
      </Overflow>

      <ProCard bodyStyle={{padding: 16}} className="h2Card" title={module().detailTitle} headerBordered>
        <FormItem
          module={params.module}
          name="detailParams"
          {...props}
          component={SysField.AddSku}
        />
      </ProCard>

      <ProCard bodyStyle={{padding: 16}} className="h2Card" title="财务信息" headerBordered>
        <Row>
          <Col span={span}>
            <FormItem
              label="票据类型"
              placeholder="请选择票据类型"
              name="paperType"
              options={[{label: '普票', value: 0}, {label: '专票', value: 1}]}
              component={Select}
            />
          </Col>
          <Col span={span}>
            <FormItem
              label="税率(%)"
              placeholder="请选择税率"
              name="rate"
              options={taxData || []}
              component={Select}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={span}>
            <FormItem
              label={module().moneyTitle}
              placeholder="请输入总价"
              disabled
              name="money"
              component={SysField.Money}
            />
          </Col>
          <Col span={span}>
            <FormItem
              label="浮动金额"
              placeholder="请输入浮动金额"
              name="floatingAmount"
              component={SysField.Float}
            />
          </Col>
          <Col span={span}>
            <FormItem
              label="总金额"
              placeholder="请输入总金额"
              name="totalAmount"
              component={SysField.Money}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={span}>
            <FormItem
              label="是否含运费"
              name="freight"
              value={1}
              component={SysField.Freight}
            />
          </Col>
          <Col span={span}>
            <FormItem
              label="结算方式"
              name="payMethod"
              component={SysField.PayMethod}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={span}>
            <FormItem
              label="付款计划"
              name="payPlan"
              data={data}
              value={3}
              loading={templateLoading}
              component={SysField.PayPlan}
            />
          </Col>
        </Row>
        <FieldList
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
                          placeholder="请输入款项说明"
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
        </FieldList>
        <Row gutter={24}>
          <Col span={span}>
            <FormItem
              label="财务备注"
              name="paymentRemark"
              placeholder="请输入财务备注"
              component={SysField.Remark}
            />
          </Col>
        </Row>
      </ProCard>

      <ProCard bodyStyle={{padding: 16}} className="h2Card" title={module().goodTitle} headerBordered>
        <Row gutter={24}>
          <Col span={span}>
            <FormItem
              label="交货方式"
              name="deliveryWay"
              component={SysField.DeliveryWay}
            />
          </Col>
          <Col span={span}>
            <FormItem
              label="交货地址"
              name="adressId"
              adressType="goods"
              component={CustomerSysField.Adress}
            />
          </Col>
          <Col span={span}>
            <FormItem
              label="收货人"
              name="userId"
              component={CustomerSysField.Contacts}
            />
          </Col>
          <Col span={span}>
            <FormItem
              label="交货期(天)"
              name="leadTime"
              component={SysField.LeadTime}
            />
          </Col>
        </Row>
        <Row>
          <Col span={span}>
            <FormItem
              label="交货日期"
              name="deliveryDate"
              component={SysField.Time}
            />
          </Col>
        </Row>
      </ProCard>

      <ProCard bodyStyle={{padding: 16}} className="h2Card" title="合同关联信息" headerBordered>
        <Row gutter={24}>
          <Col span={span}>
            <FormItem
              label="是否需要合同"
              required
              name="generateContract"
              component={SysField.GenerateContract}
            />
          </Col>
          <FormItem
            visible={false}
            label="上传合同"
            name="fileId"
            component={SysField.Upload}
            required
          />
          <Col span={span}>
            <FormItem
              visible={false}
              label="合同模板"
              name="templateId"
              component={SysField.TemplateId}
            />
          </Col>
          <Col span={12}>
            <FormItem
              label="合同编码"
              visible={false}
              name="contractCoding"
              module={12}
              component={SysField.Codings}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <FormItem
              visible={false}
              name="labelResults"
              component={SysField.AllField}
            />
          </Col>
        </Row>
      </ProCard>

      <ProCard bodyStyle={{padding: 16}} className="h2Card" title="其他约定项" headerBordered>
        <FormItem
          wrapperCol={24}
          name="note"
          component={SysField.Note}
        />
      </ProCard>
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
            // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
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

    <Affix offsetBottom={0}>
      <div
        style={{height: 47, borderTop: '1px solid #e7e7e7', background: '#fff', textAlign: 'center', paddingTop: 8}}>
        <Space>
          <Button type="primary" onClick={() => {
            formRef.current.submit();
          }}>保存</Button>
          <Button onClick={() => {
            history.push('/purchase/toBuyPlan');
          }}>取消</Button>
          <Draft
            type={params.module}
            getValues={async () => {
              return await formRef.current.getFormState();
            }}
            onChange={(value) => {
              formRef.current.setFormState(value);
            }}
          />
        </Space>
      </div>
    </Affix>
  </div>;
};

export default CreateOrder;
