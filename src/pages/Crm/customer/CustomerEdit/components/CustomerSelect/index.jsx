import React, {useEffect, useState} from 'react';
import {Select, Spin} from 'antd';
import {request, useRequest} from '@/util/Request';
import {customerDetail, customerList} from '@/pages/Crm/customer/CustomerUrl';
import {
  selfEnterpriseDetail,
  selfEnterpriseList,
  supplierDetail,
  supplierList
} from '@/pages/Purshase/Supply/SupplyUrl';

const params = {limit: 5, page: 1};

const CustomerSelect = (props) => {

  const {
    value,
    selfEnterprise,
    placeholder,
    dataParams,
    onChange = () => {
    },
    style,
    onSuccess = () => {
    },
    supply
  } = props;

  const [name, setName] = useState();

  let api = {};
  if (selfEnterprise) {
    api = {...selfEnterpriseList, params};
  } else if (supply === 1) {
    api = {...supplierList, params};
  } else if (supply === 0) {
    api = {...customerList, params};
  }else {
    api = {...supplierList, params};
  }

  let detailApi = {};
  if (selfEnterprise) {
    detailApi = selfEnterpriseDetail;
  } else if (supply === 1) {
    detailApi = supplierDetail;
  } else if (supply === 0) {
    detailApi = customerDetail;
  }else {
    detailApi = supplierDetail;
  }

  const {loading, data, run} = useRequest({
    ...api,
    data: {...dataParams, supply, status: selfEnterprise && 99}
  }, {
    debounceInterval: 300,
  });

  const options = !loading ? data && data.map((value) => {
    return {
      value: value.customerName,
      label: value.customerName,
      id: value.customerId,
    };
  }) : [];
  const defaultValue = async () => {
    const res = await request({
      ...detailApi,
      data: {
        customerId: value
      }
    });
    if (res) {
      setName(res.customerName);
      onChange(res.customerId);
    }
  };

  useEffect(() => {
    if (value) {
      defaultValue();
    }
  }, [value]);


  return (
    <div id="select" style={style}>
      <Select
        options={options}
        style={{width:'100%'}}
        value={name}
        notFoundContent={loading && <div style={{textAlign: 'center', padding: 16}}><Spin /></div>}
        placeholder={placeholder}
        showSearch
        getPopupContainer={() => document.getElementById('select')}
        allowClear
        onChange={(value, option) => {
          onSuccess(option && option.id);
          onChange(option && option.id);
          setName(value);
        }}
        onSearch={(value) => {
          run({
            params,
            data: {
              customerName: value,
              supply,
              ...dataParams,
              status: selfEnterprise && 99
            }
          });
        }}
      />
    </div>
  );
};

export default CustomerSelect;
