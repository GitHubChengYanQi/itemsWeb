import React from 'react';
import CustomerSelect from '@/pages/Crm/customer/CustomerEdit/components/CustomerSelect';
import AddCustomerButton from '@/pages/Crm/customer/components/AddCustomerButton';


const SelectCustomer = (props) => {

  const {value, onChange, supply = 0, placeholder, dataParams, width, noAdd, selfEnterprise} = props;

  return (
    <>
      <CustomerSelect
        method={false}
        selfEnterprise={selfEnterprise}
        dataParams={dataParams}
        placeholder={placeholder}
        style={{width, marginRight: !noAdd && 8}}
        value={value}
        supply={supply}
        onChange={(value) => {
          onChange(value);
        }}
      />
      {!noAdd && <AddCustomerButton {...props} onChange={(value) => {
        onChange(value && value.customerId);
      }} />}
    </>
  );
};
export default SelectCustomer;
