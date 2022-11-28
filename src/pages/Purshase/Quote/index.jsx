import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Button, Card, Descriptions, Divider, message, notification, Select, Space, Spin} from 'antd';
import {DeleteOutlined, PlusOutlined,} from '@ant-design/icons';
import {
  FormEffectHooks, FormPath,
  InternalFieldList as FieldList
} from '@formily/antd';
import ProSkeleton from '@ant-design/pro-skeleton';
import Form from '@/components/Form';
import * as SysField from '@/pages/Purshase/purchaseQuotation/purchaseQuotationField';
import {request, useRequest} from '@/util/Request';
import {purchaseConfigList} from '@/pages/BaseSystem/dictType/components/purchaseConfig/purchaseConfigUrl';
import {purchaseQuotationAdd} from '@/pages/Purshase/purchaseQuotation/purchaseQuotationUrl';
import {customerDetail} from '@/pages/Crm/customer/CustomerUrl';
import Modal from '@/components/Modal';
import PurchaseConfigList from '@/pages/BaseSystem/dictType/components/purchaseConfig/purchaseConfigList';
import AddCustomerButton from '@/pages/Crm/customer/components/AddCustomerButton';
import {brandIdSelect} from '@/pages/Erp/stock/StockUrl';
import {taxRateListSelect} from '@/pages/Purshase/taxRate/taxRateUrl';


const {FormItem} = Form;

