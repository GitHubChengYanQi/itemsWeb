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


const SpuEdit = (props) => {

  const formRef = useRef();

  const history = useHistory();

  const params = props.searchParams.id;

  const {onFieldValueChange$} = FormEffectHooks;

  const [attribute, setAttribute] = useState();

  const [hiddenClass, setHiddenClass] = useState();

  const openNotificationWithIcon = type => {
    notification[type]({
      message: '创建成功！',
    });
  };

  const {loading, run} = useRequest(categoryDetail, {
    manual: true, onSuccess: (res) => {
      setAttribute(res.categoryRequests);
    }
  });


  return (
    <div style={{padding: 16, paddingLeft: 0, paddingTop: 0}}>
      <Card title={params ? '编辑物料信息' : '添加物料信息'} bordered={false}>
        <div style={{maxWidth: 1200, margin: 'auto'}}>
          <Form
            noButton
            value={params || false}
            ref={formRef}
            api={ApiConfig}
            fieldKey="spuId"
            effects={() => {
              onFieldValueChange$('categoryId').subscribe(({value}) => {
                if (value !== undefined && value !== '0') {
                  run({
                    data: {
                      categoryId: value
                    }
                  });
                }
              });
            }}
            onSuccess={() => {
              openNotificationWithIcon('success');
              history.goBack();
            }}
            onSubmit={(value)=>{
              return {...value,isHidden:!hiddenClass,type:0};
            }}
          >
            <Row gutter={24}>
              <Col span={12}>
                <ProCard title="基础信息" className="h2Card" headerBordered extra={
                  <Switch checkedChildren="隐藏类目" unCheckedChildren="显示类目" defaultChecked onChange={(value)=>{
                    setHiddenClass(value);
                  }} />
                }>
                  {hiddenClass && <FormItem label="类目" name="categoryId" component={SysField.CategoryId} required />}
                  <FormItem label="种类名字" name="name" component={SysField.Name} required />
                  <FormItem label="单位" name="unitId" component={SysField.UnitId} required />
                  <FormItem label="分类" name="spuClassificationId" component={SysField.SpuClass} required />
                  <FormItem label="生产类型" name="productionType" component={SysField.Type} required />
                  <FormItem label="养护周期" name="curingCycle" component={SysField.CuringCycle} required />
                </ProCard>
              </Col>
              <Col span={12}>
                <ProCard title="详细信息" className="h2Card" headerBordered>
                  <FormItem label="质保期" name="shelfLife" component={SysField.ShelfLife} />
                  <FormItem label="材质名称" name="materialId" component={SysField.MaterialId} />
                  <FormItem label="易损" name="vulnerability" component={SysField.Vulnerability} />
                  <FormItem label="重要程度" name="important" component={SysField.Important} />
                  <FormItem label="产品重量" name="weight" component={SysField.Weight} />
                  <FormItem label="成本" name="cost" component={SysField.Cost} />
                </ProCard>
              </Col>
            </Row>


            {hiddenClass && <ProCard title="属性信息" className="h2Card" headerBordered>
              {loading ?
                <div style={{textAlign: 'center'}}><Spin size="large" /></div>
                :
                <FormItem name="spuAttributes" component={SysField.Atts} spuId={params} attribute={attribute} />}
            </ProCard>}
            <div style={{textAlign: 'center'}}>
              <Submit showLoading>保存</Submit>
              <Button style={{marginLeft: 16}} onClick={() => {
                history.goBack();
              }}>返回</Button>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default SpuEdit;
