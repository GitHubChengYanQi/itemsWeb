import React, {useEffect, useState} from 'react';
import {useRequest} from '@/util/Request';
import {Col, Row} from 'antd';
import CustomerSelect from '@/pages/Crm/customer/CustomerEdit/components/CustomerSelect';
import AddCustomerButton from '@/pages/Crm/customer/components/AddCustomerButton';


const SelectCustomer = (props) => {

  const {onChange} = props;


  const [visible, setVisible] = useState(false);

  const [value,setValue] = useState();

  const [blur, setBlur] = useState();


  return (
    <>
      <Row gutter={24}>
        <Col span={15}>
          <CustomerSelect
            method={false}
            value={value}
            onSuccess={async (value) => {
              setValue(value && value.customerName);
              onChange(value);
              setBlur(true);
            }}
            onChange={(value) => {
              onChange(value);
              setValue(value);
              setVisible(true);
              setBlur(false);
            }}
            onblur={()=>{
              if (!blur){
                onChange(null);
              }
            }}
          />
        </Col>
        <Col span={9}>
          <AddCustomerButton {...props} visi={visible} onChange={(value) => {
            setValue(value && value.customerName);
            onChange(value);
            setBlur(true);
          }} />
        </Col>
      </Row>


    </>
  );
};
export default SelectCustomer;