const Quote = ({...props}, ref) => {

  const configRef = useRef();

  const {value: {skuId, skus, source, sourceId, customer, level, supplySku}, onSuccess} = props;

  const ApiConfig = {
    view: purchaseQuotationAdd,
    add: purchaseQuotationAdd,
    save: purchaseQuotationAdd
  };

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    submit: formRef && formRef.current && formRef.current.submit,
  }));

  const [supply, setSupply] = useState(customer || {});

  const [skuIds, setSkuIds] = useState(skus || []);

  const [loading, setLoading] = useState(false);

  const {data: brandData, refresh} = useRequest(brandIdSelect);

  const {data: taxRateData} = useRequest(taxRateListSelect);

  const {data: supplyData, run: getSupply} = useRequest({
    url: 'supply/getSupplyByLevel',
    method: 'POST'
  }, {
    manual: true,
  });

  const getSupplys = (levelId, isSupplySku) => {
    getSupply({
      data: {
        levelId,
        skuIds: isSupplySku ? null : skus.map((item) => {
          return item.skuId;
        }),
      }
    });
  };

  const [config, setConfig] = useState({
    isSupplySku: supplySku ? '是' : '否',
    level
  });

  const isSupplySku = !customer && config.isSupplySku === '否';

  const {loading: configLoading, run: configRun} = useRequest(
    purchaseConfigList,
    {
      manual: true,
      onSuccess: (res) => {

        const supplys = res.filter((value) => {
          return value.type === 'supply';
        });

        const levels = res.filter((value) => {
          return value.type === 'level';
        });

        const isSupply = supplys && supplys.length > 0 && supplys[0].value;
        const configLevel = levels && levels.length > 0 && JSON.parse(levels[0].value);

        if (configLevel) {
          getSupplys(configLevel.value, isSupply === '否');
        } else {
          getSupplys();
        }
        setConfig({
          isSupplySku: isSupply,
          level: configLevel,
        });

      }
    }
  );


  useEffect(() => {
    if (customer) {
      if (supplySku) {
        // 取出供应商有的物料
        const array = skus && skus.filter((items) => {
          const arr = customer.skuResultList && customer.skuResultList.filter((value) => {
            return value.skuId === items.skuId && (items.brandId === 0 || value.brandId === items.brandId);
          });
          return arr && arr.length > 0;
        });

        setLoading(true);
        setSkuIds(array.map((item) => {
          const skus = customer.skuResultList.filter((value) => {
            return value.skuId === item.skuId;
          });
          return {
            ...item,
            brandIds: skus.map((item) => {
              return item.brandId;
            }),
          };
        }));

        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
      if (level){
        getSupplys(level.value);
      }else {
        configRun();
      }

    } else {
      configRun();
    }
  }, []);

  if (configLoading) {
    return <ProSkeleton type="descriptions" />;
  }


  return <>
    <Card
      title={skus
      &&
      <Space direction="vertical">

        {source !== 'inquiryTask' && <Descriptions title="系统配置" extra={<Button onClick={() => {
          configRef.current.open(true);
        }}>修改默认配置</Button>}>
          <Descriptions.Item label="是否是供应商物料">{config && config.isSupplySku}</Descriptions.Item>
          <Descriptions.Item label="供应商等级">{config && config.level && config.level.label}</Descriptions.Item>
        </Descriptions>}

        <Descriptions title="供应商信息" column={5}>
          <Descriptions.Item label="供应商" style={{width: isSupplySku && 500}}>
            <Space>
              <Select
                placeholder="请选择供应商"
                disabled={customer}
                showSearch
                value={supply.customerId}
                style={{minWidth: 200}}
                filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
                options={supplyData && supplyData.map((items) => {
                  return {
                    value: items.customerId,
                    label: items.customerName,
                    object: items
                  };
                }) || []}
                onClear={() => {
                  setSupply({});
                }}
                onSelect={async (value, option) => {

                  if (!value) {
                    setSupply({});
                    return null;
                  }

                  if (!isSupplySku) {
                    // 取出供应商有的物料
                    const array = skus && skus.filter((items) => {
                      const arr = option.object
                        &&
                        option.object.supplyResults
                        &&
                        option.object.supplyResults.filter((value) => {
                          return value.skuId === items.skuId && (items.brandId === 0 || value.brandId === items.brandId);
                        });
                      return arr && arr.length > 0;
                    });

                    setLoading(true);

                    setSkuIds(array.map((item) => {
                      const skus = option.object.supplyResults.filter((value) => {
                        return value.skuId === item.skuId;
                      });
                      return {
                        ...item,
                        brandIds: skus.map((item) => {
                          return item.brandId;
                        }),
                      };
                    }));

                    setTimeout(() => {
                      setLoading(false);
                    }, 100);
                  }

                  const res = await request({
                    ...customerDetail,
                    data: {
                      customerId: value
                    }
                  });
                  setSupply(res);
                }}
              />
              {isSupplySku && <AddCustomerButton
                data={{customerLevelId: config.level && config.level.value}}
                supply={1}
                onChange={(value) => {
                  setSupply(value);
                  getSupplys(config.level.value, isSupplySku);
                }} />}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item
            label="级别">{supply.crmCustomerLevelResult ? supply.crmCustomerLevelResult.level : '无'}</Descriptions.Item>
          <Descriptions.Item label="联系人">{supply.contact ? supply.contact.contactsName : '无'}</Descriptions.Item>
          <Descriptions.Item label="电话">{supply.phone ? supply.phone.phoneNumber : '无'}</Descriptions.Item>
          <Descriptions.Item label="地址">{supply.address ? supply.address.location : '无'}</Descriptions.Item>

        </Descriptions>

      </Space>}>


      {loading ?
        <div style={{padding: 16, textAlign: 'center'}}>
          <Spin />
        </div>
        :
        <Form
          value={false}
          ref={formRef}
          api={ApiConfig}
          noButton
          fieldKey="purchaseAskId"
          onSubmit={(value) => {
            if (skus && !supply.customerId) {
              message.warn('请选择供应商！');
              return false;
            }
            if (value.quotationParams.length === 0) {
              message.warn('报价信息不能为空！');
              return false;
            }
            if (!skuId) {
              const array = value.quotationParams.map((item) => {
                return {
                  ...item,
                  brandId: item.brandId || item.brandResult.brandId,
                  customerId: supply.customerId,
                };
              });
              return {quotationParams: array, source, sourceId, customerId: supply.customerId};
            } else {
              const array = value.quotationParams.map((item) => {
                return {
                  ...item,
                  brandId: item.brandId || item.brandResult.brandId,
                  skuId,
                };
              });
              return {quotationParams: array, source, sourceId,};
            }
          }}
          onSuccess={() => {
            notification.success({
              message: '添加报价成功！',
            });
            onSuccess();
          }}
          onError={() => {
          }}
          effects={({setFieldState, getFieldState}) => {

            FormEffectHooks.onFieldValueChange$('quotationParams.*.brandResult').subscribe(({name, value}) => {

              if (!skuId) {
                const quotationParams = getFieldState('quotationParams');

                setFieldState(FormPath.transform(name, /\d/, ($1) => {
                  return `quotationParams.${$1}.brandId`;
                }), (state) => {
                  state.visible = !value;
                  state.props.brandIds = quotationParams.initialValue[name.split('.')[1]].brandIds;
                });
                setFieldState(FormPath.transform(name, /\d/, ($1) => {
                  return `quotationParams.${$1}.brandResult`;
                }), (state) => {
                  state.visible = value;
                });
              }

            });

            // 数量
            FormEffectHooks.onFieldValueChange$('quotationParams.*.total').subscribe(({name, value: totalValue}) => {

              const {value: priceValue} = getFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.price`;
              })) || {};
              const {value: taxRateValue} = getFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.taxRateId`;
              })) || {};

              // 总价
              setFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.allPrice`;
              }), (state) => {
                state.value = totalValue * (priceValue || 0);
              });

              // 含税单价
              setFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.afterTax`;
              }), (state) => {
                state.value = taxRateValue ? (priceValue - priceValue * (taxRateValue.label / 100)) : 0;
              });

              // 含税总价
              setFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.allAfterTax`;
              }), (state) => {
                state.value = taxRateValue ? (priceValue - priceValue * (taxRateValue.label / 100)) * totalValue : 0;
              });

              // 不含税单价
              setFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.preTax`;
              }), (state) => {
                state.value = priceValue || 0;
              });

              // 不含税总价
              setFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.allPreTax`;
              }), (state) => {
                state.value = totalValue * (priceValue || 0);
              });

              // 税额
              setFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.taxPrice`;
              }), (state) => {
                state.value = taxRateValue ? (priceValue * (taxRateValue.label / 100)) : 0;
              });

            });

            // 单价
            FormEffectHooks.onFieldValueChange$('quotationParams.*.price').subscribe(async ({
              name,
              value: priceValue
            }) => {
              const {value: totalValue} = getFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.total`;
              })) || {};
              const {value: taxRateValue} = getFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.taxRateId`;
              })) || {};

              // 总价
              setFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.allPrice`;
              }), (state) => {
                state.value = totalValue * (priceValue || 0);
              });

              // 含税单价
              setFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.afterTax`;
              }), (state) => {
                state.value = taxRateValue ? (priceValue - priceValue * (taxRateValue.label / 100)) : 0;
              });

              // 含税总价
              setFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.allAfterTax`;
              }), (state) => {
                state.value = taxRateValue ? (priceValue - priceValue * (taxRateValue.label / 100)) * totalValue : 0;
              });

              // 不含税单价
              setFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.preTax`;
              }), (state) => {
                state.value = priceValue || 0;
              });

              // 不含税总价
              setFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.allPreTax`;
              }), (state) => {
                state.value = totalValue * (priceValue || 0);
              });

              // 税额
              setFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.taxPrice`;
              }), (state) => {
                state.value = taxRateValue ? (priceValue * (taxRateValue.label / 100)) : 0;
              });

            });


            // 税率
            FormEffectHooks.onFieldValueChange$('quotationParams.*.taxRateId').subscribe(async ({
              name,
              value: taxRateValue
            }) => {

              const {value: priceValue} = getFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.price`;
              })) || {};
              const {value: totalValue} = getFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.total`;
              })) || {};

              // 总价
              setFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.allPrice`;
              }), (state) => {
                state.value = totalValue * (priceValue || 0);
              });

              // 含税单价
              setFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.afterTax`;
              }), (state) => {
                state.value = taxRateValue ? (priceValue - priceValue * (taxRateValue.label / 100)) : 0;
              });

              // 含税总价
              setFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.allAfterTax`;
              }), (state) => {
                state.value = taxRateValue ? (priceValue - priceValue * (taxRateValue.label / 100)) * totalValue : 0;
              });

              // 不含税单价
              setFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.preTax`;
              }), (state) => {
                state.value = priceValue || 0;
              });

              // 不含税总价
              setFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.allPreTax`;
              }), (state) => {
                state.value = totalValue * (priceValue || 0);
              });

              // 税额
              setFieldState(FormPath.transform(name, /\d/, ($1) => {
                return `quotationParams.${$1}.taxPrice`;
              }), (state) => {
                state.value = taxRateValue ? (priceValue * (taxRateValue.label / 100)) : 0;
              });


            });
          }}
        >
          <Space style={{backgroundColor: '#E6E6E6', padding: 16}}>
            <div style={{width: 50, textAlign: 'center'}} />
            <div style={{width: skus ? 200 : 328, textAlign: 'center'}}>
              {skus ? '物料' : '供应商'}
            </div>
            <div style={{width: 200, textAlign: 'center'}}>
              品牌
            </div>
            <div style={{width: 90, textAlign: 'center'}}>
              采购数量
            </div>
            <div style={{width: 90, textAlign: 'center'}}>
              单价
            </div>
            <div style={{width: 90, textAlign: 'center'}}>
              总价
            </div>
            <div style={{width: 120, textAlign: 'center'}}>
              票据类型
            </div>
            <div style={{width: 120, textAlign: 'center'}}>
              税率
            </div>
            <div style={{width: 90, textAlign: 'center'}}>
              含税单价
            </div>
            <div style={{width: 90, textAlign: 'center'}}>
              含税总价
            </div>
            <div style={{width: 90, textAlign: 'center'}}>
              不含税单价
            </div>
            <div style={{width: 90, textAlign: 'center'}}>
              不含税总价
            </div>
            <div style={{width: 90, textAlign: 'center'}}>
              税额
            </div>
            <div style={{width: 120, textAlign: 'center'}}>
              付款方式
            </div>
            <div style={{width: 120, textAlign: 'center'}}>
              交货时间
            </div>
            <div style={{width: 120, textAlign: 'center'}}>
              价格有效期
            </div>
            <div style={{width: 50, textAlign: 'center'}}>
              含运
            </div>
            <div style={{width: 50, textAlign: 'center'}} />
          </Space>
          <FieldList
            name="quotationParams"
            initialValue={
              skus ? skuIds.map((item) => {
                return {
                  skuId: item.skuId,
                  skuResult: item.skuResult,
                  total: item.number,
                  brandId: item.brandId || null,
                  brandResult: item.brandResult,
                  brandIds: item.brandIds,
                };
              }) : [{}]
            }
          >
            {({state, mutators}) => {
              const onAdd = () => {
                mutators.push();
              };
              return (
                <div>
                  {state.value.map((item, index) => {
                    const onRemove = index => {
                      mutators.remove(index);
                    };
                    return (
                      <div key={index}>
                        <Space style={{padding: 16}}>

                          <div style={{width: 50, textAlign: 'center'}}>
                            <Button
                              type="link"
                              onClick={() => {
                                if (skus) {
                                  if (formRef.current.getFieldValue('quotationParams')[index] && formRef.current.getFieldValue('quotationParams')[index].skuId) {
                                    mutators.insert(index + 1, {...formRef.current.getFieldValue('quotationParams')[index]});
                                  } else {
                                    message.warn('请选择物料！');
                                  }
                                } else if (formRef.current.getFieldValue('quotationParams')[index] && formRef.current.getFieldValue('quotationParams')[index].customerId) {
                                  mutators.insert(index + 1, {...formRef.current.getFieldValue('quotationParams')[index]});
                                } else {
                                  message.warn('请选择供应商！');
                                }
                              }}
                              icon={<PlusOutlined />}
                            />
                          </div>

                          {skus ?
                            <div style={{width: 200}}>
                              <FormItem
                                itemStyle={{margin: 0}}
                                placeholder="请选择物料"
                                name={`quotationParams.${index}.skuResult`}
                                component={SysField.SkuId}
                                ids={skuIds}
                              />
                            </div>
                            :
                            <FormItem
                              itemStyle={{margin: 0}}
                              placeholder="请选择供应商"
                              width={200}
                              supply={1}
                              name={`quotationParams.${index}.customerId`}
                              component={SysField.SupplyId}
                              rules={[{
                                required: true,
                                message: '必填！',
                              }]}
                            />
                          }

                          <FormItem
                            itemStyle={{margin: 0}}
                            placeholder="请选择品牌"
                            isSupplySku={isSupplySku}
                            data={brandData}
                            refresh={() => {
                              refresh();
                            }}
                            name={`quotationParams.${index}.brandId`}
                            component={SysField.BrandSelect}
                            rules={[{
                              required: true,
                              message: '必填！',
                            }]}
                          />

                          <FormItem
                            visible={!skuId}
                            itemStyle={{margin: 0}}
                            isSupplySku={isSupplySku}
                            name={`quotationParams.${index}.brandResult`}
                            component={SysField.BrandResult}
                          />

                          <FormItem
                            itemStyle={{margin: 0}}
                            placeholder="请输入采购数量"
                            name={`quotationParams.${index}.total`}
                            component={SysField.Total}
                            rules={[{
                              required: true,
                              message: '必填！',
                            }]}
                          />

                          <FormItem
                            itemStyle={{margin: 0}}
                            placeholder="请输入单价"
                            name={`quotationParams.${index}.price`}
                            component={SysField.Price}
                            rules={[{
                              required: true,
                              message: '必填！',
                            }]}
                          />

                          <FormItem
                            itemStyle={{margin: 0}}
                            placeholder="请输入总价"
                            name={`quotationParams.${index}.allPrice`}
                            component={SysField.Money}
                          />

                          <FormItem
                            itemStyle={{margin: 0}}
                            placeholder="请选择票据类型"
                            name={`quotationParams.${index}.InvoiceType`}
                            component={SysField.InvoiceType}
                          />

                          <FormItem
                            itemStyle={{margin: 0}}
                            placeholder="请输入税率"
                            data={taxRateData}
                            name={`quotationParams.${index}.taxRateId`}
                            component={SysField.TaxRateId}
                          />

                          <FormItem
                            itemStyle={{margin: 0}}
                            placeholder="请输入含税单价"
                            name={`quotationParams.${index}.afterTax`}
                            component={SysField.Money}
                          />

                          <FormItem
                            itemStyle={{margin: 0}}
                            placeholder="请输入含税总价"
                            name={`quotationParams.${index}.allAfterTax`}
                            component={SysField.Money}
                          />

                          <FormItem
                            itemStyle={{margin: 0}}
                            placeholder="请输入不含税单价"
                            name={`quotationParams.${index}.preTax`}
                            component={SysField.Money}
                          />

                          <FormItem
                            itemStyle={{margin: 0}}
                            placeholder="请输入不含税总价"
                            name={`quotationParams.${index}.allPreTax`}
                            component={SysField.Money}
                          />

                          <FormItem
                            itemStyle={{margin: 0}}
                            placeholder="请选择税额"
                            name={`quotationParams.${index}.taxPrice`}
                            component={SysField.Money}
                          />

                          <FormItem
                            itemStyle={{margin: 0}}
                            placeholder="请选择付款方式"
                            name={`quotationParams.${index}.paymentMethod`}
                            component={SysField.PaymentMethod}
                          />

                          <FormItem
                            itemStyle={{margin: 0}}
                            placeholder="请选择交货时间"
                            name={`quotationParams.${index}.deliveryDate`}
                            component={SysField.DeliveryDate}
                          />

                          <FormItem
                            itemStyle={{margin: 0}}
                            placeholder="请输入价格有效期"
                            name={`quotationParams.${index}.periodOfValidity`}
                            component={SysField.PeriodOfValidity}
                          />
                          <div style={{width: 50, textAlign: 'center'}}>
                            <FormItem
                              itemStyle={{margin: 0}}
                              value={1}
                              placeholder="请选择是否含运"
                              name={`quotationParams.${index}.isFreight`}
                              component={SysField.IsFreight}
                            />
                          </div>
                          <div style={{width: 50, textAlign: 'center'}}>
                            <Button
                              type="link"
                              disabled={state.value.length === 1}
                              icon={<DeleteOutlined />}
                              onClick={() => {
                                onRemove(index);
                              }}
                              danger
                            />
                          </div>
                        </Space>
                      </div>
                    );
                  })}

                  <Divider orientation="center">
                    {skuId && <Button
                      type="dashed"
                      style={{marginTop: 8}}
                      icon={<PlusOutlined />}
                      onClick={() => {
                        onAdd();
                      }}>增加</Button>}
                  </Divider>
                </div>
              );
            }}
          </FieldList>
        </Form>}

      <Modal
        width={800}
        headTitle="采购配置"
        component={PurchaseConfigList}
        ref={configRef}
        onClose={() => {
          setSkuIds([]);
          setSupply({});
          configRun();
        }}
      />

    </Card>
  </>;
};

export default React.forwardRef(Quote);
