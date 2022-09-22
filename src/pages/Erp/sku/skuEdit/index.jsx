/**
 * sku表编辑页
 *
 * @author
 * @Date 2021-10-18 14:14:21
 */

import React, {useImperativeHandle, useRef, useState} from 'react';
import {createFormActions, FormEffectHooks} from '@formily/antd';
import {notification, Popover, Space} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';
import Form from '@/components/Form';
import {skuDetail, skuAdd, skuEdit, skuMarge} from '../skuUrl';
import * as SysField from '../skuField';
import {request} from '@/util/Request';
import {spuDetail} from '@/pages/Erp/spu/spuUrl';
import BrandIds from '@/pages/Erp/brand/components/BrandIds';
import {isArray, isObject} from '@/util/Tools';

const {FormItem} = Form;

const formActionsPublic = createFormActions();

const SkuEdit = ({...props}, ref) => {

  const {
    value={},
    addUrl,
    onRepeat = () => {
    },
    ...other
  } = props;

  const [copy, setCopy] = useState();

  const [submitValue, setSubmitValue] = useState({});

  let save = '';

  if (value.copy) {
    save = skuAdd;
  } else if (value.merge) {
    save = skuMarge;
  } else {
    save = skuEdit;
  }

  const ApiConfig = {
    view: skuDetail,
    add: addUrl || skuAdd,
    save
  };

  const formRef = useRef();

  const [details, setDetails] = useState();

  const [next, setNext] = useState();

  const openNotificationWithIcon = type => {
    notification[type]({
      message: type === 'success' ? '保存成功！' : '保存失败!',
    });
  };

  const nextAdd = async (next) => {
    await setNext(next);
    await formRef.current.submit();
  };

  const copyAdd = async () => {
    await setCopy(true);
    await formRef.current.submit();
  };

  useImperativeHandle(ref, () => ({
    nextAdd,
    copyAdd,
  }));

  return (
    <div style={{padding: 16}}>
      <Form
        {...other}
        value={value.skuId || false}
        ref={formRef}
        formActions={formActionsPublic}
        defaultValue={{
          'spu': value.spuResult,
          ...(value.defaultValue || {}),
        }}
        api={ApiConfig}
        NoButton={false}
        fieldKey="skuId"
        details={(res) => {
          setDetails(res);
        }}
        onError={() => {
          openNotificationWithIcon('error');
        }}
        onSuccess={(res) => {
          if (res.errCode === 1001) {
            onRepeat(res.data, {...submitValue, errKey: value.errKey});
            return;
          }
          openNotificationWithIcon('success');
          if (!next) {
            props.onSuccess(res.data, value);
          } else {
            formRef.current.reset();
          }
        }}
        onSubmit={(submitValue) => {
          submitValue = {
            ...submitValue,
            type: 0,
            isHidden: true,
            skuId: value.copy ? null : value.skuId,
            oldSkuId: copy ? value.skuId : null,
            spu: {...submitValue.spu, coding: submitValue.spuCoding}
          };
          setSubmitValue(submitValue);
          return submitValue;
        }}
        effects={async () => {

          const {setFieldState} = createFormActions();

          FormEffectHooks.onFieldValueChange$('spu').subscribe(async ({value}) => {
            if (value && value.spuId) {
              const spu = await request({...spuDetail, data: {spuId: value.spuId}});

              setFieldState(
                'unitId',
                state => {
                  state.value = spu.unitId;
                }
              );

              setFieldState(
                'spuClass',
                state => {
                  state.value = spu.spuClassificationId;
                }
              );

              setFieldState(
                'spuCoding',
                state => {
                  state.value = spu.coding;
                  state.props.disabled = spu.coding;
                }
              );
            } else {
              setFieldState(
                'spuCoding',
                state => {
                  state.props.disabled = false;
                }
              );
            }
          });


          FormEffectHooks.onFieldValueChange$('spuClass').subscribe(({value: spuClassId,inputed}) => {
            if (inputed){
              setFieldState(
                'spu',
                state => {
                  state.props.classId = spuClassId;
                }
              );
            }

          });

        }}
      >
        <FormItem
          label="物料编码"
          name="standard"
          copy={value.copy}
          data={value}
          placeholder="请输入自定义物料编码"
          component={SysField.Codings}
          module={0}
        />
        <FormItem
          label="物料分类"
          name="spuClass"
          placeholder="请选择所属分类"
          component={SysField.SpuClass}
          required />
        <FormItem
          label="产品名称"
          skuId={value.skuId}
          name="spu"
          component={SysField.SpuId}
          required />
        <FormItem
          label="产品码"
          name="spuCoding"
          component={SysField.SpuCoding}
        />
        <FormItem
          label="型号"
          // label="型号"
          name="skuName"
          placeholder="型号"
          component={SysField.SkuName}
          required />
        <FormItem
          label="单位"
          name="unitId"
          component={SysField.UnitId}
          required />
        <FormItem
          label="二维码生成方式"
          name="batch"
          component={SysField.Batch}
          required
        />
        <FormItem
          label="规格"
          // label="规格"
          placeholder="请输入规格"
          name="specifications"
          component={SysField.Specs}
        />
        <FormItem
          label="养护周期"
          placeholder="请输入养护周期"
          name="maintenancePeriod"
          component={SysField.MaintenancePeriod}
        />
        <FormItem
          label="物料描述"
          skuId={value.skuId}
          name="sku"
          value={isArray(value.skuJsons).length > 0 ? value.skuJsons.map((items) => {
            return {
              label: isObject(items.attribute).attribute,
              value: isObject(items.values).attributeValues,
              disabled: true,
            };
          }) : []}
          details={details && details.skuTree}
          component={SysField.Specifications}
        />
        <FormItem
          label="品牌"
          name="brandIds"
          component={BrandIds}
        />
        <FormItem
          label="备注"
          name="remarks"
          placeholder="请输入备注"
          component={SysField.Note}
        />
        <FormItem
          label={<Space>
            附件
            <Popover content="附件支持类型：JPG/JPEG/PDF/DOC/DOCX/XLSX，最大不超过10MB">
              <QuestionCircleOutlined style={{cursor: 'pointer'}} />
            </Popover>
          </Space>}
          name="fileId"
          component={SysField.FileId} />
        <FormItem
          label={<Space>
            物料图片
            <Popover content="附件支持类型：JPG/JPEG/PDF/DOC/DOCX/XLSX，最大不超过10MB">
              <QuestionCircleOutlined style={{cursor: 'pointer'}} />
            </Popover>
          </Space>}
          name="images"
          component={SysField.Img} />
        <FormItem
          label={<Space>
            关联图纸
            <Popover content="附件支持类型：JPG/JPEG/PDF/DOC/DOCX/XLSX，最大不超过10MB">
              <QuestionCircleOutlined style={{cursor: 'pointer'}} />
            </Popover>
          </Space>}
          name="drawing"
          component={SysField.Bind} />
      </Form>
    </div>
  );
};

export default React.forwardRef(SkuEdit);
