import React, {useEffect, useRef, useState} from 'react';
import {Button, message, Select, Space} from 'antd';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import UserTree from '@/pages/Workflow/Nodes/UserTree';
import Modal from '@/components/Modal';

export const SelectOriginator = ({options, count, index, onChange, defaultValue, value, remove}) => {

  const ref = useRef();

  const [change, setChange] = useState();

  const [selectValue, setSelectValue] = useState(defaultValue);

  useEffect(() => {
    setSelectValue(defaultValue);
  }, [defaultValue]);


  const type = () => {
    switch (selectValue) {
      case 'AppointUser':
        return <Button type="link" onClick={() => {
          ref.current.open(true);
        }}>
          {value[index] && value[index].data && value[index].data.length > 0 ? (value[index].data.map((items) => {
            return items.AppointUser.title;
          })).toString() : '选择'}
        </Button>;
      case 'DepstPositions':
        return <Button type="link" onClick={() => {
          ref.current.open(true);
        }}>
          {value[index] && value[index].data && value[index].data.length > 0 ? (value[index].data.map((items) => {
            return `${items.DepstPositions.title}(${items.DepstPositions.positions && items.DepstPositions.positions.map((items) => {
              return items.label;
            })})`;
          })).toString() : '选择'}
        </Button>;
      case 'AllPeople':
        return null;
      default:
        return <Button type="link" onClick={() => {
          message.warn('请选择发起人');
        }}>选择</Button>;
    }
  };

  return <Space>
    <Button
      type="link"
      disabled={count === 1}
      icon={<DeleteOutlined />}
      onClick={() => {
        typeof remove === 'function' && remove(selectValue);
      }}
      danger
    />
    <Select value={selectValue} placeholder="请选择" options={options} onChange={(value) => {
      setSelectValue(value);
      switch (value) {
        case 'AppointUser':
          typeof onChange === 'function' && onChange({type: value, data: []});
          break;
        case 'DepstPositions':
          typeof onChange === 'function' && onChange({type: value, data: []});
          break;
        case 'AllPeople':
          typeof onChange === 'function' && onChange({type: value});
          break;
        default:
          break;
      }
    }}
    />
    {type()}
    <Modal
      ref={ref}
      width={600}
      footer={
        <Button type="primary" onClick={() => {
          typeof onChange === 'function' && onChange({type: selectValue, ...change});
          ref.current.close();
        }}>
          保存
        </Button>
      }>
      <div style={{padding: 16}}>
        <UserTree type={selectValue} value={value[index]} onChange={(value) => {
          setChange(value);
        }} />
      </div>
    </Modal>
  </Space>;
};


const Originator = ({value, onChange, hidden}) => {

  const config = (array) => {
    return [
      {
        label: '指定人',
        value: 'AppointUser',
        disabled: array.filter((value) => {
          return value.type === 'AppointUser';
        }).length > 0
      },
      {
        label: '部门+职位',
        value: 'DepstPositions',
        disabled: array.filter((value) => {
          return value.type === 'DepstPositions';
        }).length > 0
      },
      {
        label: '所有人',
        value: 'AllPeople',
        disabled:  array.filter((value) => {
          return value.type === 'AllPeople';
        }).length > 0
      },
    ];
  };

  const [change, setChange] = useState(value || []);

  const [options, setOptions] = useState(config(value || []));

  const [count, setCount] = useState(1);

  const refreshConfig = (array) => {

    setOptions(config(array));
  };


  useEffect(() => {
    const counts = options && options.filter((value) => {
      return value.disabled;
    });
    setCount(counts && counts.length > 0 ? counts.length : 1);
  }, []);

  const selects = (index, value) => {
    return <div key={index} style={{marginBottom: 16}}>
      <SelectOriginator
        options={options}
        count={count}
        index={index}
        defaultValue={value}
        remove={(value) => {
          if (value) {
            change.splice(index, 1);
            refreshConfig(change);
            hidden && typeof onChange === 'function' && onChange(change);
          }
          setCount(count - 1);
        }}
        value={change}
        onChange={(value) => {
          const array = change;
          array[index] = value;
          setChange(array);
          refreshConfig(change);
          hidden && typeof onChange === 'function' && onChange(change);
        }} />
    </div>;
  };

  const add = () => {
    const array = new Array(count);
    for (let i = 0; i < count; i++) {
      array.push(selects(i, change[i] && change[i].type));
    }
    return array;
  };

  return <>
    {add()}
    <div style={{marginTop: 16}}>
      <Space>
        <Button type="dashed" disabled={count === options.length} onClick={() => {
          setCount(count + 1);
        }}><PlusOutlined />增加</Button>
        <Button type="primary" hidden={hidden} onClick={() => {
          refreshConfig(change);
          typeof onChange === 'function' && onChange(change);
        }}>保存</Button>
      </Space>
    </div>
  </>;
};

export default Originator;
