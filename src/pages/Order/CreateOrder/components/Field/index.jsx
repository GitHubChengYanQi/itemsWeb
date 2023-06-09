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
  Descriptions, Tooltip
} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
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
import Empty from '@/components/Empty';
import CheckSku from '@/pages/Order/CreateOrder/components/CheckSku';
import SelectSkusUtil from '@/pages/Erp/sku/components/SelectSkusUtil';
import styles from './index.module.less';

export const orderDetailRecord = {url: '/orderDetail/record', method: 'POST'};

export const AddSku = ({value = [], customerId, brandName, onChange, module, currency}) => {

  const addSpu = useRef();

  const addSku = useRef();

  const addSkuRef = useRef();

  const [sku, setSku] = useState();

  const [skuId, setSkuId] = useState();

  const [required, setRequired] = useState({});

  const {loading, run: getRecord} = useRequest(orderDetailRecord, {manual: true});

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

  const [hidden, setHidden] = useState(true);

  return (<>
    <div className={styles.addSku}>
      {module === 'PO' && <div>
        {hidden ? <div style={{padding: 24}} onClick={() => setHidden(false)}>
          <Tooltip title="搜索物料进行选择">
            <Button type="primary" shape="circle" icon={<SearchOutlined />} />
          </Tooltip>
        </div> : <div className={styles.selectSkus}>
          <SelectSkusUtil
            className={styles.list}
            small
            onSmall={() => {
              setHidden(true);
            }}
            onChange={(sku) => {
              onChange([...value, sku]);
              setTimeout(() => {
                const skuItem = document.getElementById(`addSkuTabl${[...value, sku].length}`);
                skuItem.scrollIntoView({block: 'center', behavior: 'smooth'});
              }, 0);
            }}
          />
        </div>}
      </div>}
      <div style={{width: `calc(100vw - ${hidden ? '80px' : '20vw'} - 300px)`}}>
        <AddSkuTable
          customerId={customerId}
          currency={currency}
          module={module}
          value={value}
          onChange={onChange}
          onAddSku={() => {
            if (module === 'PO') {
              setHidden(false);
            } else {
              setSku(null);
              setSkuId(null);
              addSpu.current.open(true);
            }
          }}
          onCusTomerBind={() => {
            addSku.current.open(true);
          }}
        />
        <div hidden={hidden} style={{height: '100vh'}} />
      </div>
    </div>

    <Modal
      headTitle="供应商绑定物料"
      ref={addSku}
      width={1000}
      footer={<Space>
        <Button onClick={() => {
          onChange(addSkuRef.current.check());
        }}>选中</Button>
        <Button type="primary" onClick={() => {
          onChange(addSkuRef.current.change());
          addSku.current.close();
        }}>选中并关闭</Button>
      </Space>}
    >
      <CheckSku
        value={value}
        ref={addSkuRef}
        customerId={customerId}
      />
    </Modal>

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
      <Spin spinning={loading}>
        <div style={{padding: '24px 10%'}}>
          <AddSpu
            maxHeight="20vh"
            popupContainerBody
            noSpu={module === 'PO'}
            supply={module === 'PO'}
            customerId={customerId}
            onChange={async (skuId, sku) => {
              setSkuId(skuId);
              let record = {};
              if (skuId && customerId && sku) {
                record = await getRecord({
                  data: {
                    customerId,
                    skuId,
                  }
                });
              }
              if (sku) {
                setSku({
                  preordeNumber: 0,
                  ...record,
                  skuId: sku.skuId,
                  coding: sku.standard,
                  unitId: sku.spuResult && sku.spuResult.unitId,
                  skuResult: sku,
                });
              }
            }}
            value={skuId}
          />
          {sku && <Descriptions column={3} className="descriptionsCenter" labelStyle={{width: 100}}>
            <Descriptions.Item label="品牌 / 厂家" span={3}>
              <CheckBrand
                getBrands={(brands) => {
                  if (!sku.brandId) {
                    const brand = brands.find(item => item.label === brandName) || {};
                    setSku({...sku, brandId: brand.value});
                  }
                }}
                placeholder="请选择品牌/厂家"
                width={200}
                value={sku.brandId}
                onChange={async (brandId, option) => {
                  let record = {};
                  if (customerId) {
                    record = await getRecord({
                      data: {
                        customerId,
                        skuId,
                        brandId
                      }
                    });
                  }
                  setSku({...sku, ...record, skuResult: sku.skuResult, brandId, brandResult: option && option.label});
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
                status={required.purchaseNumber || ''}
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
                  setSku({...sku, totalPrice: value, onePrice: value / (sku.purchaseNumber || 0)});
                }}
              />
            </Descriptions.Item>
          </Descriptions>}
        </div>
      </Spin>
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
    placeholder="选择合同模板"
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
  return <FileUpload privateUpload {...props} title="上传合同" />;
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
  return (<Input {...props} />);
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
  return (<InputNumber min={1} {...props} style={{minWidth: 50}} />);
};

export const DeliveryWay = (props) => {
  return (<Input {...props} />);
};

export const LeadTime = (props) => {
  return (<InputNumber {...props} />);
};

export const Note = (props) => {
  return (<Editor width="100%" {...props} />);
};

export const AllField = (
  {
    value: values = [],
    onChange = () => {
    },
    array
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

  const replaceDom = (item, index) => {

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
          <Editor id={`allFieldEditor${index}`} onChange={(value) => {
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
    {values.length === 0 && <Empty />}
  </div>);
};

export const Time = (props) => {
  return <DatePicker {...props} />;
};





