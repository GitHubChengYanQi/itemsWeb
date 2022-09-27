/**
 * 合同模板编辑页
 *
 * @author
 * @Date 2021-07-21 08:22:02
 */

import React, {useImperativeHandle, useRef, useState} from 'react';
import {Alert, Col, Row, Select, Space, Spin} from 'antd';
import {createFormActions} from '@formily/antd';
import ProCard from '@ant-design/pro-card';
import Form from '@/components/Form';
import {excelGetTables, templateAdd, templateDetail, templateEdit} from '../TemplateUrl';
import * as SysField from '../TemplateField';
import {Contacts} from '@/components/Editor/components/Module';
import {useRequest} from '@/util/Request';

const {FormItem} = Form;

const ApiConfig = {
  view: templateDetail,
  add: templateAdd,
  save: templateEdit
};

const formActionsPublic = createFormActions();

const TemplateEdit = ({module, ...props}, ref) => {

  const formRef = useRef();

  const [tables, setTables] = useState([]);

  const [replaceRules, setReplaceRules] = useState([]);

  useImperativeHandle(ref, () => ({
    submit: formRef.current.submit,
  }));

  const {loading, run} = useRequest(excelGetTables, {
    manual: true,
    onSuccess: (res) => {
      setTables(res);
    }
  });

  const getType = (tableIndex, trIndex) => {
    const rule = replaceRules.filter((item) => {
      if (trIndex === undefined) {
        return item.tableIndex === tableIndex;
      }
      return item.tableIndex === tableIndex && item.trIndex === trIndex;
    });
    if (trIndex === undefined) {
      return rule[0] && rule[0].tableType;
    }
    return rule[0] && rule[0].type;
  };

  return (
    <div style={{padding: 16}}>
      <Form
        {...props}
        NoButton={false}
        ref={formRef}
        formActions={formActionsPublic}
        details={(detail) => {
          try {
            run({params: {fileId: detail.fileId}});
            setReplaceRules(JSON.parse(detail.replaceRule).replaceRules);
          } catch (e) {
            // console.log(e);
          }
        }}
        api={ApiConfig}
        labelCol={6}
        fieldKey="templateId"
        onSubmit={(value) => {
          value = {
            ...value,
            module,
            replaceRule: {replaceRules},
          };
          return value;
        }}
      >
        <Row>
          <Col span={12} style={{paddingRight: 24}}>
            <ProCard
              headerBordered
              className="h2Card"
              title="基本信息"
              bodyStyle={{maxHeight: 'calc(100vh - 181px)', overflow: 'auto'}}>
              <FormItem label="合同名" name="name" component={SysField.Name} required />
              <FormItem label="合同分类" name="contractClassId" component={SysField.ContractClassId} required />
              <FormItem
                label="上传合同"
                name="fileId"
                component={SysField.UploadWord}
                required
                onChange={async (value) => {
                  if (value) {
                    const res = await run({params: {fileId: value}});
                    const values = [];
                    res.map((tableItem, tableIndex) => {
                      return tableItem.map((trItem, trIndex) => {
                        return values.push({
                          tableIndex,
                          trIndex,
                          type: 'none',
                          tableType: 'none',
                        });
                      });
                    });
                    setReplaceRules(values);
                  }
                }}
              />
              {loading && <Spin>
                <Alert
                  style={{padding: 32}}
                  message="正在加载合同变量，请稍后..."
                  type="info"
                />
              </Spin>}
              {
                tables.map((tableItem, tableIndex) => {
                  return <div key={tableIndex}>
                    <ProCard
                      headerBordered
                      className="h3Card"
                      title={<Space align="center">
                        第{tableIndex + 1}个表格
                        <Select
                          value={getType(tableIndex)}
                          style={{width: 150}}
                          bordered={false}
                          placeholder="选择替换表格"
                          onChange={(tableType) => {
                            const newValue = replaceRules.map((item) => {
                              if (item.tableIndex === tableIndex) {
                                return {...item, tableType};
                              }
                              return item;
                            });
                            setReplaceRules(newValue);
                          }}
                          options={[
                            {label: '普通替换', value: 'none'},
                            {label: '标的物替换', value: 'sku'},
                            {label: '供应商替换', value: 'supply'},
                            {label: '客户替换', value: 'customer'},
                          ]} />
                      </Space>}
                      bodyStyle={{padding: 0}}
                    >
                      <div className="ant-table">
                        <table
                          key={tableIndex}
                          style={{width: '100%', margin: '16px 0px'}}>
                          <tbody className="ant-table-tbody">{
                            tableItem.map((trItem, trIndex) => {
                              return <tr
                                className="ant-table-row ant-table-row-level-0"
                                key={trIndex}
                              >
                                <td style={{width: 120}} key={trIndex}>
                                  <Select
                                    value={getType(tableIndex, trIndex)}
                                    style={{width: 120}}
                                    bordered={false}
                                    placeholder="选择替换行"
                                    onChange={(type) => {
                                      const newValue = replaceRules.map((item) => {
                                        if (item.tableIndex === tableIndex && item.trIndex === trIndex) {
                                          return {...item, type};
                                        }
                                        return item;
                                      });
                                      setReplaceRules(newValue);
                                    }}
                                    options={[
                                      {label: '普通替换', value: 'none'},
                                      {label: '标的物替换', value: 'sku'},
                                      {label: '付款计划替换', value: 'pay'},
                                    ]} />
                                </td>
                                {trItem.map((tdItem, tdIndex) => {
                                  return <td key={tdIndex}>{tdItem}</td>;
                                })}
                              </tr>;
                            })
                          }</tbody>
                        </table>
                      </div>
                    </ProCard>
                  </div>;
                })
              }
            </ProCard>
          </Col>
          <Col span={12} style={{height: '100%', overflow: 'auto'}}>
            <Contacts />
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default React.forwardRef(TemplateEdit);
