import React, {useState} from 'react';
import {Popover, Select} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {useRequest} from '@/util/Request';
import {UserIdSelect} from '@/pages/Crm/customer/CustomerUrl';

const UserEdit = ({value, onChange,userId}) => {

  const {data} = useRequest(UserIdSelect);

  const [change,setChange] = useState(value);
  const [visiable,setVisiable] = useState();
  const [val,setVal] = useState(userId);


  const datas = data && data.map((items,index)=>{
    return {
      label:<><UserOutlined style={{marginRight:8}} />{items.label}</>,
      value:items.value
    };
  });

  const options = [
    {
      label: '执行者',
      options:[value ? {label:<><UserOutlined style={{marginRight:8}} />{change}</>,value: 'null'} : {label: <><UserOutlined style={{marginRight:8}} />待认领</>,value: 'null'}],
    },
    {
      label: '推荐',
      options:datas,
    },
  ];


  return (
    <div style={{cursor: 'pointer'}}>
      <Popover placement='bottom' open={visiable} onOpenChange={(valuhe)=>{
        setVisiable(valuhe);
      }} trigger='click' content={
        <Select
          showSearch
          filterOption={(input, option) =>typeof option.label === 'object' && option.label.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0}
          defaultValue={val}
          autoFocus
          allowClear
          style={{ width: 250 }}
          options={options}
          onSelect={(value, option)=>{
            onChange(value === 'null' ? null : value);
            setVal(value === 'null' ? null : value);
            setChange(option.label.props.children[1]);
            setVisiable(false);
          }}
        />
      }>
        <div>{change ? <><UserOutlined style={{marginRight: 8}} />{change}</> : <><UserOutlined style={{marginRight: 8}} />待认领</>}</div>
      </Popover>
    </div>
  );
};

export default UserEdit;
