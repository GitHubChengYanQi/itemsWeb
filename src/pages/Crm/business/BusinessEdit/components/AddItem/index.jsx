/**
 * 项目表编辑页
 *
 * @author cheng
 * @Date 2021-07-19 15:13:58
 */
//
import React, {useImperativeHandle, useRef} from 'react';
import Form from '@/components/Form';
import * as SysField from '../../../crmBusinessDetailed/crmBusinessDetailedField';
import {Button, Col, Divider, Row} from 'antd';
import ProCard from '@ant-design/pro-card';
import Title from '@/components/Title';
import {createFormActions, InternalFieldList as FieldList} from '@formily/antd';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {
  crmBusinessDetailedDetail,
} from '@/pages/Crm/business/crmBusinessDetailed/crmBusinessDetailedUrl';
import {batchAdd, contractDetail} from '@/pages/Erp/items/ItemsUrl';
import {erpPackageTableBatchAdd} from '@/pages/Erp/packageTable/packageTableUrl';
import {BrandId} from '../../../crmBusinessDetailed/crmBusinessDetailedField';


const {FormItem} = Form;

const ApiConfig = {
  view: crmBusinessDetailedDetail,
  add: '',
};

const formActionsPublic = createFormActions();


const AddItem = (props, ref) => {
  if (props.businessId !== undefined) {
    ApiConfig.add = batchAdd;
  } else if (props.contractId !== undefined){
    ApiConfig.add = contractDetail;
  } else if (props.packageId !== undefined) {
    ApiConfig.add = erpPackageTableBatchAdd;
  }
  const formRef = useRef(null);
  const {data} = props;

  useImperativeHandle(ref, () => ({
    formRef
  }));

  const height = () => {
    if (window.document.body.clientHeight < 1088) {
      return 'calc(100vh - 206px)';
    }
    return 650;
  };

  return (
    <>
      <Form
        formActions={formActionsPublic}
        noButton
        {...props}
        ref={formRef}
        api={ApiConfig}
        fieldKey="id"
        onSuccess={() => {
          props.onSuccess();
        }}
      >

        <div style={{height: height(), overflow: 'auto'}}>

          <ProCard style={{marginTop: 8}} title={<Title title="产品明细" level={4} />} headerBordered>
            <Row gutter={1}>
              <Col span={6}>
                {props.businessId !== undefined ? <FormItem
                  label="商机名称"
                  name="businessId"
                  disabled
                  component={SysField.BusinessId}
                  value={props.businessId}
                /> : null}
                {props.packageId !== undefined ? <FormItem
                  label="套餐名称"
                  name="packageId"
                  disabled
                  component={SysField.PackageId}
                  value={props.packageId}
                /> : null}
                {props.contractId !== undefined ? <FormItem
                  label="合同名称"
                  name="contractId"
                  disabled
                  component={SysField.ContractId}
                  value={props.contractId}
                /> : null}
              </Col>
            </Row>
            <FieldList
              name={props.contractId ? 'contractDetailParams' : 'businessDetailedParam'}
              initialValue={data}
            >
              {({state, mutators}) => {
                const onAdd = () => mutators.push();
                return (
                  <div>
                    {state.value.map((item, index) => {
                      const onRemove = index => mutators.remove(index);
                      return (
                        <div key={index}>
                          <div key={index}>
                            <Row gutter={1}>
                              <Col span={6}>
                                <FormItem
                                  label="产品名称"
                                  name={`${props.contractId ? 'contractDetailParams' : 'businessDetailedParam'}.${index}.itemId`}
                                  component={SysField.ItemId}
                                  required
                                  disabled
                                />
                              </Col>
                              <Col span={6}>
                                <FormItem
                                  label="品牌"
                                  item={data.length > 0 && data[index].itemId}
                                  name={`${props.contractId ? 'contractDetailParams' : 'businessDetailedParam'}.${index}.brandId`}
                                  component={SysField.BrandId}
                                  rules={[{
                                    required:true,
                                    message:'暂无品牌'
                                  }]}
                                />
                              </Col>
                              <Col span={6}>
                                <FormItem
                                  label="销售单价"
                                  disabled
                                  name={`${props.contractId ? 'contractDetailParams' : 'businessDetailedParam'}.${index}.salePrice`}
                                  component={SysField.salePrice}
                                  required
                                />
                              </Col>
                              <Col span={4}>
                                <FormItem
                                  label="数量"
                                  name={`${props.contractId ? 'contractDetailParams' : 'businessDetailedParam'}.${index}.quantity`}
                                  component={SysField.Quantity}
                                  required
                                />
                              </Col>
                              <Col span={2}>
                                <Button
                                  type="link" style={{float: 'right'}}
                                  icon={<DeleteOutlined />}
                                  onClick={() => {
                                    onRemove(index);
                                  }}>删除</Button>
                              </Col>

                            </Row>

                          </div>
                          <Divider dashed style={{margin: 0}} />
                        </div>
                      );
                    })}
                    {/*<Button type="link" style={{float: 'right'}} icon={ <PlusOutlined />} onClick={onAdd}>增加报价</Button>*/}
                  </div>
                );
              }}
            </FieldList>
          </ProCard>
        </div>
      </Form>
    </>
  );
};

export default React.forwardRef(AddItem);
