import React, {useEffect} from 'react';
import {Cascader as AntCascader, Spin} from 'antd';
import {useRequest} from '@/util/Request';

const getParentValue = (value, data) => {
  if (!Array.isArray(data)) {
    return [];
  }
  for (let i = 0; i < data.length; i++) {
    if (`${data[i].value}` === `${value}`) {
      return [`${value}`];
    }
    if (data[i].children.length > 0) {
      const values = getParentValue(value, data[i].children);
      if (values.length > 0) {
        return [`${data[i].value}`, ...values];
      }
    }
  }
  return [];
};

const Cascader = (
  {
    autoFocus,
    value,
    width = 200,
    changeOnSelect = true,
    defaultParams = {},
    placeholder,
    resh,
    top,
    api,
    addLabel,
    onAdd = () => {
    },
    options,
    onChange = () => {
    }, ...other
  }
) => {

  const {loading, data, run} = useRequest(api, {defaultParams, manual: !api});

  useEffect(() => {
    if (resh && api) {
      run(defaultParams);
    }
  }, [resh]);

  if (loading)
    return <Spin />;

  const dataSources = options || (top ? [
    {
      value: '0',
      label: '顶级',
      children: data || [],
    }
  ] : (data || []));

  let valueArray = [];
  if ((value || value === 0) && typeof `${value}` === 'string') {
    const $tmpValue = `${value}`;
    if ($tmpValue.indexOf(',') >= 0) {
      const tmpValue = $tmpValue.split(',');
      for (let i = 0; i < tmpValue.length; i++) {
        const item = tmpValue[i];
        if (item) {
          valueArray.push(item);
        }
      }
    } else {
      valueArray = getParentValue($tmpValue, dataSources);
    }
  } else if (Array.isArray(value)) {
    valueArray = value;
  } else {
    valueArray = '';
  }

  const change = (value, option) => {
    const result = value ? value[value.length - 1] : value;
    onChange(result, option);
  };

  const childrenData = (dataSources) => {
    if (!Array.isArray(dataSources) || dataSources.length === 0) {
      return null;
    }
    return dataSources.map((item) => {
      return {
        value: item.value,
        label: item.label,
        children: childrenData(item.children),
      };
    });
  };

  const filter = (inputValue, path) => {
    return path.some(option => typeof option.label === 'string' && option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  };

  return (<AntCascader
    autoFocus={autoFocus}
    // suffixIcon={null}
    // expandIcon={false}
    {...other}
    showSearch={{
      filter,
    }}
    loading={loading}
    style={{width}}
    changeOnSelect={changeOnSelect}
    options={[...(addLabel ? [{
      label: <a>{addLabel}</a>,
      value: 'add',
    }] : []), ...(childrenData(dataSources) || [])]}
    value={valueArray}
    placeholder={placeholder}
    onChange={(value, option) => {
      if (value && value[0] === 'add') {
        onAdd();
        return;
      }
      change(value, option);
    }}
  />);


};

export default Cascader;
