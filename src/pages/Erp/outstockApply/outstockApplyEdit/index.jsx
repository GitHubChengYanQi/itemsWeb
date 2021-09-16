/**
 * 出库申请编辑页
 *
 * @author song
 * @Date 2021-09-14 16:49:41
 */

import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {Button, Card, Col, Divider, Input, Row} from 'antd';
import Form from '@/components/Form';
import {outstockApplyDetail, outstockApplyAdd, outstockApplyEdit} from '../outstockApplyUrl';
import {InternalFieldList as FieldList} from '@formily/antd';
import * as SysField from '@/pages/Erp/outstockApply/outstockApplyField';
import styled from 'styled-components';
import {useRequest} from '@/util/Request';

const {FormItem} = Form;

const ApiConfig = {
  view: outstockApplyDetail,
  add: outstockApplyAdd,
  save: outstockApplyEdit
};

const OutstockApplyEdit = ({...props},ref) => {



  const RowStyleLayout = styled(props => <div {...props} />)`
    .ant-btn {
      margin-right: 16px;
    }

    .ant-form-item {
      display: inline-flex;
      margin-right: 16px;
      width: 25%;
    }
  `;

  const [state, setState] = useState();

  const {data: Acontacts, run: AcontactsRun} = useRequest({
    url: '/contacts/list',
    method: 'POST',
  }, {
    manual: true
  });
  const {data: APhone, run: runAPhone} = useRequest({
    url: '/phone/list',
    method: 'POST',
  }, {
    manual: true
  });
  const {data: Aadress, run: AadressRun} = useRequest({
    url: '/adress/list',
    method: 'POST',
  }, {
    manual: true
  });




  const formRef = useRef();

  useImperativeHandle(ref,()=>({
    formRef,
  }));


  const height = () => {
    if (window.document.body.clientHeight < 385) {
      return 'calc(100vh - 206px)';
    }
    return 385;
  };

  return (
    <div style={{height: height()}}>
      <Form
        {...props}
        NoButton={false}
        ref={formRef}
        api={ApiConfig}
        fieldKey="outstockApplyId"
      >

        <Row gutter={24}>
          <Col span={10}>
            <div style={{height: height(), overflow: 'auto'}}>
              <Card title="基本信息" bordered={false}>
                <div style={{paddingRight: 20}}>
                  <FormItem label="负责人" component={SysField.UserId} name="userId" required />

                  <FormItem
                    label="客户"
                    name="customerId"
                    component={SysField.Customer}
                    placeholder="请选择客户"
                    customerid={async (customer) => {
                      setState(true);
                      if (customer) {
                        await AcontactsRun({
                          data: {
                            customerId: customer
                          }
                        });
                        await AadressRun({
                          data: {
                            customerId: customer
                          }
                        });
                      }
                    }}
                    required
                  />
                  <FormItem
                    label="联系人"
                    name="contactsId"
                    state={state}
                    component={SysField.Contacts}
                    placeholder="联系人"
                    customerid={Acontacts || null}
                    contactsid={async (contacts) => {
                      if (contacts) {
                        await runAPhone({
                          data: {
                            contactsId: contacts
                          }
                        });
                      }
                    }}
                    required
                  />
                  <FormItem
                    label="联系人电话"
                    name="phoneId"
                    state={state}
                    component={SysField.Phone}
                    placeholder="请选择联系人电话"
                    contactsid={APhone || null}
                    required
                  />
                  <FormItem
                    label="地址"
                    name="adressId"
                    state={state}
                    component={SysField.Adress}
                    placeholder="请选择地址"
                    customerid={Aadress || null}
                    required
                  />
                </div>
              </Card>
            </div>
          </Col>
          <Col span={14}>
            <div style={{height: height(), overflow: 'auto'}}>
              <Card title="发货申请明细" bordered={false}>
                <FieldList
                  name="applyDetails"
                  initialValue={[
                    {itemId: ''},
                  ]}
                >
                  {({state, mutators}) => {
                    const onAdd = () => mutators.push();
                    return (
                      <div>
                        {state.value.map((item, index) => {
                          const onRemove = index => mutators.remove(index);
                          return (
                            <RowStyleLayout key={index}>
                              <FormItem
                                label="产品"
                                name={`applyDetails.${index}.itemId`}
                                component={SysField.ItemId}
                                required
                              />
                              <FormItem
                                label="品牌"
                                name={`applyDetails.${index}.brandId`}
                                component={SysField.BrandId}
                                required
                              />
                              <FormItem
                                label="数量"
                                name={`applyDetails.${index}.number`}
                                component={SysField.Number}
                                required
                              />
                              {/* eslint-disable-next-line react/jsx-no-bind */}
                              <Button onClick={onRemove.bind(null, index)}>删除</Button>
                            </RowStyleLayout>
                          );
                        })}
                        <Button onClick={onAdd}>增加</Button>
                      </div>
                    );
                  }}
                </FieldList>
              </Card>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default forwardRef(OutstockApplyEdit);
