/**
 * sku表编辑页
 *
 * @author
 * @Date 2021-10-18 14:14:21
 */

import React, {useImperativeHandle, useRef, useState} from 'react';
import {createFormActions, FormEffectHooks} from '@formily/antd';
import {Alert, Input, notification, Popover, Space, Spin} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';
import Form from '@/components/Form';
import {skuDetail, skuAdd, skuEdit, skuMarge} from '../skuUrl';
import * as SysField from '../skuField';
import {request, useRequest} from '@/util/Request';
import {spuDetail} from '@/pages/Erp/spu/spuUrl';
import BrandIds from '@/pages/Erp/brand/components/BrandIds';
import {isArray, isObject} from '@/util/Tools';
import {spuClassificationDetail} from '@/pages/Erp/spu/components/spuClassification/spuClassificationUrl';
import MaterialIds from '@/pages/Erp/material/MaterialIds';

const {FormItem} = Form;

const formActionsPublic = createFormActions();

const SkuEdit = ({...props}, ref) => {

  const {
    value = {},
    addUrl,
    onRepeat = () => {
    },
    ...other
  } = props;

  const [copy, setCopy] = useState();

  const [submitValue, setSubmitValue] = useState({});

  const [typeSetting, setTypeSetting] = useState([]);

  const [formData, setFormData] = useState([]);

  const {loading: skuFormLoading, run: getSkuForm} = useRequest(spuClassificationDetail, {
    manual: true,
    onSuccess: (res) => {
      setTypeSetting(res && res.typeSetting && JSON.parse(res.typeSetting) || []);
    }
  });

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
        api={ApiConfig}
        NoButton={false}
        fieldKey="skuId"
        formatDetail={(res) => {
          setDetails(res);
          return {
            ...res,
            materialId: isArray(res.materialIdList)[0],
            spu: res.spuResult,
            brandIds: isArray(res.brandResults).map(item => item.brandId),
          };
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
            materialId: submitValue.materialId ? [submitValue.materialId] : [],
            skuId: value.copy ? null : value.skuId,
            oldSkuId: copy ? value.skuId : null,
            spu: {...submitValue.spu, coding: submitValue.spuCoding},
            skuName: submitValue.nationalStandard || submitValue.model || submitValue.partNo,
            generalFormDataParams: formData,
          };
          setSubmitValue(submitValue);
          return submitValue;
        }}
        effects={async () => {

          const {setFieldState} = createFormActions();

          FormEffectHooks.onFieldValueChange$('spu').subscribe(async ({value, inputed}) => {
            if (value && value.spuId) {
              const spu = await request({...spuDetail, data: {spuId: value.spuId}});

              setFieldState(
                'unitId',
                state => {
                  state.value = spu.unitId;
                }
              );

              // setFieldState(
              //   'spuClass',
              //   state => {
              //     state.value = spu.spuClassificationId;
              //   }
              // );

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


          FormEffectHooks.onFieldValueChange$('spuClass').subscribe(({value, inputed}) => {
            if (inputed) {
              setFieldState(
                'spu',
                state => {
                  state.props.classId = value;
                }
              );
            }

            if (value) {
              setTimeout(() => {
                getSkuForm({data: {spuClassificationId: value}});
              }, 1);
            }

          });

        }}
      >
        <FormItem
          label="物料分类"
          name="spuClass"
          placeholder="请选择所属分类"
          triggerType="onBlur"
          component={SysField.SpuClass}
          required
        />
        {skuFormLoading ? <Spin>
          <Alert
            style={{padding: 32}}
            message="正在加载物料表单，请稍后..."
            type="info"
          />
        </Spin> : typeSetting.map((item, index) => {

          if (!item.show || item.disabled) {
            return <div key={index} />;
          }
          let formItemProps;
          switch (item.key) {
            case 'unitId':
              formItemProps = {
                placeholder: `请选择${item.filedName}`,
                component: SysField.UnitId,
                required: true,
              };
              break;
            case 'standard':
              formItemProps = {
                component: SysField.Codings,
                copy: value.copy,
                data: value,
                module: 0,
                rules: [{message: '不能输入汉字或特殊字符!', pattern: /^[a-zA-Z0-9_]{0,}$/}]
              };
              break;
            case 'spu':
              formItemProps = {
                component: SysField.SpuId,
                required: true,
                skuId: value.skuId,
              };
              break;
            case 'spuCoding':
              formItemProps = {
                component: Input,
                rules: [{message: '不能输入汉字或特殊字符!', pattern: /^[a-zA-Z0-9_]{0,}$/}]
              };
              break;
            case 'batch':
              formItemProps = {
                placeholder: `请选择${item.filedName}`,
                component: SysField.Batch,
                required: true,
              };
              break;
            case 'maintenancePeriod':
              formItemProps = {
                component: SysField.MaintenancePeriod,
              };
              break;
            case 'weight':
              formItemProps = {
                component: SysField.Weight,
              };
              break;
            case 'sku':
              formItemProps = {
                component: SysField.Specifications,
                value: isArray(value.skuJsons).length > 0 ? value.skuJsons.map((items) => {
                  return {
                    label: isObject(items.attribute).attribute,
                    value: isObject(items.values).attributeValues,
                    disabled: true,
                  };
                }) : [],
                details: details && details.skuTree
              };
              break;
            case 'brandIds':
              formItemProps = {
                component: BrandIds,
              };
              break;
            case 'materialId':
              formItemProps = {
                placeholder: `请选择${item.filedName}`,
                component: SysField.Material,
              };
              break;
            case 'remarks':
              formItemProps = {
                component: SysField.Note,
              };
              break;
            case 'skuSize':
              formItemProps = {
                component: SysField.SkuSize,
              };
              break;
            case 'fileId':
              formItemProps = {
                label: <Space>
                  附件
                  <Popover content="附件支持类型：JPG/JPEG/PDF/DOC/DOCX/XLSX，最大不超过10MB">
                    <QuestionCircleOutlined style={{cursor: 'pointer'}} />
                  </Popover>
                </Space>,
                component: SysField.FileId,
              };
              break;
            case 'images':
              formItemProps = {
                label: <Space>
                  物料图片
                  <Popover content="附件支持类型：JPG/JPEG/PDF/DOC/DOCX/XLSX，最大不超过10MB">
                    <QuestionCircleOutlined style={{cursor: 'pointer'}} />
                  </Popover>
                </Space>,
                component: SysField.Img,
              };
              break;
            case 'drawing':
              formItemProps = {
                label: <Space>
                  关联图纸
                  <Popover content="附件支持类型：JPG/JPEG/PDF/DOC/DOCX/XLSX，最大不超过10MB">
                    <QuestionCircleOutlined style={{cursor: 'pointer'}} />
                  </Popover>
                </Space>,
                component: SysField.Bind,
              };
              break;
            default:
              formItemProps = {
                fieldName: item.key,
                component: SysField.SkuName,
                required: false,
                onChange: (value) => {

                  setFormData((formData) => {
                    let exits = false;
                    const newFormData = formData.map(formDataItem => {
                      if (formDataItem.fieldName === item.key) {
                        exits = true;
                        return {...formDataItem, value};
                      }
                      return formDataItem;
                    });
                    if (!exits) {
                      newFormData.push({fieldName: item.key, value});
                    }
                    return newFormData;
                  });
                }
              };
              break;
          }
          return <FormItem
            triggerType="onBlur"
            key={index}
            label={item.filedName}
            name={item.key}
            placeholder={`请输入${item.filedName}`}
            {...formItemProps}
          />;
        })}
      </Form>
    </div>
  );
};

export default React.forwardRef(SkuEdit);
