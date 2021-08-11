/**
 * 合同模板编辑页
 *
 * @author
 * @Date 2021-07-21 08:22:02
 */

import React, {useRef, useState} from 'react';
import {Button, Input, InputNumber, Select as AntdSelect, Steps, Table as AntTable} from 'antd';
import Form from '@/components/Form';
import * as SysField from '@/pages/Crm/contract/ContractField';
import FormIndex from '@/components/Form/FormIndex';
import {contractAdd, contractDetail, contractEdit} from '@/pages/Crm/contract/ContractUrl';
import {useRequest} from '@/util/Request';
import {createFormActions, FormEffectHooks} from '@formily/antd';


const {onFieldValueChange$} = FormEffectHooks;


const {FormItem} = Form;

const ApiConfig = {
  view: contractDetail,
  add: contractAdd,
  save: contractEdit
};


const AddContractEdit = ({...props}) => {


  const {Step} = Steps;

  const {value, ...other} = props;

  const [result, setResult] = useState(value);

  const [current, setCurrent] = React.useState(0);

  const {data: Acontacts, run: AcontactsRun} = useRequest({
    url: '/contacts/list',
    method: 'POST',
  }, {manual: true});
  const {data: Aadress, run: AadressRun} = useRequest({
    url: '/adress/list',
    method: 'POST',
  }, {manual: true});

  const {data: Bcontacts, run: BcontactsRun} = useRequest({
    url: '/contacts/list',
    method: 'POST',
  }, {manual: true});
  const {data: Badress, run: BadressRun} = useRequest({
    url: '/adress/list',
    method: 'POST',
  }, {manual: true});

  const formRef = useRef();

  const steps = [
    {
      title: '必填项',
      content:
        <>
          <div style={{margin: '50px 150px'}}>
            <FormIndex
              value={ result ? result.contractId : false}
              {...other}
              ref={formRef}
              api={ApiConfig}
              fieldKey="contractId"
              effects={() => {
                const {setFieldState} = createFormActions();
                onFieldValueChange$('partyA').subscribe(({value}) => {
                  setFieldState('partyAContactsId', state => {
                    state.visible = value;
                  });
                });
                onFieldValueChange$('partyAContactsId').subscribe(({value}) => {
                  setFieldState('partyAAdressId', state => {
                    state.visible = value;
                  });
                });
                onFieldValueChange$('partyB').subscribe(({value}) => {
                  setFieldState('partyBContactsId', state => {
                    state.visible = value;
                  });
                });
                onFieldValueChange$('partyBContactsId').subscribe(({value}) => {
                  setFieldState('partyBAdressId', state => {
                    state.visible = value;
                  });
                });
              }}
              success={(result) => {
                if (result.data !== '') {
                  setResult(result.data);
                }
                next();
              }}
            >
              <FormItem label="选择合同模板" name="templateId" component={SysField.Template} required />
              <FormItem label="合同名称" name="name" component={SysField.Name} required />
              <FormItem
                initialValue={false}
                label="甲方"
                name="partyA"
                component={SysField.Customer}
                placeholder="请选择甲方客户"
                val={value ? value.partAName : null}
                customerId={async (customer) => {
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
                initialValue={false}
                label="甲方联系人"
                name="partyAContactsId"
                component={SysField.Contacts}
                placeholder="请选择甲方联系人"
                val={value ? value.partyAContactsId : null}
                customerId={Acontacts || null}
                required
              />
              <FormItem
                initialValue={false}
                label="甲方地址"
                name="partyAAdressId"
                component={SysField.Adress}
                placeholder="请选择甲方地址"
                val={value ? value.partyAAdressId : null}
                customerId={Aadress || null}
                required
              />


              <FormItem
                initialValue={false}
                label="乙方"
                name="partyB"
                component={SysField.Customer}
                placeholder="请选择乙方客户"
                val={value ? value.partBName : null}
                customerId={async (customer) => {
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
                label="乙方联系人"
                name="partyBContactsId"
                component={SysField.Contacts}
                placeholder="请选择乙方联系人"
                val={value ? value.partyBContactsId : null}
                customerId={Bcontacts || null}
                required />

              <FormItem
                initialValue={false}
                label="乙方地址"
                name="partyBAdressId"
                component={SysField.Adress}
                placeholder="请选择乙方地址"
                val={value ? value.partyBAdressId : null}
                customerId={Badress || null}
                required
              />
              <FormItem label="创建时间" name="time" component={SysField.Time} required />
              <FormItem label="审核" name="audit" component={SysField.Audit} required />
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </FormIndex>
          </div>
        </>
    },
    {
      title: '选填项',
      content:
        <>
          <div style={{margin: '50px 150px'}}>
            <FormIndex
              {...props}
              value={result ? result.contractId : false}
              ref={formRef}
              api={ApiConfig}
              fieldKey="contractId"
              success={(result) => {
                props.onSuccess();
              }}
            >
              <FormItem name="content" component={SysField.Content} result={result}  required />
              <Button type="primary" htmlType="submit">
                Done
              </Button>
            </FormIndex>
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
    <div style={{minWidth: 800}}>
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
