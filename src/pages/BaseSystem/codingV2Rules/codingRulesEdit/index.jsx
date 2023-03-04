/**
 * 编码规则编辑页
 *
 * @author song
 * @Date 2021-10-22 17:20:05
 */

import React, {useImperativeHandle, useRef} from 'react';
import {Button, message} from 'antd';
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';
import {createFormActions, FieldList, FormEffectHooks} from '@formily/antd';
import ProCard from '@ant-design/pro-card';
import Form from '@/components/Form';
import {codingRulesV2Detail, codingRulesV2Edit, codingRulesV2Add} from '../codingRulesUrl';
import * as SysField from '../codingRulesField';
import {isArray} from '@/util/Tools';

const {FormItem} = Form;

const ApiConfig = {
  view: codingRulesV2Detail,
  add: codingRulesV2Add,
  save: codingRulesV2Edit
};

const CodingRulesEdit = ({rules, ...props}, ref) => {

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    formRef,
  }));

  return (
    <div style={{padding: 16}}>
      <Form
        {...props}
        labelCol={5}
        noButton
        ref={formRef}
        api={ApiConfig}
        fieldKey="codingRulesId"
        onSubmit={(values) => {
          const codings = isArray(values.codings).filter(item => item && item.value);
          if (codings.length === 0) {
            message.warn('请配置规则!');
            return false;
          }
          return {
            ...values,
            codings
          };
        }}
        effects={() => {

          const {setFieldState} = createFormActions();

          FormEffectHooks.onFieldValueChange$('module').subscribe(({value,inputed}) => {
            if (inputed){
              setFieldState(
                'codings',
                state => {
                  state.value = [{}];
                }
              );
            }
            setFieldState(
              'codings.*.value',
              state => {
                state.props.module = value;
              }
            );
          });
        }}
      >
        <ProCard className="h2Card" headerBordered title="基本信息">
          <FormItem label="规则名称" name="name" component={SysField.Name} required />
          <FormItem
            label="对应模块"
            name="module"
            component={SysField.Module}
            modelRuleList={rules.modelRuleList}
            required
          />
          <FormItem label="规则描述" name="note" component={SysField.Note} />
        </ProCard>
        <ProCard className="h2Card" headerBordered title="规则设置">
          <div>
            <FieldList
              name="codings"
              initialValue={[{}]}
            >
              {({state, mutators}) => {
                const onAdd = () => {
                  mutators.push();
                };
                return (
                  <div>
                    {state.value.map((item, index) => {
                      const onRemove = index => mutators.remove(index);
                      return (
                        <div key={index} style={{display: 'block', marginRight: 8, textAlign: 'center'}}>
                          <div style={{display: 'inline-block', marginRight: 8,}}>
                            <FormItem
                              codingRules={rules}
                              name={`codings.${index}.value`}
                              component={SysField.Values}
                            />
                          </div>
                          <Button
                            type="dashed"
                            icon={<MinusOutlined />}
                            onClick={() => {
                              onRemove(index);
                            }}
                          />
                        </div>
                      );
                    })}
                    <Button
                      type="text"
                      style={{width: '100%'}}
                      icon={<PlusOutlined />}
                      onClick={onAdd} />
                  </div>
                );
              }}
            </FieldList>
          </div>
        </ProCard>
      </Form>
    </div>
  );
};

export default React.forwardRef(CodingRulesEdit);
