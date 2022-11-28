/**
 * 派工表编辑页
 *
 * @author n
 * @Date 2021-08-23 10:25:48
 */

import React, {useRef} from 'react';
import {Button, Card, Descriptions, Input} from 'antd';
import Form from '@/components/Form';
import {dispatchingDetail, dispatchingAdd, dispatchingEdit} from '../dispatchingUrl';
import * as SysField from '../dispatchingField';
import DescAddress from '@/pages/Repair/repair/RepairDetails/components/DescAddress';

const {FormItem} = Form;

const ApiConfig = {
  view: dispatchingDetail,
  add: dispatchingAdd,
  save: dispatchingEdit
};

const DispatchingEdit = ({...props}) => {

  const {value} = props;

  const formRef = useRef();

  if (value) {
    return (
      <>
        <Card title="使用单位信息" bordered={false}>
          <DescAddress data={value} />
        </Card>
        <Card title="产品信息" bordered={false}>
          <Descriptions layout="vertical" bordered>
            <Descriptions.Item
              label="出厂编号">{value.deliveryDetailsResult && value.deliveryDetailsResult.stockItemId}</Descriptions.Item>
            <Descriptions.Item
              label="产品名称">{value.deliveryDetailsResult && value.deliveryDetailsResult.detailesItems && value.deliveryDetailsResult.detailesItems.name}</Descriptions.Item>
            <Descriptions.Item
              label="品牌">{value.deliveryDetailsResult && value.deliveryDetailsResult.detailsBrand && value.deliveryDetailsResult.detailsBrand.brandName}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card title="需求类型" bordered={false}>
          {value && value.serviceType}
        </Card>
        <Card title="报修问题描述" bordered={false}>
          {value && value.comment}
        </Card>
        <Card title="派工信息" bordered={false}>
          <Form
            noButton
            {...props}
            value={false}
            ref={formRef}
            api={ApiConfig}
            wrapperCol={24}
            fieldKey="dispatchingId"
          >
              <FormItem
                label="姓名"
                name="name"
                component={SysField.Name}
                rules={[{required: true, message: '请输入工程师姓名'}]} />
              <FormItem
                label="手机号"
                name="phone"
                component={SysField.Phone}
                rules={[{required: true, message: '请输入工程师手机号'}]} />
              <FormItem
                label="预计到达时间"
                name="time"
                component={SysField.Time}
                rules={[{required: true, message: '请选择预计到达时间'}]} />
              <FormItem
                label="负责区域"
                name="address"
                component={SysField.Address}
                rules={[{required: true, message: '请选择服务区域'}]} />
            <FormItem hidden name="repairId" component={SysField.RepairId} val={value.repairId || null} />
            <FormItem hidden name="repair" component={SysField.Repair} val={value || null} />
            <div style={{textAlign: 'center'}}>
              <Button type="primary" htmlType="submit">
                生成派工单
              </Button>
            </div>
          </Form>
        </Card>

      </>
    );
  }


};

export default DispatchingEdit;
