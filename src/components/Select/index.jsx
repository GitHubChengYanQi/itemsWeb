import React, {useEffect} from 'react';
import {Select as AntSelect, Spin} from 'antd';
import {useRequest} from '@/util/Request';
import {isArray} from '@/util/Tools';

const Select = (
  {
    value,
    api,
    allowClear,
    border,
    data: param,
    resh,
    options,
    showArrow,
    placeholder,
    disabled,
    defaultValue,
    autoFocus,
    onChange = () => {
    },
    style,
    onAdd = () => {
    },
    onSearch = () => {
    },
    addLabel = false,
    width = 200,
    ...other
  }
) => {

  const {loading, data, refresh} = useRequest({...api, data: param}, {manual: !api});

  useEffect(() => {
    if (resh) {
      refresh();
    }
  }, [resh]);

  useEffect(() => {
    if (value && data && !param) {
      const items = data && data.filter((items) => {
        return `${items.value}` === `${value}`;
      });
      if (items && items.length <= 0) {
        onChange(null);
      }
    }
  }, [data, value]);

  let valueArray = [];
  const {mode} = other;
  if (value) {
    if (!Array.isArray(value)) {
      if (mode === 'multiple' || mode === 'tag') {
        const tmpValue = `${value}`.split(',');
        for (let i = 0; i < tmpValue.length; i++) {
          const item = tmpValue[i];
          if (item) {
            valueArray.push(item);
          }
        }
      } else {
        const tmpValue = `${value}`.split(',');
        valueArray = tmpValue[0] || [];
      }
    } else {
      valueArray = value;
    }
  } else if (mode !== 'multiple' && mode !== 'tag') {
    valueArray = null;
  }

  return (
    <div style={{width: width || '100%', ...style}}>
      {
        loading
          ?
          <Spin />
          :
          <AntSelect
            autoFocus={autoFocus}
            // suffixIcon={null}
            // open
            {...other}
            listHeight={200}
            bordered={border}
            options={[...(addLabel ? [{
              label: <a>{addLabel}</a>,
              value: 'add',
            }] : []), ...(options || isArray(data).map((items) => {
              return {
                label: items.label || items.title,
                value: items.value
              };
            }))]}
            defaultValue={defaultValue}
            showArrow={showArrow}
            disabled={disabled}
            placeholder={placeholder}
            style={{width: '100%'}}
            value={valueArray}
            onChange={(value, option) => {
              if (value === 'add') {
                onAdd();
                return;
              }
              onChange(value, option);
            }}
            onSearch={onSearch}
            allowClear={allowClear}
            showSearch
            filterOption={(input, option) => {
              if (typeof option.label !== 'string') {
                return true;
              }
              return option.label && option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
          />}
    </div>
  );
};

export default Select;
