/**
 * 采购申请字段配置页
 *
 * @author song
 * @Date 2021-12-15 09:35:37
 */

import React, {useRef} from 'react';
import {Button, Input, InputNumber, Select as AntSelect, Space} from 'antd';
import moment from 'moment';
import ProCard from '@ant-design/pro-card';
import SelectSku from '@/pages/Erp/sku/components/SelectSku';
import DatePicker from '@/components/DatePicker';
import Coding from '@/pages/Erp/tool/components/Coding';
import Select from '@/components/Select';
import {unitListSelect} from '@/pages/Erp/spu/spuUrl';
import Modal from '@/components/Modal';
import CheckSku from '@/pages/Erp/sku/components/CheckSku';
import AddSkuTable from '@/pages/Purshase/purchaseAsk/components/AddSkuTable';
import TimePicker from '@/components/TimePicker';

export const AddSku = ({value = [], onChange}) => {

  const ref = useRef();

  const addSkuRef = useRef();

  return (<>
    <ProCard
      style={{marginTop: 24}}
      bodyStyle={{padding: 16}}
      className="h2Card"
      title="采购申请明细"
      headerBordered
      extra={<Button onClick={() => {
        ref.current.open(true);
      }}>批量添加物料</Button>}
    >

      <AddSkuTable
        value={value}
        onChange={onChange}
      />
    </ProCard>

    <Modal
      ref={ref}
      headTitle='添加物料'
      width={1100}
      footer={<Space>
        <Button onClick={() => {
          onChange(addSkuRef.current.check());
        }}>选中</Button>
        <Button type="primary" onClick={() => {
          onChange(addSkuRef.current.change());
          ref.current.close();
        }}>选中并关闭</Button>
      </Space>}
    >
      <CheckSku
        value={value}
        ref={addSkuRef}
      />
    </Modal>
  </>);
};

export const Codings = (props) => {

  return (<Coding {...props} />);
};
export const Type = (props) => {
  return (<AntSelect style={{width: 200}} placeholder="请选择类型" options={[{
    label: '生产采购',
    value: '0',
  }, {
    label: '库存采购',
    value: '1',
  }, {
    label: '行政采购',
    value: '2',
  }, {
    label: '销售采购',
    value: '3',
  }, {
    label: '紧急采购',
    value: '4',
  },]} {...props} />);
};

export const BrandId = ({data, ...props}) => {

  const options = [
    {label: '无指定品牌', value: 0},
    ...(data || []),
  ];

  return (<AntSelect
    options={options}
    {...props}
    allowClear
    showSearch
    filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
  />);
};
export const Note = (props) => {
  return (<Input.TextArea rows={1} placeholder="请输入备注内容" {...props} />);
};
export const SkuId = (props) => {
  return (<SelectSku {...props} dropdownMatchSelectWidth={400} />);
};
export const Status = (props) => {
  return (<AntSelect style={{width: 200}} options={[
    {
      value: -1,
      label: '未审批',
    },
    {
      value: 0,
      label: '审批中',
    },
    {
      value: 2,
      label: '已通过',
    },
    {
      value: 1,
      label: '已拒绝',
    },
    {
      value: 4,
      label: '采购中',
    },
    {
      value: 5,
      label: '已完成',
    },
  ]} {...props} />);
};
export const Money = (props) => {
  return (<Input {...props} />);
};
export const Number = (props) => {
  return (<Input {...props} />);
};
export const TypeNumber = (props) => {
  return (<Input {...props} />);
};
export const Source = (props) => {
  return (<Input {...props} />);
};
export const SourceId = (props) => {
  return (<Input {...props} />);
};
export const CreateTime = (props) => {
  return (<Input {...props} />);
};
export const UpdateTime = (props) => {
  return (<Input {...props} />);
};
export const CreateUser = (props) => {
  return (<Input {...props} />);
};
export const UpdateUser = (props) => {
  return (<Input {...props} />);
};
export const Date = (props) => {
  return (<DatePicker showTime disabledDate={(currentDate) => {
    return currentDate && currentDate < moment().subtract(1, 'days');
  }} {...props} />);
};
export const Time = (props) => {
  return (<TimePicker {...props} />);
};
export const Display = (props) => {
  return (<Input {...props} />);
};
export const LisingNote = (props) => {
  return (<Input.TextArea {...props} />);
};
export const ApplyNumber = (props) => {
  return (<InputNumber min={1} {...props} />);
};

export const AvailableNumber = (props) => {
  return (<InputNumber disabled min={1} {...props} />);
};

export const SelectCoding = (props) => {
  return (<Input {...props} />);
};
export const UnitId = (props) => {
  return (<Select border={false} disabled showArrow={false} api={unitListSelect} width={100} {...props} />);
};
