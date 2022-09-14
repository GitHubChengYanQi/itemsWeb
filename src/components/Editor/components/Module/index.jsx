import React from 'react';
import {Button, Card, Radio, Select, Space, Tooltip, Typography} from 'antd';
import {useBoolean, useSetState} from 'ahooks';
import {CheckOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import DefindSelect from '@/components/Editor/components/DefindSelect';


const style = {
  margin: 8,
  width: 200,
  textAlign: 'center',
  padding: 0,
};
const buttonStyle = {
  padding:'8px 16px',
  width:200
};

export const Contacts = () => {
  const grid = (text) => {
    return <Card.Grid style={style}>
      <Typography.Text
        copyable={{
          icon: [<div style={{...buttonStyle,color:'#000'}}>{text}</div>, <div style={buttonStyle}><Space>已复制 <CheckOutlined /></Space></div>],
          text: `\${${text}}`,
          tooltips: false,
        }}
        level={5}
        style={{margin: 0}} />
    </Card.Grid>;
  };

  return <div style={{height: '100%'}}>
    <ProCard className="h2Card" title="合同模板变量" headerBordered bodyStyle={{maxHeight:'calc(100vh - 181px)',overflow:'auto'}}>
      <Space direction="vertical">
        <ProCard className="h3Card" title="合同关联变量" headerBordered bodyStyle={{padding: 0}}>
          <Space wrap>
            {grid('采购合同编号')}
            {grid('合同签订时间')}
            {grid('需方公司名称')}
            {grid('供方公司名称')}
            {grid('提取(交付)地点')}
            {grid('接货人员')}
            {grid('接货人电话')}
          </Space>
        </ProCard>
        <ProCard className="h3Card" title="需方基础变量" headerBordered bodyStyle={{padding: 0}}>
          <Space wrap>
            {grid('需方公司地址')}
            {grid('需方公司电话')}
            {grid('需方公司传真')}
            {grid('需方法人代表')}
            {grid('需方法人电话')}
            {grid('需方委托代表')}
            {grid('需方代表电话')}
            {grid('需方开户银行')}
            {grid('需方银行账号')}
            {grid('需方开户行号')}
            {grid('需方邮政编码')}
            {grid('需方公司电邮')}
            {grid('需方税号')}
            {grid('供货人及电话')}
          </Space>
        </ProCard>
        <ProCard className="h3Card" title="供方基础变量" headerBordered bodyStyle={{padding: 0}}>
          <Space wrap>
            {grid('供方公司地址')}
            {grid('供方公司电话')}
            {grid('供方公司传真')}
            {grid('供方法人代表')}
            {grid('供方法人电话')}
            {grid('供方委托代表')}
            {grid('供方代表电话')}
            {grid('供方开户银行')}
            {grid('供方开户行号')}
            {grid('供方银行账号')}
            {grid('供方邮政编码')}
            {grid('供方公司电邮')}
            {grid('供方税号')}
          </Space>
        </ProCard>
        <ProCard className="h3Card" title="合同标的物变量" headerBordered bodyStyle={{padding: 0}}>
          <Space wrap>
            {grid('单价')}
            {grid('总价')}
            {grid('含税单价')}
            {grid('含税总价')}
            {grid('合计金额大写')}
            {grid('合计金额小写')}
            {grid('序号')}
            {grid('物料编码')}
            {grid('产品名称')}
            {grid('型号规格')}
            {grid('品牌厂家')}
            {grid('单位')}
            {grid('数量')}
            {grid('合计数量')}
            {grid('交货日期')}
            {grid('产品备注')}
            {grid('发票类型')}
            {grid('交货周期')}
          </Space>
        </ProCard>
        <ProCard className="h3Card" title="付款计划变量" headerBordered bodyStyle={{padding: 0}}>
          <Space wrap>
            {grid('付款金额')}
            {grid('付款金额')}
            {grid('日期方式')}
            {grid('付款比例')}
            {grid('付款日期')}
          </Space>
        </ProCard>

        <DefindSelect style={style} buttonStyle={buttonStyle}  />
      </Space>
    </ProCard>
  </div>;
};

export const POSITIONS = ({
  button,
  setButton,
  setTable
}) => {

  const [skuTable, setSkuTable] = useSetState({
    table: [{
      label: '序号',
      value: '序号'
    }]
  });

  const [showSkuTable, {setTrue: showSku, setFalse: closeSku}] = useBoolean();

  const disabled = (value, type) => {
    const skuTableValue = skuTable.table.map((item) => {
      return item.value;
    });
    switch (type) {
      case 'sku':
        return skuTableValue.includes(value);
      default:
        return false;
    }
  };

  const skuTableOptions = [
    {
      label: '序号',
      value: '序号',
      disabled: disabled('序号', 'sku'),
    },
    {
      label: '物料编码',
      value: '物料编码',
      disabled: disabled('物料编码', 'sku'),
    },
    {
      label: '产品名称',
      value: '产品名称',
      disabled: disabled('产品名称', 'sku'),
    },
    {
      label: '型号',
      value: '型号',
      disabled: disabled('型号', 'sku'),
    },
    {
      label: '规格',
      value: '规格',
      disabled: disabled('规格', 'sku'),
    },
  ];

  return <>
    <Radio.Group style={{width: '100%'}} value={button} onChange={(value) => {
      switch (value.target.value) {
        case 'skuTable':
          showSku();
          break;
        default:
          closeSku();
          break;
      }
      setButton(value.target.value);
    }}>
      <ProCard className="h2Card" title="基础变量" bodyStyle={{padding: 0}} headerBordered>
        <Radio.Button value="parent" style={style}>上级库位</Radio.Button>
        <Radio.Button value="name" style={style}>库位名称</Radio.Button>
        <Radio.Button value="qrCode" style={style}>二维码</Radio.Button>
      </ProCard>
      <ProCard
        className="h2Card"
        title="绑定物料"
        headerBordered
        bodyStyle={{padding: 0}}
        extra={<Radio.Button value="skuTable"><Space><PlusOutlined />编辑绑定物料</Space></Radio.Button>}
      >
        {showSkuTable && <div>
          {
            skuTable.table.map((item, index) => {
              return <div key={index} style={{display: 'inline-block', ...style}}>
                <Tooltip
                  placement="top"
                  color="#fff"
                  title={<Button
                    type="link"
                    disabled={skuTable.table.length === 1}
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      const array = skuTable.table.filter((item, itemIndex) => {
                        return itemIndex !== index;
                      });
                      setTable(array);
                      setSkuTable({table: array});
                    }}
                    danger
                  />} key={index}>
                  <Select
                    key={index}
                    style={{width: '100%'}}
                    value={item.value}
                    options={skuTableOptions}
                    onChange={(value, option) => {
                      const array = skuTable.table;
                      array[index] = option;
                      setTable(array);
                      setSkuTable({table: array});
                    }} />
                </Tooltip>
              </div>;
            })
          }
          <Button style={{marginLeft: 8}} onClick={() => {
            skuTable.table.push({});
            setSkuTable({...skuTable});
          }}><PlusOutlined /></Button>
        </div>}
      </ProCard>
    </Radio.Group>
  </>;
};

export const PHYSICALDETAIL = (
  {
    button,
    setButton
  }) => {
  return <>
    <Radio.Group style={{width: '100%'}} value={button} onChange={(value) => {
      setButton(value.target.value);
    }}>
      <Radio.Button style={style} value="物料编码">物料编码</Radio.Button>
      <Radio.Button style={style} value="产品名称">产品名称</Radio.Button>
      <Radio.Button style={style} value="型号">型号</Radio.Button>
      <Radio.Button style={style} value="规格">规格</Radio.Button>
      <Radio.Button style={style} value="品牌">品牌</Radio.Button>
      <Radio.Button style={style} value="供应商">供应商</Radio.Button>
      <Radio.Button style={style} value="qrCode">二维码</Radio.Button>
    </Radio.Group>
  </>;
};
