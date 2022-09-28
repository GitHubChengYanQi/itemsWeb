/**
 * SPU分类编辑页
 *
 * @author song
 * @Date 2021-10-25 17:52:03
 */

import React, {useRef} from 'react';
import {Button, Col, Modal, Popover, Row, Space} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {createFormActions} from '@formily/antd';
import ProCard from '@ant-design/pro-card';
import Form from '@/components/Form';
import {spuClassificationDetail, spuClassificationAdd, spuClassificationEdit} from '../spuClassificationUrl';
import * as SysField from '../spuClassificationField';
import store from '@/store';
import SkuForm from '@/pages/Erp/spu/components/SkuForm';

const {FormItem} = Form;

const ApiConfig = {
  view: spuClassificationDetail,
  add: spuClassificationAdd,
  save: spuClassificationEdit
};

const formActionsPublic = createFormActions();

const SpuClassificationEdit = ({...props}) => {

  const formRef = useRef();

  const dispatchers = store.useModel('dataSource')[1];

  const skuFormRef = useRef();

  return (
    <Form
      {...props}
      boxShadow
      ref={formRef}
      api={ApiConfig}
      formActions={formActionsPublic}
      fieldKey="spuClassificationId"
      labelCol={8}
      onSuccess={() => {
        dispatchers.getSkuClass();
        props.onSuccess();
      }}
      formatDetail={(values) => {
        return {...values, typeSetting: values.typeSetting && JSON.parse(values.typeSetting)};
      }}
      onSubmit={(value) => {
        return {...value, type: 1};
      }}
    >
      <div style={{maxHeight:'calc(100vh - 170px)',overflow:'auto'}}>
        <ProCard className="h2Card" title="基本信息" headerBordered>
          <Row>
            <Col span={6}>
              <FormItem
                label="上级分类"
                name="pid"
                component={SysField.Pid}
                defaultParams={{data: {isNotproduct: 1}}}
                top
                required />
            </Col>
            <Col span={6}>
              <FormItem label="分类名称" name="name" component={SysField.Name} required />
            </Col>
            <Col span={6}>
              <FormItem
                label={<Space>分类码 <Popover content="分类码用于配置“编码规则”时使用">
                  <QuestionCircleOutlined style={{cursor: 'pointer'}} />
                </Popover></Space>}
                name="codingClass"
                component={SysField.CodingClass}
                rules={[{
                  pattern: '^[A-Z\\d\\+\\-\\*\\/\\(\\)\\%（）]+$',
                  message: '只能输入大写字母或数字！'
                }]} />
            </Col>
            <Col span={6}>
              <FormItem label="排序" name="sort" value={0} component={SysField.Sort} />
            </Col>
          </Row>
        </ProCard>
        <ProCard className="h2Card" title="设置物料表单" headerBordered extra={<Button type="primary" ghost onClick={() => {
          Modal.confirm({
            type:'warn',
            content: '确定要恢复默认吗？',
            onOk: skuFormRef.current.reset,
            okText: '确定',
            cancelText:'取消'
          });
        }}>恢复默认</Button>}>
          <FormItem wrapperCol={24} name="typeSetting" component={SkuForm} skuFormRef={skuFormRef} />
        </ProCard>
      </div>
    </Form>
  );
};

export default SpuClassificationEdit;
