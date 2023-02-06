/**
 * 编辑页
 *
 * @author
 * @Date 2021-10-18 14:14:21
 */

import React, {useImperativeHandle, useRef} from 'react';
import {
  Col,
  notification,
  Row,
} from 'antd';
import ProCard from '@ant-design/pro-card';
import {createFormActions,} from '@formily/antd';
import Form from '@/components/Form';
import {spuDetail, spuAdd, spuEdit} from '../spuUrl';
import * as SysField from '../spuField';

const {FormItem} = Form;

const ApiConfig = {
  view: spuDetail,
  add: spuAdd,
  save: spuEdit
};

const formActionsPublic = createFormActions();

const SpuEdit = ({...props}, ref) => {

  const {value,...other} = props;

  const formRef = useRef();

  const openNotificationWithIcon = type => {
    notification[type]({
      message: '创建成功！',
    });
  };

  useImperativeHandle(ref, () => ({
    formRef,
  }));


  return (
    <div style={{padding: 16}}>
      <Form
        noButton
        {...other}
        value={value && value.spuId}
        ref={formRef}
        api={ApiConfig}
        formActions={formActionsPublic}
        fieldKey="spuId"
        onSuccess={() => {
          openNotificationWithIcon('success');
          props.onSuccess();
        }}
        onSubmit={(value) => {
          return {...value, type: 1, isHidden: false};
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <ProCard title="基础信息" className="h2Card" headerBordered>
              <FormItem label="系列" name="categoryId" component={SysField.CategoryId} required />
              <FormItem
                label="分类"
                name="spuClassificationId"
                component={SysField.SpuClass}
                required />
              <FormItem label="名称" name="name" component={SysField.Name} required />
              <FormItem label="产品码" name="coding" component={SysField.Name} required />
              <FormItem label="单位" name="unitId" component={SysField.UnitId} required />
              <FormItem label="生产类型" name="productionType" component={SysField.Type} required />
            </ProCard>
          </Col>
          <Col span={12}>
            <ProCard title="详细信息" className="h2Card" headerBordered>
              <FormItem label="养护周期" name="curingCycle" component={SysField.CuringCycle} />
              <FormItem label="质保期" name="shelfLife" component={SysField.ShelfLife} />
              <FormItem label="材质名称" name="materialId" component={SysField.MaterialId} />
              <FormItem label="易损" name="vulnerability" component={SysField.Vulnerability} />
              <FormItem label="重要程度" name="important" component={SysField.Important} />
              <FormItem label="产品重量" name="weight" component={SysField.Weight} />
            </ProCard>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default React.forwardRef(SpuEdit);
