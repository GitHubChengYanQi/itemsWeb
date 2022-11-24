/**
 * 编辑页
 *
 * @author
 * @Date 2021-10-18 14:14:21
 */

import React, {useRef, useState} from 'react';
import {
  Affix,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Input,
  notification,
  Row,
  Spin, Switch,
  Table as AntTable,
  Table
} from 'antd';
import Form from '@/components/Form';
import {spuDetail, spuAdd, spuEdit} from '../spuUrl';
import * as SysField from '../spuField';
import ProCard from '@ant-design/pro-card';
import {FormEffectHooks, InternalFieldList as FieldList, Reset, Submit} from '@formily/antd';

import {useRequest} from '@/util/Request';
import {categoryDetail} from '@/pages/Erp/category/categoryUrl';
import {useHistory, useParams} from 'ice';
import {AttributeId} from '../spuField';

const {FormItem} = Form;

const ApiConfig = {
  view: spuDetail,
  add: spuAdd,
  save: spuEdit
};


const SpuEdits = (props) => {

  const formRef = useRef();

  const history = useHistory();



  const openNotificationWithIcon = type => {
    notification[type]({
      message: '创建成功！',
    });
  };



  return (
    <div style={{padding: 16, paddingLeft: 0, paddingTop: 0}}>
      <Card bordered={false}>
        <div style={{maxWidth: 1200, margin: 'auto'}}>
          <Form
            noButton
            {...props}
            ref={formRef}
            api={ApiConfig}
            fieldKey="spuId"
            onSuccess={() => {
              openNotificationWithIcon('success');
              props.onSuccess();
            }}
            onSubmit={(value)=>{
              return {...value,isHidden:true,type:0};
            }}
          >
            <FormItem label="上级分类" name="spuClassificationId" component={SysField.SpuClass} required />
            <FormItem label="种类名字" name="name" component={SysField.Name} required />
            <FormItem label="单位" name="unitId" component={SysField.UnitId} required />
            <div style={{textAlign: 'center'}}>
              <Submit showLoading>保存</Submit>
              <Button style={{marginLeft: 16}} onClick={() => {
                props.onSuccess();
              }}>取消</Button>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default SpuEdits;
