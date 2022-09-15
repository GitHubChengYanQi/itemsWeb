/**
 * 出库单编辑页
 *
 * @author cheng
 * @Date 2021-08-16 10:51:46
 */

import React, {useRef, useState} from 'react';
import {Button, Col, message, Row, Modal as AntModal, Space} from 'antd';
import {MegaLayout} from '@formily/antd';
import ProCard from '@ant-design/pro-card';
import {config} from 'ice';
import Form from '@/components/Form';
import {outstockOrderDetail, outstockOrderAdd, outstockOrderEdit} from '../outstockOrderUrl';
import * as SysField from '../outstockOrderField';
import {useRequest} from '@/util/Request';
import Modal from '@/components/Modal';
import PartsList from '@/pages/Erp/parts/PartsList';
import {partsDetail} from '@/pages/Erp/parts/PartsUrl';
import InputNumber from '@/components/InputNumber';

const {FormItem} = Form;

const ApiConfig = {
  view: outstockOrderDetail,
  add: outstockOrderAdd,
  save: outstockOrderEdit
};


const {wxCp} = config;

const OutstockOrderEdit = ({...props}) => {

  const partsRef = useRef();

  const formRef = useRef();

  const [visible, setVisible] = useState();

  const [number, setNumber] = useState(1);

  const {loading: partsLoading, run: parts} = useRequest(partsDetail, {
    manual: true,
    onSuccess: (res) => {
      const applyDetails = formRef.current.getFieldValue('applyDetails') || [];
      formRef.current.setFieldValue('applyDetails', [...applyDetails, ...res.parts.map((item) => {
        return {
          ...item,
          number: (item.number || 0) * number
        };
      })]);
      setNumber(1);
    }
  });

  return (
    <div style={{padding: 24}}>
      <Form
        {...props}
        ref={formRef}
        api={ApiConfig}
        fieldKey="outstockOrderId"
        wrapperCol={24}
        onSuccess={() => {
          props.onSuccess();
        }}
        onError={() => {

        }}
        onSubmit={(value) => {
          if (!value.applyDetails || value.applyDetails.length === 0) {
            message.warn('请添加出库物料！');
            return false;
          }
          return {...value, url: `${wxCp}OrCode?id=codeId`};
        }}
      >
        <MegaLayout labelWidth={120}>
          <ProCard title="出库信息" className="h2Card" headerBordered>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem label="编码" name="coding" module={2} component={SysField.Codings} required />
              </Col>
              <Col span={8}>
                <FormItem label="仓库" name="storehouseId" component={SysField.Storhouse} required />
              </Col>
              <Col span={8}>
                <FormItem label="负责人" name="userId" component={SysField.UserId} required />
              </Col>
            </Row>


            <FormItem label="备注" name="note" component={SysField.Note} />

          </ProCard>
        </MegaLayout>

        <FormItem
          name="applyDetails"
          loading={partsLoading}
          component={SysField.AddSku}
          cardExtra={<Button onClick={() => {
            partsRef.current.open(false);
          }}>根据BOM添加</Button>}
        />

      </Form>

      <Modal
        headTitle="根据BOM添加"
        width={1000}
        spuSkuId
        component={PartsList}
        getPartsId={(id) => {
          setVisible(id);
        }}
        ref={partsRef}
      />

      <AntModal
        zIndex={9999}
        centered
        title="出库BOM套数"
        open={visible}
        onCancel={() => {
          setNumber(1);
          setVisible(false);
        }}
        onOk={() => {
          setVisible(false);
          partsRef.current.close();
          parts({
            data: {
              partsId: visible,
            }
          });
        }}>
        <Space>
          请输入BOM套数:
          <InputNumber style={{width: '100%'}} placeholder="请输入BOM套数" value={number} onChange={(value) => {
            setNumber(value);
          }} />
        </Space>
      </AntModal>

    </div>

  );
};

export default OutstockOrderEdit;
