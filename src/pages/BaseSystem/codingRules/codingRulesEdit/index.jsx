/**
 * 编码规则编辑页
 *
 * @author song
 * @Date 2021-10-22 17:20:05
 */

import React, {useImperativeHandle, useRef} from 'react';
import {Button, Collapse, Input, message, Table} from 'antd';
import Form from '@/components/Form';
import {codingRulesDetail, codingRulesAdd, codingRulesEdit} from '../codingRulesUrl';
import * as SysField from '../codingRulesField';
import styles from '@/pages/Portal/remind/components/TemplateTable/index.module.scss';
import SpuList from '@/pages/Erp/instock/components/SpuList';
import {CloseOutlined, DeleteOutlined, MinusOutlined, MinusSquareOutlined, PlusOutlined} from '@ant-design/icons';
import {createFormActions, FieldList, FormEffectHooks} from '@formily/antd';
import ProCard from '@ant-design/pro-card';

const {FormItem} = Form;

const ApiConfig = {
  view: codingRulesDetail,
  add: codingRulesAdd,
  save: codingRulesEdit
};

const CodingRulesEdit = ({...props},ref) => {

  const formRef = useRef();

  useImperativeHandle(ref,()=>({
    formRef,
  }));

  return (
    <div style={{padding: 16}}>
      <Form
        {...props}
        labelCol={5}
        NoButton={false}
        ref={formRef}
        api={ApiConfig}
        fieldKey="codingRulesId"
        effect={() => {

          const {setFieldState} = createFormActions();

          FormEffectHooks.onFieldValueChange$('module').subscribe(({value}) => {
            setFieldState(
              'codings.*.values',
              state => {
                state.props.module = value;
              }
            );
          });
        }}
      >
        <ProCard className="h2Card" headerBordered title="基本信息">
          <FormItem label="编码规则名称" name="name" component={SysField.Name} required />
          <FormItem label="模块" name="module" component={SysField.Module} required />
          <FormItem label="描述" name="note" component={SysField.Note} />
        </ProCard>
        <ProCard className="h2Card" headerBordered title="编码规则设置">
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
                        <div key={index} style={{display: 'block', marginRight: 8,textAlign:'center'}}>
                          <div style={{display: 'inline-block', marginRight: 8,}}>
                            <FormItem
                              name={`codings.${index}.values`}
                              component={SysField.Values}
                              required
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
                      style={{width:'100%'}}
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
