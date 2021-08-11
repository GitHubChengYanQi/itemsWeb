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
import {Audit} from '@/pages/Crm/contract/ContractField';

const {FormItem} = Form;
const ApiConfig = {
  view: contractDetail,
  add: contractAdd,
  save: contractEdit
};


const AddContractEdit = ({...props}) => {
  const {Step} = Steps;

  const {value, ...other} = props;

  const [result, setResult] = useState(value ? value.contractId : value);

  const [current, setCurrent] = React.useState(0);

  const [AcustomerId, setACustomerId] = useState(false);
  const [BcustomerId, setBCustomerId] = useState(false);

  const formRef = useRef();

  const steps = [
    {
      title: '必填项',
      content:
        <>
          <div style={{margin: '50px 150px'}}>
            <FormIndex
              value={result}
              {...other}
              ref={formRef}
              api={ApiConfig}
              fieldKey="contractId"
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
                label="甲方"
                name="partyA"
                component={SysField.Customer}
                placeholder="请选择甲方客户"
                val={value ? value.partAName : null}
                customerId={(customerId) => {
                  setACustomerId(customerId);
                }}
                required
              />
              {AcustomerId ?
                <>
                  <FormItem
                    label="甲方联人"
                    name="partyAContactsId"
                    component={SysField.Contacts}
                    placeholder="请选择甲方联系人"
                    val={value ? value.partyAContactsId : null}
                    customerId={AcustomerId || null}
                    required
                  />
                  <FormItem
                    label="甲方地址"
                    name="partyAAdressId"
                    component={SysField.Adress}
                    placeholder="请选择甲方地址"
                    val={value ? value.partyAAdressId : null}
                    customerId={AcustomerId || null}
                    required
                  />
                </>
                : null}

              <FormItem
                label="乙方"
                name="partyB"
                component={SysField.Customer}
                placeholder="请选择乙方客户"
                val={value ? value.partBName : null}
                customerId={(customerId) => {
                  setBCustomerId(customerId);
                }}
                required
              />
              {BcustomerId ?
                <>
                  <FormItem
                    label="乙方联系人"
                    name="partyBContactsId"
                    component={SysField.Contacts}
                    placeholder="请选择乙方联系人"
                    val={value ? value.partyBContactsId : null}
                    customerId={BcustomerId || null} required />
                  <FormItem
                    label="乙方地址"
                    name="partyBAdressId"
                    component={SysField.Adress}
                    placeholder="请选择乙方地址"
                    val={value ? value.partyBAdressId : null}
                    customerId={BcustomerId || null}
                    required
                  />
                </>
                : null}

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
              value={result}
              ref={formRef}
              api={ApiConfig}
              fieldKey="contractId"
              success={(result) => {
                props.onSuccess();
              }}
            >
              <FormItem name="content" component={SysField.Content} required />
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
