/**
 * 质检任务编辑页
 *
 * @author
 * @Date 2021-11-16 09:54:41
 */

import React, {useImperativeHandle, useRef} from 'react';
import {Avatar, Button, Card, Input} from 'antd';
import Form from '@/components/Form';
import {qualityTaskDetail, qualityTaskAdd, qualityTaskEdit} from '../qualityTaskUrl';
import * as SysField from '../qualityTaskField';
import {request, useRequest} from '@/util/Request';
import {codingRulesList} from '@/pages/Erp/tool/toolUrl';
import ProSkeleton from '@ant-design/pro-skeleton';
import ProCard from '@ant-design/pro-card';
import {FormEffectHooks, FormPath, InternalFieldList as FieldList} from '@formily/antd';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {skuDetail} from '@/pages/Erp/sku/skuUrl';
import {useSetState} from 'ahooks';

const {FormItem} = Form;

const ApiConfig = {
  view: qualityTaskDetail,
  add: qualityTaskAdd,
  save: qualityTaskEdit
};


const QualityTaskEdit = ({...props}, ref) => {

  const formRef = useRef();

  const [skuIds, setSkuIds] = useSetState({data: []});

  const {loading, data} = useRequest(codingRulesList, {
    defaultParams: {
      data: {
        module: 4,
        state: 1
      }
    }
  });

  useImperativeHandle(ref, () => ({
    formRef,
  }));

  if (loading) {
    return (<ProSkeleton type="descriptions" />);
  }

  return (
    <div style={{padding: 16}}>
      <Form
        {...props}
        ref={formRef}
        api={ApiConfig}
        noButton
        fieldKey="qualityTaskId"
        onSuccess={() => {
          props.onSuccess();
        }}
        onError={() => {

        }}
        onSubmit={(value) => {
          return {
            ...value, details: value.details.map((items) => {
              return {
                ...items,
                percentum: items.percentum ? items.percentum / 100 : 1
              };
            })
          };
        }}
        effects={({setFieldState}) => {

          FormEffectHooks.onFieldValueChange$('details.*.skuId').subscribe(async ({name, value}) => {
            const array = skuIds.data;
            if (value !== undefined)
              array[name.match(/\d/g)[0]] = value;
            else
              array.splice(name.match(/\d/g)[0], 1);
            setSkuIds({data: array});
            if (value) {
              const sku = await request({
                ...skuDetail,
                data: {
                  skuId: value,
                }
              });
              if (sku) {
                const batch = sku.batch === 1;
                setFieldState(
                  FormPath.transform(name, /\d/, ($1) => {
                    return `details.${$1}.batch`;
                  }),
                  state => {
                    state.value = sku.batch;
                  }
                );

                setFieldState(
                  FormPath.transform(name, /\d/, ($1) => {
                    return `details.${$1}.qualityPlanId`;
                  }),
                  state => {
                    state.props.type = batch ? 1 : 2;
                    if (sku.qualityPlanId) {
                      state.value = sku.qualityPlanId;
                    }
                  }
                );

                setFieldState(
                  FormPath.transform(name, /\d/, ($1) => {
                    return `details.${$1}.percentum`;
                  }),
                  state => {
                    state.visible = batch;
                    state.required = batch;
                  }
                );
              }

            }

          });

        }}
      >

        <ProCard title="质检信息" className="h2Card" headerBordered>
          <div style={{display: 'inline-block', width: '40%'}}>
            <FormItem
              label="编码"
              name="coding"
              module={4}
              component={SysField.Codings}
              codingId={data}
              rules={[{required: true, message: data && data.length > 0 ? '该字段是必填字段' : '请先设置编码！'}]}
            />
          </div>
          <div style={{display: 'inline-block', width: '30%'}}>
            <FormItem label="类型" name="type" component={SysField.Type} required />
          </div>
          <div style={{display: 'inline-block', width: '30%'}}>
            <FormItem label="负责人" name="userId" component={SysField.UserId} />
          </div>
          <div style={{display: 'inline-block', width: '40%'}}>
            <FormItem label="备注" name="remark" component={SysField.Remark} />
          </div>

        </ProCard>
        <ProCard title="物料列表" className="h2Card" headerBordered>
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
                        <Avatar size={24}>{`${index + 1}`}</Avatar>
                        <div style={{width: '22%', display: 'inline-block'}}>
                          <FormItem
                            labelCol={7}
                            itemStyle={{margin: 0}}
                            label="物料"
                            skuIds={skuIds.data}
                            name={`details.${index}.skuId`}
                            component={SysField.SkuId}
                            required
                          />
                        </div>
                        <div style={{width: '27%', display: 'inline-block'}}>
                          <FormItem
                            labelCol={10}
                            itemStyle={{margin: 0}}
                            label="供应商(品牌)"
                            name={`details.${index}.brandId`}
                            component={SysField.BrandId}
                            required
                          />
                        </div>
                        <div style={{width: '16%', display: 'inline-block'}}>
                          <FormItem
                            labelCol={8}
                            itemStyle={{margin: 0}}
                            label="数量"
                            name={`details.${index}.number`}
                            component={SysField.Number}
                            required
                          />
                        </div>
                        <div style={{width: '17%', display: 'inline-block'}}>
                          <FormItem
                            labelCol={8}
                            itemStyle={{margin: 0}}
                            label="质检方案"
                            name={`details.${index}.qualityPlanId`}
                            component={SysField.QualityPlanId}
                          />
                        </div>
                        <div style={{display: 'inline-block', marginRight: 8}}>
                          <FormItem
                            visible={false}
                            name={`details.${index}.percentum`}
                            component={SysField.Remaining}
                          />
                        </div>
                        <div style={{display: 'none'}}>
                          <FormItem
                            visible={false}
                            name={`details.${index}.batch`}
                            component={SysField.Batch}
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

export default React.forwardRef(QualityTaskEdit);
