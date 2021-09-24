/**
 * 产品表编辑页
 *
 * @author
 * @Date 2021-07-14 14:04:26
 */

import React, {useRef, useState} from 'react';
import {Button, Divider, Input, message, Select, Steps} from 'antd';
import Form from '@/components/Form';
import {itemsDetail, itemsAdd, itemsEdit} from '../ItemsUrl';
import * as SysField from '../ItemsField';



const {FormItem} = Form;

const ApiConfig = {
  view: itemsDetail,
  add: itemsAdd,
  save: itemsEdit
};

const ItemsEdit = ({...props}) => {

  const {Step} = Steps;

  const [result, setResult] = useState(props.value);

  const [current, setCurrent] = React.useState(0);

  const formRef = useRef();

  const steps = [
    {
      title: '添加产品',
      content:
        <>
          <div style={{margin: '50px 150px'}}>
            <Form
              NoButton={false}
              {...props}
              ref={formRef}
              api={ApiConfig}
              fieldKey="itemId"
              onSuccess={(result) => {
                if (result.data !== '') {
                  setResult(result.data);
                }
                next();
              }}
            >
              <FormItem label="产品名字" name="name" component={SysField.Name} required />
              <FormItem label="生产日期" name="productionTime" component={SysField.ProductionTime} required />
              <FormItem label="材质名称" name="materialId" component={SysField.MaterialId} required />
              <FormItem label="易损" name="vulnerability" component={SysField.Vulnerability} required />
              <FormItem label="品牌" name="brandResults" component={SysField.BrandId} required />
              <div style={{textAlign:'center'}}>
                <Button type="primary" htmlType="submit">
                  下一步
                </Button>
              </div>
            </Form>
          </div>
        </>
    },
    {
      title: '产品选填项',
      content:
        <>
          <div style={{margin: '50px 150px'}}>
            <Form
              NoButton={false}
              {...props}
              value={result}
              ref={formRef}
              api={ApiConfig}
              fieldKey="itemId"
              success={(result) => {
                props.onSuccess();
              }}
            >
              <FormItem label="质保期" name="shelfLife" component={SysField.ShelfLife} />
              <FormItem label="产品库存" name="inventory" component={SysField.Inventory} />
              <FormItem label="重要程度" name="important" component={SysField.Important} />
              <FormItem label="产品重量" name="weight" component={SysField.Weight} />
              <FormItem label="成本" name="cost" component={SysField.Cost} />

              <div style={{textAlign:'center'}}>
                <Button style={{marginRight:20}} type="primary" htmlType="submit">
                  保存
                </Button>
                <Button onClick={()=> prev()}>
                  返回
                </Button>
              </div>
            </Form>
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
    <>
      <Steps current={current} style={{padding: '30px 150px '}}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
    </>
  );

};

export default ItemsEdit;
