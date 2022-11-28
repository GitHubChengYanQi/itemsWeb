/**
 * 项目跟踪表编辑页
 *
 * @author
 * @Date 2021-08-05 10:31:44
 */

import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import ProCard from '@ant-design/pro-card';
import {FormEffectHooks, InternalFieldList as FieldList} from '@formily/antd';
import {Button, Col, Divider, Row, Switch} from 'antd';
import {trackMessageAdd} from '@/pages/Crm/trackMessage/trackMessageUrl';
import Form from '@/components/Form';
import Title from '@/components/Title';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import * as SysField from '../crmBusinessTrackField';
import style from './index.module.scss';


const {FormItem} = Form;

const ApiConfig = {
  add: trackMessageAdd
};

const CrmBusinessTrackEdit = (props, ref) => {

  const {val, number, id, onWidthChange, track = 1, ...other} = props;
  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    formRef,
  }));

  const [hidden, setHidden] = useState(false);
  const [txHidden, setTxHidden] = useState(false);
  const [classNmb, setClassNmb] = useState(number);

  const height = () => {
    if (window.document.body.clientHeight < 910) {
      return 'calc(100vh - 300px)';
    }
    return 810;
  };

  const Label = ['商机', '合同', '货单', '回款'];

  const returnFormItem = (index) => {
    if (!classNmb) {
      return null;
    }

    return (<FormItem
      label={Label[classNmb - 1]}
      required
      classNmb={classNmb}
      name={`businessTrackParams.${index}.classifyId`}
      component={SysField.BusinessId}
      val={id || null} />);
  };

  const {onFieldChange$} = FormEffectHooks;


  return (
    <div className={style.from} style={{maxHeight: 890, height: 'calc(100vh - 110px)', padding: '0 20px'}}>
      <Form
        {...other}
        ref={formRef}
        api={ApiConfig}
        fieldKey="trackMessageId"
        noButton
        wrapperCol={24}
        effects={() => {
          onFieldChange$('businessTrackParams.*.classify').subscribe(({value}) => {
            typeof onWidthChange === 'function' && onWidthChange(value);
            setClassNmb(value);
          });
        }}
      >
        <Row gutter={24} style={{height: '100%'}}>
          <Col span={classNmb === 1 ? 13 : 24} style={{height: '100%', overflow: 'auto',}}>
            <div style={{paddingRight: 10, display: 'inline-block'}}>
              <ProCard
                className="h2Card"
                bodyStyle={{padding: 16}}
                style={{marginTop: 8}}
                title={<Title title="基本信息" level={4} />} headerBordered>
                <FormItem
                  label="客户"
                  name="customerId"
                  component={SysField.CustomerId}
                  track={track}
                  value={val}
                  required />
              </ProCard>
              <ProCard
                className="h2Card"
                style={{marginTop: 2, height: '100%'}}
                bodyStyle={{padding: 16}}
                title={<Title title="事项" level={4} />} headerBordered>
                <FieldList
                  name="businessTrackParams"
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
                            <ProCard
                              style={{width: 'auto'}}
                              headStyle={{borderLeft: 'none', padding: '8px 16px'}}
                              title={<Title title={`事项明细 ${index + 1}`} level={6} />} headerBordered
                              extra={<Button
                                type="link" style={{float: 'right', display: state.value.length === 1 && 'none'}}
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                  onRemove(index);
                                }}
                                danger />} key={index}>
                              <div key={index}>
                                <FormItem
                                  label="分类"
                                  name={`businessTrackParams.${index}.classify`}
                                  component={SysField.Classify}
                                  value={number}
                                  required
                                />
                                {returnFormItem(index)}
                                <FormItem
                                  label="跟踪类型"
                                  required
                                  name={`businessTrackParams.${index}.type`}
                                  component={SysField.Type} />
                                <FormItem
                                  label="跟踪内容"
                                  required
                                  name={`businessTrackParams.${index}.note`}
                                  component={SysField.Note} />
                                <FormItem
                                  label="图片"
                                  name={`businessTrackParams.${index}.image`}
                                  component={SysField.Image} />
                                <Switch
                                  style={{marginLeft: '18%', marginBottom: 20, width: 100}}
                                  checkedChildren="关闭提醒"
                                  unCheckedChildren="开启提醒"
                                  checked={txHidden}
                                  onChange={() => {
                                    setTxHidden(!txHidden);
                                  }}
                                > </Switch>
                                {txHidden ? <FormItem
                                  label="跟进提醒时间"
                                  required
                                  name={`businessTrackParams.${index}.time`}
                                  component={SysField.Time} /> : null}
                                {txHidden ? <FormItem
                                  label="提醒内容"
                                  required
                                  name={`businessTrackParams.${index}.message`}
                                  component={SysField.Message} /> : null}
                                <Switch
                                  style={{marginLeft: '18%', marginBottom: 20, width: 100}}
                                  checkedChildren="暂不报价"
                                  unCheckedChildren="马上报价"
                                  checked={hidden}
                                  onChange={() => {
                                    setHidden(!hidden);
                                  }}
                                > </Switch>
                                {hidden ? <FormItem
                                  label="报价金额"
                                  required
                                  name={`businessTrackParams.${index}.money`}
                                  component={SysField.Money} /> : null}
                              </div>
                              <Divider dashed />
                            </ProCard>
                          );
                        })}
                        <Button
                          type="dashed"
                          icon={<PlusOutlined />}
                          style={{width: '100%'}}
                          onClick={onAdd}>增加明细</Button>
                      </div>
                    );
                  }}
                </FieldList>
              </ProCard>
            </div>
          </Col>
          {classNmb === 1 && <Col span={11} style={{height: '100%', overflow: 'auto'}}>
            <div>
              <ProCard
                className="h2Card"
                bodyStyle={{padding: 16}}
                style={{marginTop: 8, height: '100%'}}
                title={<Title title="竞争对手报价" level={4} />} headerBordered>
                <FieldList
                  name="competitorQuoteParam"
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
                            <ProCard
                              bodyStyle={{padding: 16}}
                              headStyle={{borderLeft: 'none', padding: '8px 16px'}}
                              title={<Title title={`竞争对手明细 ${index + 1}`} level={6} />} headerBordered
                              extra={<Button
                                type="link" style={{float: 'right', display: state.value.length === 1 && 'none'}}
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                  onRemove(index);
                                }}
                                danger />} key={index}>
                              <RowStyleLayout key={index}>
                                <FormItem
                                  label="竞争对手"
                                  name={`competitorQuoteParam.${index}.competitorId`}
                                  component={SysField.CompetitorId}
                                  businessId={val.businessId}
                                />
                                <FormItem
                                  label="报价"
                                  name={`competitorQuoteParam.${index}.competitorsQuote`}
                                  component={SysField.CompetitorsQuote}

                                />
                              </RowStyleLayout>
                              <Divider dashed />
                            </ProCard>
                          );
                        })}
                        <Button
                          type="dashed"
                          style={{width: '100%'}}
                          icon={<PlusOutlined />}
                          onClick={onAdd}>增加报价</Button>
                      </div>
                    );
                  }}
                </FieldList>
              </ProCard>
            </div>
          </Col>}
        </Row>
      </Form>
    </div>
  );

};

export default forwardRef(CrmBusinessTrackEdit);
