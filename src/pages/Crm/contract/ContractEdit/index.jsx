/**
 * 合同模板编辑页
 *
 * @author
 * @Date 2021-07-21 08:22:02
 */

import React, {useImperativeHandle, useRef, useState} from 'react';
import {
  Button,
  Card,
  Col,
  message,
  Row,
} from 'antd';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {createFormActions, FormEffectHooks, FormPath, InternalFieldList as FieldList} from '@formily/antd';
import ProCard from '@ant-design/pro-card';
import ProSkeleton from '@ant-design/pro-skeleton';
import Form from '@/components/Form';
import * as SysField from '@/pages/Crm/contract/ContractField';
import {contractAdd, contractDetail, contractEdit} from '@/pages/Crm/contract/ContractUrl';
import {request, useRequest} from '@/util/Request';
import CustomerAll from '@/pages/Crm/contract/components/CustomerAll';
import {businessEdit} from '@/pages/Crm/business/BusinessUrl';
import {templateDetail} from '@/pages/Crm/template/TemplateUrl';
import {customerDetail, customerEnterprise} from '@/pages/Crm/customer/CustomerUrl';
import ContractContent from '@/pages/Crm/contract/components/ContractContent';


const {FormItem} = Form;

const ApiConfig = {
  view: contractDetail,
  add: contractAdd,
  save: contractEdit
};

const formActionsPublic = createFormActions();

