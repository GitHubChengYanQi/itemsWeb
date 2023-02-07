/**
 * 清单编辑页
 *
 * @author
 * @Date 2021-07-14 14:30:20
 */

import React, {useRef, useState} from 'react';
import {Button, Col, Drawer, message, Row, Select} from 'antd';
import {createFormActions, FormEffectHooks} from '@formily/antd';
import ProCard from '@ant-design/pro-card';
import * as SysField from '../PartsField';
import Form from '@/components/Form';
import {partsAdd, partsDetail, partsV1Detail, partsV2Add} from '../PartsUrl';
import {Codings} from '@/pages/Erp/sku/skuField';
import {request, useRequest} from '@/util/Request';
import {spuDetail} from '@/pages/Erp/spu/spuUrl';
import {categoryDetail} from '@/pages/Erp/category/categoryUrl';
import Modal from '@/components/Modal';
import PartsList from '@/pages/Erp/parts/PartsList';
import {isArray} from '@/util/Tools';
import styles from './index.module.less';

const {FormItem} = Form;

export const partApiConfig = {
  // view: partsV1Detail,
  // add: partsV2Add,
  // save: partsV2Add
  view: partsDetail,
  add: partsAdd,
  save: partsAdd
};

const formActionsPublic = createFormActions();

const PartsEdit = (props) => {

  const {
    spuId,
    value,
    spuSkuId,
    onSuccess,
    sku,
    onFull = () => {
    },
    ...other
  } = props;

  const partsRef = useRef();

  const formRef = useRef(null);

  const [select, setSelect] = useState([]);

  const [open, setOpen] = useState();

  const [full, setFull] = useState();

  const {loading: partsLoading, run: parts} = useRequest(partsV1Detail, {
    manual: true,
    onSuccess: (res) => {
      formRef.current.setFieldValue('parts', isArray(res.parts).map(item => {
        const skuResult = item.skuResult || {};
        return {
          ...skuResult,
          ...item
        };
      }));
    }
  });

  const [type, setType] = useState((!value && spuId) ? 0 : 1);

  return (
    <>
      <div className={styles.edit}>
        <Form
          {...other}
          value={value}
          ref={formRef}
          formatDetail={(values) => {
            // parts
            return {
              ...values,
              parts: isArray(values.parts).map(item => {
                const skuResult = item.skuResult || {};
                const spuResult = skuResult.spuResult || {};
                return {
                  ...skuResult,
                  spuName: spuResult.name,
                  ...item
                };
              })
            };
          }}
          noButton
          api={partApiConfig}
          formActions={formActionsPublic}
          fieldKey="partsId"
          onSuccess={(res) => {
            onSuccess(res.data);
          }}
          effects={({setFieldState}) => {

            FormEffectHooks.onFieldValueChange$('item').subscribe(async ({value}) => {
              if (value && value.spuId) {
                const res = await request({...spuDetail, data: {spuId: value.spuId}});
                if (res && res.categoryId) {
                  const category = await request({...categoryDetail, data: {categoryId: res.categoryId}});
                  setFieldState('sku', state => {
                    state.props.category = category && category.categoryRequests;
                  });
                }
              }
            });
          }}
          onSubmit={(value) => {
            if (!value.parts || value.parts.length === 0) {
              message.warn('请添加物料清单！');
              return false;
            }
            const partsArray = value.parts.filter((item) => {
              return item.skuId;
            });
            if (partsArray.length !== value.parts.length) {
              message.warn('请添加物料数量！');
              return false;
            }
            return {
              ...value,
              ...value.item,
              type: 1,
              batch: 0,
              status: 0,
              partsId: value.partsId || '1',
              parts: isArray(value.parts).map(item => {
                return {
                  ...item,
                  number: item.number || 1,
                  autoOutstock: typeof item.autoOutstock === 'number' ? item.autoOutstock : 1
                };
              })
            };
          }}
        >

          <ProCard className="h2Card" headerBordered title="父件信息">
            <Row>
              <Col span={12}>
                <FormItem
                  required
                  label="版本号"
                  name="name"
                  component={SysField.Name}
                />
              </Col>
              <Col span={12}>
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
              </Col>
            </Row>

            {!type && <>
              <Row>
                <Col span={12}>
                  <FormItem label="编码" name="standard" module={0} component={Codings} required />
                </Col>
                <Col span={12}>
                  <FormItem
                    label="型号"
                    name="skuName"
                    component={SysField.SkuName}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem
                    label="配置"
                    name="sku"
                    title="配置项"
                    component={SysField.Attributes}
                    required
                  />
                </Col>
                <Col span={12}>
                  <FormItem
                    label="规格"
                    placeholder="无规格内容可填写“型号”"
                    name="specifications"
                    component={SysField.SkuName}
                  />
                </Col>
              </Row>
            </>}

            <div hidden={select.length === 0} className={styles.line} />
          </ProCard>

          <ProCard
            bodyStyle={{padding: '0 16px'}}
            className="h2Card"
            title="子件信息"
            extra={<Button onClick={() => {
              partsRef.current.open(spuSkuId || true);
            }}>拷贝BOM</Button>}
          >
            <FormItem
              itemStyle={{margin: 0}}
              name="parts"
              loading={partsLoading}
              onChange={(value) => {
                setSelect(value);
              }}
              openNewEdit={(id) => {
                onFull(true);
                setOpen(id || true);
              }}
              component={SysField.AddSku}
            />
          </ProCard>
        </Form>

        <div
          className={styles.bottom}
        >
          <Button type="primary" onClick={() => {
            formRef.current.submit();
          }}>保存</Button>
        </div>

        <Drawer
          destroyOnClose
          push={false}
          bodyStyle={{padding: 0}}
          width={full ? '100%' : '90%'}
          closable={false}
          onClose={() => {
            onFull(false);
            setOpen(false);
          }}
          open={open}
          getContainer={false}
        >
          <PartsEdit
            value={open === true ? false : open}
            onFull={setFull}
          />
        </Drawer>
      </div>

      <Modal
        headTitle="拷贝BOM"
        width={1200}
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

export default PartsEdit;
