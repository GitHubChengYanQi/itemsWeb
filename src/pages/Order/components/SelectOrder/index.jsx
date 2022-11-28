import React, {useEffect} from 'react';
import {Select, Spin} from 'antd';
import {useRequest} from '@/util/Request';
import {orderList} from '@/pages/Erp/order/OrderUrl';

const SelectOrder = ({
  value,
  onChange = () => {
  },
}) => {

  const params = {limit: 10, page: 1};

  const {loading, data = [], run} = useRequest({...orderList, params}, {
    manual: true,
    debounceInterval: 300,
  });

  useEffect(() => {
    run({data: {}});
  }, []);

  const options = (!loading && data) ? data.map((item) => {
    return {
      label: item.coding,
      value: item.orderId,
    };
  }) : [];

  return <Select
    allowClear
    value={value}
    placeholder="请选择订单"
    style={{width: '100%'}}
    showSearch
    filterOption={false}
    notFoundContent={loading && <div style={{textAlign: 'center'}}><Spin /></div>}
    options={options}
    onSearch={(string) => {
      run({
        data: {
          coding: string,
        },
        params
      });
    }}
    onChange={(value) => {
      onChange(value);
    }}
  />;
};

export default SelectOrder;