const AddContractEdit = ({
  defaultValue = {},
  submitValue,
  businessId,
  partyA,
  partyB,
  enterpriseA,
  enterpriseB,
  supplyA,
  supplyB,
  value,
  onSuccess,
  response = () => {
  }
}, ref) => {

  const formRef = useRef();

  const {loading, data} = useRequest(customerEnterprise);

  const contentRef = useRef(null);

  const [success, setSuccess] = useState(value);

  const [supplySkus, setSupplySkus] = useState([]);

  useImperativeHandle(ref, () => ({
    submit: success ?
      contentRef.current && contentRef.current.submit
      :
      formRef.current && formRef.current.submit,
  }));

  const {run: business} = useRequest({
    ...businessEdit,
  }, {manual: true});


  if (loading) {
    return <ProSkeleton type="descriptions" />;
  }


  if (success) {
    return <ContractContent
      ref={contentRef}
      value={success}
      onSuccess={() => {
        onSuccess();
      }}
    />;
  }

  const getSupplySku = async (value) => {
    const res = await request({
      url: '/supply/getSupplyByCustomer',
      method: 'GET',
      params: {
        id: value,
      }
    }, {
      manual: true,
    });
    setSupplySkus(res);
    if (res.length === 0) {
      return message.warn('供应商没有绑定物料！');
    }
  };

  return (
    <div style={{padding: 16}}>
      <Form
        noButton
        formActions={formActionsPublic}
        defaultValue={defaultValue}
        value={value}
        ref={formRef}
        api={ApiConfig}
        fieldKey="contractId"
        onError={() => {
        }}
        onSuccess={async (result) => {
          if (result.data !== '') {
            if (businessId) {
              if (result.data.contractId) {
                await business({
                  data: {
                    businessId,
                    contractId: result.data.contractId
                  }
                });
              }
            }
          }
          response(result.data);
          setSuccess(result.data);
        }}
        onSubmit={(value) => {
          let percent = 0;
          value.details.map((item) => {
            return percent += item.percent;
          });
          if (percent !== 100) {
            message.warn('请检查付款信息!');
            return false;
          }

          const data = {
            ...value,
            ...submitValue,
            payment: {details: value.details},
            contractDetailList: value.contractDetailList.map((item) => {
              return {
                ...item,
                customerId: supplyA ? value.partyA : value.partyB
              };
            }),
          };
          return data;
        }}
        effects={() => {

          const {setFieldState, getFieldState} = createFormActions();

          // 甲方发生变化
          FormEffectHooks.onFieldValueChange$('partyA').subscribe(async ({value}) => {
            if (value) {
              const res = await request({...customerDetail, data: {customerId: value}});
              setFieldState('partyAContactsId', (state) => {
                state.props.customerId = value;
                state.value = res.defaultContacts || null;
              });
              setFieldState('partyAAdressId', (state) => {
                state.props.customerId = value;
                state.value = res.defaultAddress || null;
              });
              setFieldState('partyAPhone', (state) => {
                state.props.customerId = value;
              });

              if (supplyA) {
                await getSupplySku(value);
                setFieldState('contractDetailList', (state) => {
                  state.value = [{}];
                });
              }
            }
          });
          // 乙方发生变化
          FormEffectHooks.onFieldValueChange$('partyB').subscribe(async ({value}) => {
            if (value) {
              const res = await request({...customerDetail, data: {customerId: value}});
              setFieldState('partyBContactsId', (state) => {
                state.props.customerId = value;
                state.value = res.defaultContacts || null;
              });
              setFieldState('partyBAdressId', (state) => {
                state.props.customerId = value;
                state.value = res.defaultAddress || null;
              });

              if (supplyB) {
                await getSupplySku(value);
                setFieldState('contractDetailList', (state) => {
                  if (!defaultValue.contractDetailList) {
                    state.value = [{}];
                  }

                });
              }
            }
          });
          // 甲方联系人发生变化
          FormEffectHooks.onFieldValueChange$('partyAContactsId').subscribe(async ({value}) => {
            setFieldState('partyAPhone', (state) => {
              state.props.contactsId = value;
            });
          });
          // 乙方联系人发生变化
          FormEffectHooks.onFieldValueChange$('partyBContactsId').subscribe(async ({value}) => {
            setFieldState('partyBPhone', (state) => {
              state.props.contactsId = value;
              if (!value) {
                state.value = null;
              }
            });
          });
          // 模板发生变化
          FormEffectHooks.onFieldValueChange$('templateId').subscribe(async ({value}) => {
            if (value) {
              const data = await request({...templateDetail, data: {templateId: value}});
              setFieldState('contractClassId', (state) => {
                state.value = data.contractClassId;
              });
            }
          });
          // 输入百分比计算金额
          FormEffectHooks.onFieldValueChange$('details.*.percent').subscribe(({active, name, value}) => {
            const allMoney = getFieldState('allMoney');
            if (allMoney.value) {
              let percents = 0;
              const details = getFieldState('details');
              details.value.map((items) => {
                if (items) {
                  return percents += items.percent;
                }
                return true;
              });
              setFieldState(
                FormPath.transform(name, /\d/, ($1) => {
                  return `details.${$1}.money`;
                }),
                state => {
                  if (percents > 100) {
                    message.warning('不能超过百分之百！');
                    state.value = null;
                  } else
                    state.value = allMoney.value * (value / 100);
                }
              );
            } else if (active) {
              message.warning('请先输入总金额！');
            }
          });
          // 计算物料总金额
          FormEffectHooks.onFieldValueChange$('contractDetailList').subscribe(({value}) => {
            if (value) {
              setFieldState(
                FormPath.transform(name, /\d/, ($1) => {
                  return 'allMoney';
                }),
                state => {
                  let money = 0;
                  value.map((item) => {
                    if (item) {
                      money += item.quantity * item.salePrice;
                    }
                    return item;
                  });
                  state.value = money;
                }
              );
            }

          });
          // 总金额改变清空付款信息
          FormEffectHooks.onFieldValueChange$('allMoney').subscribe(({value}) => {
            setFieldState(
              FormPath.transform(name, /\d/, ($1) => {
                return 'details';
              }),
              state => {
                state.value = [{}];
              }
            );
          });
          // 输入金额计算百分比
          FormEffectHooks.onFieldValueChange$('details.*.money').subscribe(({active, name, value}) => {
            const allMoney = getFieldState('allMoney');
            if (allMoney.value) {
              let moneys = 0;
              const details = getFieldState('details');
              if (details.value) {
                details.value.map((items) => {
                  if (items) {
                    return moneys += items.money;
                  }
                  return true;
                });
              }
              setFieldState(
                FormPath.transform(name, /\d/, ($1) => {
                  return `details.${$1}.percent`;
                }),
                state => {
                  if (moneys > allMoney.value) {
                    message.warning('不能超过总金额！');
                    state.value = null;
                  } else {
                    state.value = (value / allMoney.value) * 100;
                  }
                }
              );
            } else if (active) {
              message.warning('请先输入总金额！');
            }
          });
          // 物料发生变化
          FormEffectHooks.onFieldValueChange$('contractDetailList.*.skuId').subscribe(({name, value}) => {

            setFieldState(
              FormPath.transform(name, /\d/, ($1) => {
                return `contractDetailList.${$1}.brandId`;
              }),
              state => {
                state.props.skuId = value;
              }
            );
          });
        }}
      >
        <ProCard headerBordered className="h2Card" title="基础信息">
          <FormItem labelCol={5} label="合同模板" name="templateId" component={SysField.Template} required />
          <FormItem labelCol={5} label="合同名称" name="name" component={SysField.Name} required />
          <FormItem labelCol={5} label="合同分类" name="contractClassId" component={SysField.ContractClassId} required />
        </ProCard>
        <Row gutter={24}>
          <Col span={12}>
            <ProCard headerBordered className="h2Card" title="甲方信息">
              <CustomerAll
                supply={supplyA}
                customer="partyA"
                contacts="partyAContactsId"
                adress="partyAAdressId"
                phone="partyAPhone"
                customerId={(enterpriseA && data.customerId) || partyA}
              />
            </ProCard>
          </Col>
          <Col span={12}>
            <ProCard className="h2Card" headerBordered title="乙方信息">
              <CustomerAll
                supply={supplyB}
                customer="partyB"
                adress="partyBAdressId"
                contacts="partyBContactsId"
                phone="partyBPhone"
                customerId={(enterpriseB && data.customerId) || partyB}
              />
            </ProCard>
          </Col>
        </Row>
        <ProCard headerBordered className="h2Card" title="物料信息">
          <FieldList
            name="contractDetailList"
            initialValue={[
              {},
            ]}
          >
            {({state, mutators}) => {
              const onAdd = () => mutators.push();
              return (
                <div>
                  {state.value.map((item, index) => {
                    const onRemove = index => mutators.remove(index);
                    return (
                      <Card
                        style={{marginTop: 8}}
                        headStyle={{border: 'none', borderBottom: 'solid 1px #eee'}}
                        bodyStyle={{padding: 8}}
                        key={index}>
                        <div style={{width: '5%', display: 'inline-block'}}>{`第${index + 1}批`}</div>
                        <div style={{width: '30%', display: 'inline-block'}}>
                          <FormItem
                            labelCol={6}
                            itemStyle={{margin: 0}}
                            label="物料"
                            name={`contractDetailList.${index}.skuId`}
                            ids={supplySkus.map((item) => {
                              return item.skuId;
                            })}
                            component={SysField.SkuId}
                            required
                          />
                        </div>
                        <div style={{width: '23%', display: 'inline-block'}}>
                          <FormItem
                            labelCol={6}
                            itemStyle={{margin: 0}}
                            label="品牌"
                            supplySkus={supplySkus}
                            name={`contractDetailList.${index}.brandId`}
                            component={SysField.BrandId}
                          />
                        </div>
                        <div style={{width: '17%', display: 'inline-block'}}>
                          <FormItem
                            labelCol={8}
                            itemStyle={{margin: 0}}
                            label="数量"
                            name={`contractDetailList.${index}.quantity`}
                            component={SysField.Quantity}
                            required
                          />
                        </div>
                        <div style={{width: '20%', display: 'inline-block'}}>
                          <FormItem
                            labelCol={8}
                            itemStyle={{margin: 0}}
                            label="单价"
                            name={`contractDetailList.${index}.salePrice`}
                            component={SysField.SalePrice}
                            required
                          />
                        </div>
                        {!defaultValue.contractDetailList && <Button
                          type="link"
                          style={{float: 'right'}}
                          disabled={state.value.length === 1}
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            onRemove(index);
                          }}
                          danger
                        />}
                      </Card>
                    );
                  })}
                  {!defaultValue.contractDetailList && <Button
                    type="dashed"
                    style={{marginTop: 8}}
                    icon={<PlusOutlined />}
                    onClick={onAdd}>增加物料</Button>}
                </div>
              );
            }}
          </FieldList>
        </ProCard>
        <ProCard headerBordered className="h2Card" title="付款信息">
          <FormItem
            labelCol={3}
            label="付款总金额"
            name="allMoney"
            component={SysField.AllMoney}
            placeholder="总金额"
            required />
          <FieldList
            name="details"
            initialValue={[
              {},
            ]}
          >
            {({state, mutators}) => {
              const onAdd = () => mutators.push();
              return (
                <div>
                  {state.value.map((item, index) => {
                    const onRemove = index => mutators.remove(index);
                    return (
                      <Card
                        style={{marginTop: 8}}
                        headStyle={{border: 'none', borderBottom: 'solid 1px #eee'}}
                        bodyStyle={{padding: 8}}
                        key={index}>
                        <div style={{width: '5%', display: 'inline-block'}}>{`第${index + 1}批`}</div>
                        <div style={{width: '22%', display: 'inline-block'}}>
                          <FormItem
                            labelCol={6}
                            itemStyle={{margin: 0}}
                            label="名称"
                            name={`details.${index}.name`}
                            component={SysField.MoneyName}
                            required
                          />
                        </div>
                        <div style={{width: '18%', display: 'inline-block'}}>
                          <FormItem
                            labelCol={8}
                            itemStyle={{margin: 0}}
                            label="金额"
                            name={`details.${index}.money`}
                            component={SysField.Money}
                            required
                          />
                        </div>
                        <div style={{width: '23%', display: 'inline-block'}}>
                          <FormItem
                            labelCol={8}
                            itemStyle={{margin: 0}}
                            label="百分比"
                            name={`details.${index}.percent`}
                            component={SysField.Percent}
                            required
                          />
                        </div>
                        <div style={{width: '25%', display: 'inline-block'}}>
                          <FormItem
                            labelCol={7}
                            itemStyle={{margin: 0}}
                            label="付款时间"
                            name={`details.${index}.time`}
                            component={SysField.Time}
                          />
                        </div>
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
                      </Card>
                    );
                  })}
                  <Button
                    type="dashed"
                    style={{marginTop: 8}}
                    icon={<PlusOutlined />}
                    onClick={onAdd}>增加付款信息</Button>
                </div>
              );
            }}
          </FieldList>
        </ProCard>
      </Form>


    </div>
  );

};

export default React.forwardRef(AddContractEdit);
