/**
 * 工序表编辑页
 *
 * @author Captain_Jazz
 * @Date 2022-02-10 15:06:02
 */

import React, {useImperativeHandle, useRef} from 'react';
import {Button, Card, Space} from 'antd';
import ProCard from '@ant-design/pro-card';
import {InternalFieldList as FieldList} from '@formily/antd';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import * as SysField from '../shipSetpField';
import {shipSetpDetail, shipSetpAdd, shipSetpEdit} from '../shipSetpUrl';
import Form from '@/components/Form';
import {Codings} from '../shipSetpField';

const {FormItem} = Form;

const ApiConfig = {
  view: shipSetpDetail,
  add: shipSetpAdd,
  save: shipSetpEdit
};

const ShipSetpEdit = ({...props}, ref) => {

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    submit: formRef.current.submit,
  }));

  return (
    <div style={{padding: 16}}>
      <Form
        {...props}
        ref={formRef}
        noButton
        api={ApiConfig}
        labelCol={5}
        onError={() => {
        }}
        onSuccess={() => {
          props.onSuccess();
        }}
        fieldKey="shipSetpId"
      >
        <ProCard title="基本信息" className="h2Card" headerBordered>
          <FormItem label="工序编码" name="coding" component={SysField.Codings} module={10} required />
          <FormItem label="工序名称" name="shipSetpName" component={SysField.ShipSetpName} required />
          <FormItem label="工序分类" name="shipSetpClassId" component={SysField.ShipSetpClassId} required />
          <FormItem label="作业指导" name="sopId" component={SysField.SopId} required />
          <FormItem label="备注" name="remark" component={SysField.Remark} />
        </ProCard>

        <ProCard title="使用工具/设备" className="h2Card" headerBordered>
          <FieldList
            name="binds"
            initialValue={[
              {},
            ]}
          >
            {({state, mutators}) => {
              const onAdd = () => mutators.push();
              return (
                <div>
                  {state.value.map((item, index) => {
                    const onRemove = (removeIndex) => {
                      mutators.remove(removeIndex);
                    };
                    return (
                      <Card
                        style={{marginTop: 8}}
                        headStyle={{border: 'none', borderBottom: 'solid 1px #eee'}}
                        bodyStyle={{padding: 8}}
                        key={index}>
                        <Space size={45}>
                          <FormItem
                            labelCol={6}
                            itemStyle={{margin: 0}}
                            label={`工具${index + 1}`}
                            wrapperCol={18}
                            name={`binds.${index}.fromId`}
                            component={SysField.FormId}
                          />
                          <FormItem
                            labelCol={18}
                            itemStyle={{margin: 0}}
                            label="常用工具"
                            name={`binds.${index}.isCommon`}
                            component={SysField.IsCommon}
                          />
                        </Space>
                        <Button
                          type="link"
                          style={{float: 'right'}}
                          disabled={state.value.length === 1}
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            onRemove(index);
                          }}
                          danger
                        />
                      </Card>
                    );
                  })}
                  <Button
                    type="dashed"
                    style={{marginTop: 8}}
                    icon={<PlusOutlined />}
                    onClick={onAdd}>添加工具</Button>
                </div>
              );
            }}
          </FieldList>
        </ProCard>

      </Form>
    </div>
  );
};

export default React.forwardRef(ShipSetpEdit);
