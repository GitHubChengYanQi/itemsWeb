/**
 * 清单编辑页
 *
 * @author
 * @Date 2021-07-14 14:30:20
 */

import React, {useImperativeHandle, useRef, useState} from 'react';
import {Button, message, Select} from 'antd';
import {createFormActions, FormEffectHooks} from '@formily/antd';
import ProCard from '@ant-design/pro-card';
import * as SysField from '../PartsField';
import Form from '@/components/Form';
import {partsDetail, partsAdd} from '../PartsUrl';
import {Codings} from '@/pages/Erp/sku/skuField';
import {request, useRequest} from '@/util/Request';
import {skuDetail} from '@/pages/Erp/sku/skuUrl';
import {spuDetail} from '@/pages/Erp/spu/spuUrl';
import {categoryDetail} from '@/pages/Erp/category/categoryUrl';
import Modal from '@/components/Modal';
import PartsList from '@/pages/Erp/parts/PartsList';

const {FormItem} = Form;

const formActionsPublic = createFormActions();

const ApiConfig = {
  view: partsDetail,
  add: partsAdd,
  save: partsAdd
};

const PartsEdit = ({...props}, ref) => {

  const {spuId, value, spuSkuId, onSuccess, sku, ...other} = props;

  const partsRef = useRef();

  const formRef = useRef(null);

  const {loading: partsLoading, run: parts} = useRequest(partsDetail, {
    manual: true,
    onSuccess: (res) => {
      formRef.current.setFieldValue('parts', res.parts);
    }
  });

  useImperativeHandle(ref, () => ({
    submit: formRef.current.submit,
  }));

  const [type, setType] = useState((!value && spuId) ? 0 : 1);

  return (
    <>
      <div style={{padding: 16}}>
        <Form
          {...other}
          value={value}
          ref={formRef}
          NoButton={false}
          api={ApiConfig}
          formActions={formActionsPublic}
          fieldKey="partsId"
          onError={() => {
          }}
          onSuccess={(res) => {
            onSuccess(res.data);
          }}
          effects={({setFieldState}) => {

            FormEffectHooks.onFieldValueChange$('item').subscribe(async ({value}) => {
              if (value && value.skuId) {
                const res = await request({...skuDetail, data: {skuId: value.skuId}});
                const array = res && res.list && res.list.map((item) => {
                  return {
                    label: item.itemAttributeResult.attribute,
                    value: item.attributeValues
                  };
                });

                setFieldState('showSkuCoding', state => {
                  state.value = res.standard;
                  state.visible = res.standard;
                });

                setFieldState('bom', state => {
                  // state.value = value;
                  // state.visible = value;
                });

                if (Array.isArray(array) && array.length > 0) {
                  setFieldState('showSku', state => {
                    state.value = array;
                    state.visible = value;
                  });
                }
              } else if (value && value.spuId) {
                const res = await request({...spuDetail, data: {spuId: value.spuId}});
                if (res && res.categoryId) {
                  const category = await request({...categoryDetail, data: {categoryId: res.categoryId}});
                  setFieldState('sku', state => {
                    state.props.category = category && category.categoryRequests;
                  });
                }
              }
            });
          }
          }
          onSubmit={(value) => {
            if (!value.parts || value.parts.length === 0) {
              message.warn('请添加物料清单！');
              return false;
            }
            const partsArray = value.parts.filter((item) => {
              return item.number && item.skuId;
            });
            if (partsArray.length !== value.parts.length) {
              message.warn('请添加物料数量！');
              return false;
            }
            return {...value, type: 1, batch: 0, status: 0};
          }}
        >

          <ProCard className="h2Card" headerBordered title="父件信息">
            <FormItem
              visible={false}
              label="物料编码"
              name="showSkuCoding"
              component={SysField.Show}
            />
            <FormItem
              label={
                <Select
                  defaultValue={type}
                  bordered={false}
                  disabled={sku || value || spuId}
                  options={[{label: '产品', value: 0}, {label: '物料', value: 1}]}
                  onChange={(value) => {
                    setType(value);
                  }}
                />
              }
              name="item"
              type={type}
              spuId={spuId}
              disabled={sku || value || spuId}
              component={type ? SysField.Sku : SysField.Spu}
              required
            />

            <FormItem
              visible={false}
              label="物料描述"
              name="showSku"
              component={SysField.ShowSku}
            />

            <FormItem
              visible={false}
              label="上级BOM"
              name="bom"
              component={SysField.Bom}
            />

            {!type && <>
              <FormItem label="编码" name="standard" module={0} component={Codings} required />
              <FormItem
                label="型号"
                name="skuName"
                component={SysField.SkuName}
                required
              />
              <FormItem
                label="配置"
                name="sku"
                title="配置项"
                component={SysField.Attributes}
                required
              />
              <FormItem
                label="规格"
                placeholder="无规格内容可填写“型号”"
                name="specifications"
                component={SysField.SkuName}
              />
              <FormItem label="备注" name="note" component={SysField.Note} />
            </>}
          </ProCard>

          <FormItem
            name="parts"
            loading={partsLoading}
            component={SysField.AddSku}
            extraButton={spuSkuId && <Button onClick={() => {
              partsRef.current.open(spuSkuId);
            }}>拷贝BOM</Button>}
          />
        </Form>
      </div>

      <Modal
        headTitle="拷贝BOM"
        width={800}
        spuSkuId
        component={PartsList}
        getPartsId={(id) => {
          partsRef.current.close();
          parts({
            data: {
              partsId: id,
            }
          });
        }}
        ref={partsRef}
      />

    </>
  );
};

export default React.forwardRef(PartsEdit);
