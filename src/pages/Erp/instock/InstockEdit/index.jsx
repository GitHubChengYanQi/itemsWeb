/**
 * 入库表编辑页
 *
 * @author song
 * @Date 2021-07-17 10:46:08
 */

import React, {useImperativeHandle, useRef} from 'react';
import {FormEffectHooks, FormPath, InternalFieldList as FieldList} from '@formily/antd';
import {Avatar, Button, Card, Space} from 'antd';
import ProCard from '@ant-design/pro-card';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import Form from '@/components/Form';
import {instockDetail, instockEdit, instockOrderAdd} from '../InstockUrl';
import * as SysField from '../InstockField';
import {request} from '@/util/Request';
import {skuDetail} from '@/pages/Erp/sku/skuUrl';

const {FormItem} = Form;

const ApiConfig = {
  view: instockDetail,
  add: instockOrderAdd,
  save: instockEdit
};

const InstockEdit = ({
  onSuccess = () => {
  },
  loading = () => {
  },
  onError = () => {
  },
  value,
}, ref) => {

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    submit: formRef.current.submit,
  }));

  return (
    <div style={{padding: 16}}>
      <Form
        value={value || false}
        noButton
        ref={formRef}
        api={ApiConfig}
        loading={loading}
        fieldKey="instockId"
        onSuccess={() => {
          onSuccess();
        }}
        onError={() => {
          onError();
        }}
        effects={({setFieldState, getFieldState}) => {

          FormEffectHooks.onFieldValueChange$('instockRequest.*.number').subscribe(({name}) => {
            setFieldState(
              FormPath.transform(name, /\d/, ($1) => {
                return `instockRequest.${$1}.costPrice`;
              }),
              state => {
                state.value = null;
              }
            );

            setFieldState(
              FormPath.transform(name, /\d/, ($1) => {
                return `instockRequest.${$1}.sellingPrice`;
              }),
              state => {
                state.value = null;
              }
            );

          });

          FormEffectHooks.onFieldValueChange$('instockRequest.*.costPrice').subscribe(({name, value}) => {
            const number = getFieldState(
              FormPath.transform(name, /\d/, ($1) => {
                return `instockRequest.${$1}.number`;
              }),);

            setFieldState(
              FormPath.transform(name, /\d/, ($1) => {
                return `instockRequest.${$1}.sellingPrice`;
              }),
              state => {
                state.value = value / number.value;
              }
            );

          });

          FormEffectHooks.onFieldValueChange$('instockRequest.*.sellingPrice').subscribe(({name, value}) => {
            const number = getFieldState(
              FormPath.transform(name, /\d/, ($1) => {
                return `instockRequest.${$1}.number`;
              }),);

            setFieldState(
              FormPath.transform(name, /\d/, ($1) => {
                return `instockRequest.${$1}.costPrice`;
              }),
              state => {
                state.value = value * number.value;
              }
            );
          });

          FormEffectHooks.onFieldValueChange$('instockRequest.*.skuId').subscribe(async ({name, value}) => {
            if (value) {

              const sku = await request({...skuDetail, data: {skuId: value}});

              setFieldState(
                FormPath.transform(name, /\d/, ($1) => {
                  return `instockRequest.${$1}.unitId`;
                }),
                state => {
                  state.value = sku && sku.unit && sku.unit.unitId;
                }
              );
            }
          });
        }}
      >

        <ProCard title="入库信息" className="h2Card" headerBordered>
          <div style={{display: 'inline-block', width: '30%'}}>
            <FormItem label="编码" name="coding" module={1} component={SysField.Codings} required />
          </div>
          <div style={{display: 'inline-block', width: '30%'}}>
            <FormItem label="仓库名称" name="storeHouseId" component={SysField.StoreHouseSelect} required />
          </div>
          <div style={{display: 'inline-block', width: '30%'}}>
            <FormItem label="负责人" name="userId" component={SysField.UserId} required />
          </div>

        </ProCard>
        <ProCard title="物料列表" className="h2Card" headerBordered>
          <FieldList
            name="instockRequest"
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
                        <Avatar size={24}>{`${index + 1}`}</Avatar>
                        <div style={{width: '21%', display: 'inline-block'}}>
                          <FormItem
                            labelCol={7}
                            itemStyle={{margin: 0}}
                            label="物料"
                            name={`instockRequest.${index}.skuId`}
                            component={SysField.SkuId}
                            required
                          />
                        </div>
                        <div style={{width: '27%', display: 'inline-block'}}>
                          <FormItem
                            labelCol={10}
                            itemStyle={{margin: 0}}
                            label="品牌"
                            name={`instockRequest.${index}.brandId`}
                            component={SysField.BrandId}
                            required
                          />
                        </div>
                        <div style={{width: '18%', display: 'inline-block'}}>
                          <Space>
                            <FormItem
                              labelCol={8}
                              itemStyle={{margin: 0}}
                              label="数量"
                              name={`instockRequest.${index}.number`}
                              component={SysField.Number}
                              required
                            />
                            <FormItem
                              labelCol={8}
                              itemStyle={{margin: 0}}
                              name={`instockRequest.${index}.unitId`}
                              component={SysField.Unit}
                            />
                          </Space>
                        </div>
                        <div style={{width: '12%', display: 'inline-block'}}>
                          <FormItem
                            labelCol={7}
                            itemStyle={{margin: 0}}
                            label="总价"
                            name={`instockRequest.${index}.costPrice`}
                            component={SysField.CostPrice}
                          />
                        </div>
                        <div style={{width: '12%', display: 'inline-block'}}>
                          <FormItem
                            labelAlign="left"
                            itemStyle={{margin: 0}}
                            labelCol={7}
                            label="单价"
                            name={`instockRequest.${index}.sellingPrice`}
                            component={SysField.SellingPrice}
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
                    onClick={onAdd}>增加产品</Button>
                </div>
              );
            }}
          </FieldList>
        </ProCard>
      </Form>
    </div>
  );
};

export default React.forwardRef(InstockEdit);
