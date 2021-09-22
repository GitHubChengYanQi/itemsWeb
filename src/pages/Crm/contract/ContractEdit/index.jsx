/**
 * 合同模板编辑页
 *
 * @author
 * @Date 2021-07-21 08:22:02
 */

import React, {useRef, useState} from 'react';
import {Button, Card, Col, Input, InputNumber, Row, Select as AntdSelect, Steps, Table as AntTable} from 'antd';
import Form from '@/components/Form';
import * as SysField from '@/pages/Crm/contract/ContractField';
import {contractAdd, contractDetail, contractEdit} from '@/pages/Crm/contract/ContractUrl';
import {useRequest} from '@/util/Request';
import {createFormActions, FormEffectHooks} from '@formily/antd';
import TableDetail from '@/pages/Crm/contract/ContractEdit/components/TableDetail';
import ProCard from '@ant-design/pro-card';


const {onFieldValueChange$} = FormEffectHooks;

const company = '1416605276529807486';


const {FormItem} = Form;

const ApiConfig = {
  view: contractDetail,
  add: contractAdd,
  save: contractEdit
};


const AddContractEdit = ({...props}) => {

  const {Step} = Steps;

  const {value, customerId, ...other} = props;

  const [customerIds, setCustomerIds] = useState();
  const [contactsId, setContactIds] = useState();


  const [result, setResult] = useState(value);

  const content = () => {
    return (
      <div style={{padding: 20, maxWidth: 1200}}>
        <Form
          {...props}
          value={result ? result.contractId : false}
          ref={formRef}
          api={ApiConfig}
          NoButton={false}
          fieldKey="contractId"
          onSuccess={(result) => {
            props.onSuccess();
          }}
        >
          <FormItem name="content" component={SysField.Content} result={result} required />
        </Form>
        <Card title="添加产品明细" bordered={false}>
          <TableDetail value={result ? result.contractId : false} />
        </Card>
        <Button type="primary" style={{width: '100%'}} onClick={() => {
          formRef.current.submit();
        }}>
          完成
        </Button>
      </div>
    );
  };


  const [current, setCurrent] = React.useState(0);

  const {refresh: refreshAcontactsn, data: Acontacts, run: AcontactsRun} = useRequest({
    url: '/contacts/list',
    method: 'POST',
    data: {
      customerId: customerId || result.partyA,
    }
  }, {manual: true});
  const {refresh: refreshAPhone, data: APhone, run: runAPhone} = useRequest({
    url: '/phone/list',
    method: 'POST',
    data: {
      contactsId: result.partyAContactsId,
    }
  }, {manual: true});
  const {refresh: refreshAadress, data: Aadress, run: AadressRun} = useRequest({
    url: '/adress/list',
    method: 'POST',
    data: {
      customerId: customerId || result.partyA,
    }
  }, {manual: true});

  const {refresh: refreshBContacts, data: Bcontacts, run: BcontactsRun} = useRequest({
    url: '/contacts/list',
    method: 'POST',
    data: {
      customerId: company || result.partyB,
    }
  }, {manual: false});
  const {refresh: refreshBphone, data: BPhone, run: runBPhone} = useRequest({
    url: '/phone/list',
    method: 'POST',
    data: {
      contactsId: result.partyBContactsId,
    }
  }, {manual: false});
  const {refresh: refreshBadress, data: Badress, run: BadressRun} = useRequest({
    url: '/adress/list',
    method: 'POST',
    data: {
      customerId: company || result.partyB,
    }
  }, {manual: false});

  const refresh = () => {
    refreshAcontactsn();
    refreshAadress();
    refreshAPhone();
    refreshBadress();
    refreshBphone();
    refreshBContacts();
  };

  const formRef = useRef();


  if (props.value) {
    return content();
  }


  const steps = [
    {
      title: '必填项',
      content:
        <>
          <div style={{margin: '50px 150px'}}>
            <Form
              NoButton={false}
              value={result ? result.contractId : false}
              {...other}
              ref={formRef}
              api={ApiConfig}
              fieldKey="contractId"
              onSuccess={(result) => {
                if (result.data !== '') {
                  setResult(result.data);
                }
                next();
              }}
            >
              <FormItem label="选择合同模板" name="templateId" component={SysField.Template} required />
              <FormItem label="合同名称" name="name" component={SysField.Name} required />
              <div style={{height:0}}>
                <FormItem hidden name="audit" component={SysField.Audit} required />
              </div>

              <Row gutter={24}>
                <Col span={12}>
                  <ProCard headerBordered className='h2Card' title='甲方信息'>
                    {customerId ?
                      <FormItem
                        initialValue={false}
                        label="客户"
                        name="partyA"
                        value={customerId}
                        component={SysField.CustomerId}
                        placeholder="请选择甲方客户"
                        val={value ? value.partAName : null}
                        customers={async (customer) => {
                          setCustomerIds(customer);
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
                      /> : <FormItem
                        initialValue={false}
                        label="甲方"
                        name="partyA"
                        component={SysField.Customer}
                        placeholder="客户"
                        refresh={() => {
                          refresh();
                        }}
                        val={value ? value.partAName : null}
                        customers={async (customer) => {
                          setCustomerIds(customer);
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
                      />}
                    <FormItem
                      initialValue={false}
                      label="联系人"
                      name="partyAContactsId"
                      component={SysField.Contacts}
                      placeholder="甲方联系人"
                      refresh={() => {
                        refresh();
                      }}
                      customerId={customerId || customerIds}
                      val={value ? value.partyAContactsId : null}
                      customers={Acontacts || null}
                      contact={async (contacts) => {
                        setContactIds(contacts);
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
                      initialValue={false}
                      label="电话"
                      name="partyAPhone"
                      refresh={() => {
                        refresh();
                      }}
                      component={SysField.Phone}
                      contactsId={contactsId}
                      placeholder="请选择甲方联系人电话"
                      val={value ? value.partyAPhone : null}
                      contacts={APhone || null}
                      required
                    />
                    <FormItem
                      initialValue={false}
                      label="地址"
                      refresh={() => {
                        refresh();
                      }}
                      name="partyAAdressId"
                      customerId={customerId || customerIds}
                      component={SysField.Adress}
                      placeholder="请选择甲方地址"
                      val={value ? value.partyAAdressId : null}
                      customers={Aadress || null}
                      required
                    />
                  </ProCard>
                </Col>
                <Col span={12}>
                  <ProCard className='h2Card' headerBordered title='乙方信息'>
                    <FormItem
                      initialValue={false}
                      label="乙方"
                      name="partyB"
                      value={company}
                      component={SysField.CustomerId}
                      placeholder="客户"
                      val={value ? value.partBName : null}
                      refresh={() => {
                        refresh();
                      }}
                      customers={async (customer) => {
                        if (customer) {
                          await BcontactsRun({
                            data: {
                              customerId: customer
                            }
                          });
                          await BadressRun({
                            data: {
                              customerId: customer
                            }
                          });
                        }
                      }}
                      required
                    />
                    <FormItem
                      initialValue={false}
                      label="联系人"
                      name="partyBContactsId"
                      component={SysField.Contacts}
                      placeholder="请选择乙方联系人"
                      refresh={() => {
                        refresh();
                      }}
                      customerId={company}
                      val={value ? value.partyBContactsId : null}
                      customers={Bcontacts || null}
                      contact={async (contacts) => {
                        setContactIds(contacts);
                        if (contacts) {
                          await runBPhone({
                            data: {
                              contactsId: contacts
                            }
                          });
                        }
                      }}
                      required />
                    <FormItem
                      initialValue={false}
                      label="电话"
                      refresh={() => {
                        refresh();
                      }}
                      name="partyBPhone"
                      contactsId={contactsId}
                      component={SysField.Phone}
                      placeholder="请选择乙方联系人电话"
                      val={value ? value.partyAPhone : null}
                      contacts={BPhone || null}
                      required
                    />

                    <FormItem
                      initialValue={false}
                      label="地址"
                      refresh={() => {
                        refresh();
                      }}
                      name="partyBAdressId"
                      customerId={company}
                      component={SysField.Adress}
                      placeholder="请选择乙方地址"
                      val={value ? value.partyBAdressId : null}
                      customers={Badress || null}
                      required
                    />
                  </ProCard>
                </Col>
              </Row>

              <Button style={{float:'right',margin:24}} type="primary" htmlType="submit">
                下一步
              </Button>
            </Form>
          </div>
        </>
    },
    {
      title: '选填项',
      content:
        <>
          <div style={{margin: '50px 150px'}}>
            {content()}
          </div>

        </>
    },
  ];


  const next = () => {
    setCurrent(current + 1);
  };


  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <div style={{minWidth: 1200}}>
      <Steps current={current} style={{padding: '30px 150px '}}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>

    </div>
  );

};

export default AddContractEdit;
