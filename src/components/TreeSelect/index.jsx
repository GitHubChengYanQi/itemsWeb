import React, {useEffect} from 'react';
import {TreeSelect as AntTreeSelect} from 'antd';
import {useRequest} from '@/util/Request';

const TreeSelect = (
  {value, api, defaultValue, resh, placeholder, width, ...other}
) => {
  if (!api) {
    throw new Error('Table component: api cannot be empty,But now it doesn\'t exist!');
  }
  const {data, refresh} = useRequest(api);

  useEffect(() => {
    if (resh) {
      refresh();
    }
  }, [resh]);

  if (data) {
    return (<AntTreeSelect
      style={{width: 200}}
      allowClear
      placeholder={placeholder}
      treeData={data}
      value={value ? `${value}` : null} {...other} />);
  } else {
    return null;
  }
};

export default TreeSelect;
