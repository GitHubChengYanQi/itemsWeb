/**
 * 询价任务字段配置页
 *
 * @author cheng
 * @Date 2022-01-17 09:29:56
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  Input,
  Radio,
  Spin,
  Select as AntSelect,
  Button,
  Space,
  AutoComplete,
  Descriptions
} from 'antd';
import Coding from '@/pages/Erp/tool/components/Coding';
import DatePicker from '@/components/DatePicker';
import {useRequest} from '@/util/Request';
import Modal from '@/components/Modal';
import {adressIdSelect} from '@/pages/Crm/adress/AdressUrl';
import SetSelectOrCascader from '@/components/SetSelectOrCascader';
import {templateListSelect} from '@/pages/Crm/template/TemplateUrl';
import Editor from '@/components/Editor';
import AddSkuTable from '@/pages/Order/CreateOrder/components/AddSkuTable';
import InputNumber from '@/components/InputNumber';
import AddSpu from '@/pages/Order/CreateOrder/components/AddSpu';
import {unitListSelect} from '@/pages/Erp/spu/spuUrl';
import UpLoadImg from '@/components/Upload';
import TemplateEdit from '@/pages/Crm/template/TemplateEdit';
import contactsEdit from '@/pages/Crm/contacts/ContactsEdit';
import Select from '@/components/Select';
import CheckBrand from '@/pages/Erp/brand/components/CheckBrand';
import Message from '@/components/Message';
import SelectCreate from '@/components/SelectCreate';
import FileUpload from '@/components/FileUpload';

export const orderDetailRecord = {url: '/orderDetail/record', method: 'POST'};

export const AddSku = ({value = [], customerId, brandName, onChange, module, currency}) => {

  const addSpu = useRef();

  const [sku, setSku] = useState();

  const [skuId, setSkuId] = useState();

  const [required, setRequired] = useState({});

  const {loading, run: getRecord} = useRequest(orderDetailRecord, {
    manual: true,
    onSuccess: (res) => {
      if (res){
        setSku({...sku,...res});
      }
    }
  });

  const requiredFiled = () => {
    if (!sku.purchaseNumber) {
      setRequired({...required, purchaseNumber: 'error'});
      Message.warning('请输入数量！');
      return false;
    }
    if (!sku.onePrice) {
      setRequired({...required, onePrice: 'error'});
      Message.warning('请输入单价！');
      return false;

    }
    return true;
  };

  return (<>
    <AddSkuTable
      currency={currency}
      module={module}
      value={value}
      onChange={onChange}
      onAddSku={() => {
        setSku(null);
        setSkuId(null);
        addSpu.current.open(true);
      }}
    />

    <Modal
      headTitle="物料选择"
      ref={addSpu}
      width={800}
      footer={<Space>
        <Button onClick={() => {
          addSpu.current.close();
        }}>取消</Button>
        <Button type="primary" ghost disabled={!sku} onClick={() => {
          if (requiredFiled()) {
            onChange([...value, sku]);
            addSpu.current.close();
          }
        }}>完成并关闭</Button>
        <Button type="primary" disabled={!sku} onClick={() => {
          if (requiredFiled()) {
            onChange([...value, sku]);
            setSku(null);
          }
        }}>完成并添加下一个</Button>
      </Space>}
    >
      <div style={{padding: '24px 10%'}}>
        <AddSpu
          supply={module === 'PO'}
          customerId={customerId}
          onChange={(skuId, sku) => {
            setSkuId(skuId);
            if (skuId && customerId){
              getRecord({
                data: {
                  customerId,
                  skuId,
                }
              });
            }
            if (sku) {
              setSku({
                skuId: sku.skuId,
                coding: sku.standard,
                skuResult: sku,
                preordeNumber: 0,
                unitId: sku.spuResult && sku.spuResult.unitId,
              });
            }
          }}
          value={skuId}
        />
        {sku && <Descriptions column={3} className="descriptionsCenter" labelStyle={{width: 100}}>
          <Descriptions.Item label="品牌 / 厂家" span={3}>
            <CheckBrand
              getBrands={(brands) => {
                const brand = brands.find(item => item.label === brandName) || {};
                setSku({...sku, brandId: brand.value});
              }}
              placeholder="请选择品牌/厂家"
              width={200}
              value={sku.brandId}
              onChange={(brandId, option) => {
                if (customerId){
                  getRecord({
                    data: {
                      customerId,
                      skuId,
                      brandId
                    }
                  });
                }
                setSku({...sku, brandId, brandResult: option && option.label});
              }} />
          </Descriptions.Item>
          <Descriptions.Item label="单位" span={3}>
            <Select
              width={100}
              placeholder="请选择单位"
              api={unitListSelect}
              value={sku.unitId}
              onChange={(value) => {
                setSku({...sku, unitId: value});
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label={<div><span className="red">*</span>{module === 'SO' ? '销售数量' : '采购数量'}</div>}>
            <InputNumber
              width={100}
              status={required.purchaseNumber}
              placeholder="请输入数量"
              value={sku.purchaseNumber}
              min={0}
              onChange={(value) => {
                setRequired({...required, purchaseNumber: ''});
                setSku({
                  ...sku,
                  purchaseNumber: value,
                  totalPrice: (sku.onePrice || 0) * (value || 0),
                });
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label={<div><span className="red">*</span>{`单价(${currency})`}</div>}>
            <InputNumber
              width={100}
              status={required.onePrice}
              placeholder="请输入单价"
              precision={2}
              min={0}
              value={sku.onePrice}
              onChange={(value) => {
                setRequired({...required, onePrice: ''});
                setSku({
                  ...sku,
                  onePrice: value,
                  totalPrice: (sku.purchaseNumber || 0) * (value || 0),
                });
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label={`总价(${currency})`}>
            <InputNumber
              width={100}
              placeholder="请输入总价"
              precision={2}
              min={1}
              value={sku.totalPrice}
              onChange={(value) => {
                setSku({...sku, totalPrice: value});
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="交货期(天)" span={3}>
            <InputNumber
              width={100}
              placeholder="请输入交货期"
              min={1}
              value={sku.deliveryDate}
              onChange={(value) => {
                setSku({...sku, deliveryDate: value});
              }}
            />
          </Descriptions.Item>
        </Descriptions>}
      </div>
    </Modal>
  </>);
};

export const Name = (props) => {
  return (<Input  {...props} />);
};

export const Show = ({value}) => {
  return (<>{value || '无'}</>);
};

export const Codings = (props) => {
  return (<Coding  {...props} />);
};

export const Date = (props) => {
  return (<DatePicker {...props} />);
};


export const PayTime = (props) => {
  return (<DatePicker showTime {...props} />);
};


export const Remark = (props) => {
  return (<Input.TextArea rows={4} placeholder="请输入采购单备注" {...props} />);
};

export const Currency = (props) => {
  const {loading, data} = useRequest({
    url: '/Enum/money',
    method: 'GET'
  }, {
    onSuccess: () => {
      props.onChange('人民币');
    }
  });

  if (loading) {
    return <Spin />;
  }
  const options = data ? data.map((item) => {
    return {
      label: item.name,
      value: item.name,
    };
  }) : [];

  return (<AntSelect style={{width: 100}} options={options} {...props} />);
};

export const Money = (props) => {
  return (<InputNumber min={0} precision={2} {...props} />);
};

export const Float = (props) => {
  return (<InputNumber min={null} precision={2} {...props} />);
};

export const PayMoney = (props) => {

  const {value, onChange} = props;

  return (<InputNumber
    min={0}
    value={value}
    onBlur={onChange}
  />);
};

export const Index = (props) => {
  return (<></>);
};

export const userId = (props) => {
  const {customerId, ...other} = props;
  return (customerId ? <SetSelectOrCascader
    placeholder="请选择交货人"
    width={200}
    customer={customerId}
    api={adressIdSelect}
    data={{customerId}}
    title="添加其他地址"
    component={contactsEdit} {...other} /> : '请选择甲方公司');
};

export const PayPlan = (props) => {

  const {loading, data, ...other} = props;

  const style = {borderTop: 'dashed 1px #d9d9d9'};

  if (loading) {
    return <Spin />;
  }

  return (<AntSelect
    {...other}
    placeholder="请选择付款计划"
  >
    {
      data && data.map((item, index) => {
        return <AntSelect.Option key={index} value={item.value}>{item.label}</AntSelect.Option>;
      })
    }
    <AntSelect.Option key={99} value={2} style={style}>按时间分期付款</AntSelect.Option>
    <AntSelect.Option key={98} value={3} style={style}>按动作分期付款</AntSelect.Option>
    <AntSelect.Option key={97} value={4} style={style}>其他模板</AntSelect.Option>
  </AntSelect>);
};

export const PayType = (props) => {
  return (<AntSelect
    style={{width: 120}}
    options={[{
      label: '订单创建后',
      value: 0,
    }, {
      label: '合同签订后',
      value: 1,
    }, {
      label: '订单发货前',
      value: 2,
    }, {
      label: '订单发货后',
      value: 3,
    }, {
      label: '入库后',
      value: 4,
    }]}
    {...props}
  />);
};

export const Percentum = (props) => {

  const {value, onChange} = props;

  return (<InputNumber
    min={1}
    max={100}
    addonAfter="%"
    value={value}
    onBlur={onChange}
  />);
};

export const TemplateId = (props) => {

  return <SelectCreate
    component={TemplateEdit}
    title="创建合同"
    width="100vw"
    createTitle="创建合同"
    api={templateListSelect}
    response={(res) => {
      return res.data;
    }}
    {...props}
  />;
};

export const Upload = (props) => {
  return <FileUpload {...props} title="上传合同" />;
};

export const Freight = (props) => {
  return (<Radio.Group {...props}>
    <Radio value={1}>是</Radio>
    <Radio value={0}>否</Radio>
  </Radio.Group>);
};


export const GenerateContract = (props) => {
  return (<Radio.Group {...props}>
    <Radio value={1}>生成合同</Radio>
    <Radio value={0}>无合同</Radio>
    <Radio value={2}>上传合同</Radio>
  </Radio.Group>);
};

export const PayMethod = (props) => {
  return (<Input placeholder="请输入 现金/承兑/电汇" {...props} />);
};

export const DateWay = (props) => {
  return (<AntSelect
    options={[{
      label: '天',
      value: 0,
    }, {
      label: '月',
      value: 1,
    }, {
      label: '年',
      value: 2,
    }]}
    {...props}
  />);
};

export const dateNumber = (props) => {
  return (<InputNumber min={1} {...props} />);
};

export const DeliveryWay = (props) => {
  return (<Input placeholder="请输入交货方式" {...props} />);
};

export const LeadTime = (props) => {
  return (<InputNumber placeholder="请输入交货期" {...props} />);
};

export const Note = (props) => {
  return (<Editor width="100%" {...props} />);
};

export const AllField = ({
  value: values = [], onChange = () => {
  }, array
}) => {

  useEffect(() => {
    if (array && Array.isArray(array)) {
      const newValues = array.map((item) => {
        const detail = item.detail || [];
        const defaultVal = detail.filter(detailItem => detailItem.isDefault === 1);
        let value = '';
        if (item.isHidden) {
          value = `${item.name}：${defaultVal[0] ? defaultVal[0].name : ''}`;
        } else {
          value = defaultVal[0] ? defaultVal[0].name : '';
        }
        return {
          ...item,
          value
        };
      });
      onChange(newValues);
    }
  }, [array]);

  const valuesChange = (name, value) => {
    const newValues = values.map((item) => {
      if (item.name === name) {
        return {
          ...item,
          value: item.isHidden ? `${item.name}：${value || ''}` : value
        };
      }
      return item;
    });
    onChange(newValues);
  };

  const replaceDom = (item) => {

    const detail = item.detail || [];

    const defaultVal = detail.find(detailItem => detailItem.isDefault === 1) || {};

    switch (item.type) {
      case 'input':
        return <AutoComplete
          style={{width: '30vw'}}
          defaultValue={defaultVal.name}
          onChange={(value) => {
            valuesChange(item.name, value);
          }}
          options={detail.map((item) => {
            return {
              label: item.name,
              value: item.name,
            };
          })}
        >
          <Input
            placeholder="输入文本"
          />
        </AutoComplete>;
      case 'number':
        return <div>
          <InputNumber
            placeholder="输入数值"
            style={{width: '30vw', margin: '0 10px'}}
            onChange={(value) => {
              valuesChange(item.name, value);
            }}
          />
        </div>;
      case 'date':
        return <div>
          <DatePicker
            showTime
            placeholder="输入时间"
            style={{width: '30vw', margin: '0 10px'}}
            onChange={(value) => {
              valuesChange(item.name, value);
            }}
          />
        </div>;
      case 'img':
        return <div>
          <UpLoadImg onChange={(value, id) => {
            valuesChange(item.name, id);
          }} />
        </div>;
      case 'editor':
        return <div>
          <Editor onChange={(value) => {
            valuesChange(item.name, value);
          }} />
        </div>;
      default:
        return <></>;
    }
  };
  if (!array) {
    return <></>;
  }

  return (<div>
    <Descriptions style={{width: '85vw'}} bordered column={2} labelStyle={{minWidth: 150}} title="合同模板中的其他字段">
      {
        values.map((item, index) => {
          return <Descriptions.Item key={index} label={item.name}>
            {replaceDom(item, index)}
          </Descriptions.Item>;
        })
      }
    </Descriptions>
  </div>);
};

export const Time = (props) => {
  return <DatePicker showTime {...props} />;
};





