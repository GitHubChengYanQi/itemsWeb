import {Button, Dropdown, Menu, Popover} from 'antd';
import React, {useRef, useState} from 'react';
import {DownOutlined} from '@ant-design/icons';
import FastCreateCustomer from '@/pages/Crm/customer/components/FastCreateCustomer';
import CreateNewCustomer from '@/pages/Crm/customer/components/CreateNewCustomer';


const AddCustomerButton = (props) => {


  const {onChange, supply, data} = props;

  const ref = useRef(null);

  const [visible, setVisible] = useState(false);

  const [drow, setDrow] = useState();

  const menu = (
    <Menu
      style={{padding: 0}}
      items={[{
        key: '1',
        label: <Button ghost type="primary" style={{borderBottom: 'none', width: '100%'}} onClick={() => {
          setDrow(false);
          ref.current.open(false);
        }}>{supply ? '创建供应商' : '创建客户'}</Button>,
        style: {padding: 0}
      }, {
        style: {padding: 0},
        key: '2',
        label: <Popover placement="rightTop" open={visible} onOpenChange={(visible) => {
          setVisible(visible);
        }} content={<FastCreateCustomer
          data={data}
          close={() => {
            setDrow(false);
            setVisible(false);
          }}
          supply={supply}
          add={(value) => {
            setDrow(false);
            setVisible(false);
            onChange(value);
          }} />} trigger="click">
          <Button ghost type="primary" style={{width: '100%'}} onClick={() => {
            setVisible(true);
          }}>快速创建</Button>
        </Popover>,
      },]}
    />
  );


  return (
    <>
      <Dropdown trigger="click" overlay={menu} destroyPopupOnHide open={drow} onOpenChange={(visible) => {
        setDrow(visible);
      }
      }>
        <Button type="primary">
          {supply ? '新建供应商' : '新建客户'} <DownOutlined />
        </Button>
      </Dropdown>


      <CreateNewCustomer
        data={data}
        title={supply ? '供应商' : '客户'}
        supply={supply}
        widths={1200}
        onSuccess={() => {
          ref.current.close();
        }}
        ref={ref}
        onChange={(res) => {
          onChange(res.data);
        }} />
    </>
  );
};

export default AddCustomerButton;
